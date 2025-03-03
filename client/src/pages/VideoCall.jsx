import React, { useState, useEffect, useRef } from "react";
import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VideoCall = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:5000/verify-token", {
          withCredentials: true,
        });
      } catch (error) {
        navigate("/login?redirect=/video-call");
      }
    };
    checkAuth();
  }, [navigate]);

  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  return (
    <AgoraRTCProvider client={client}>
      <VideoCallInterface />
    </AgoraRTCProvider>
  );
};

const VideoCallInterface = () => {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [channel, setChannel] = useState("");
  const [token, setToken] = useState(null);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [remoteUserNames, setRemoteUserNames] = useState({});
  const remoteUsersPollingRef = useRef(null);
  
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  const remoteUsers = useRemoteUsers();

  // Fetch user information on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userResponse = await axios.get("http://localhost:5000/current-user", {
          withCredentials: true
        });
        
        setCurrentUser(userResponse.data);
        console.log("Current user info loaded:", userResponse.data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    
    fetchUserInfo();
  }, []);

  // Fetch token when joining channel
  useEffect(() => {
    const fetchToken = async () => {
      if (!channel || !calling || !currentUser) return;
      
      try {
        // Generate token using currentUser info
        const res = await axios.post(
          "http://localhost:5000/video/generate-token",
          { 
            channelName: channel, 
            role: "publisher"
          },
          { withCredentials: true }
        );
        
        console.log("Received Agora Token:", res.data);
        setToken(res.data.agoraToken);
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };

    if (calling && currentUser) {
      fetchToken();
    }
  }, [calling, channel, currentUser]);

  // Setup polling for remote user names
  useEffect(() => {
    const fetchRemoteUserNames = async () => {
      if (!channel || !isConnected) return;
      
      try {
        const response = await axios.get(`http://localhost:5000/video/channel-users?channelName=${channel}`, {
          withCredentials: true
        });
        
        const userMap = response.data.reduce((acc, user) => {
          acc[user.userId] = user.displayName;
          return acc;
        }, {});
        
        console.log("Remote users in channel:", userMap);
        setRemoteUserNames(userMap);
      } catch (error) {
        console.error("Failed to fetch remote user names:", error);
      }
    };
    
    if (isConnected && channel) {
      // Initial fetch
      fetchRemoteUserNames();
      
      // Set up polling interval
      remoteUsersPollingRef.current = setInterval(fetchRemoteUserNames, 3000);
      
      return () => {
        if (remoteUsersPollingRef.current) {
          clearInterval(remoteUsersPollingRef.current);
        }
      };
    }
  }, [isConnected, channel]);

  // Join the RTC channel when token is available
  useJoin(
    {
      appid: import.meta.env.VITE_AGORA_APP_ID,
      channel: channel,
      token: token || null,
      uid: currentUser?.id, // Use the user ID from backend as UID
    },
    calling && token !== null && currentUser?.id
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Helper function to get user name by UID
  const getUserName = (user) => {
    if (!user) return "Unknown";
    return remoteUserNames[user.uid] || `User ${user.uid}`;
  };

  // Notify backend when leaving the channel
  const handleEndCall = async () => {
    try {
      if (currentUser?.id) {
        await axios.post(
          "http://localhost:5000/video/leave-channel",
          {
            channelName: channel,
            userId: currentUser.id,
          },
          { withCredentials: true }
        );
      }
    } catch (error) {
      console.error("Error notifying leave channel:", error);
    }
    
    setCalling(false);
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Clean up interval
      if (remoteUsersPollingRef.current) {
        clearInterval(remoteUsersPollingRef.current);
      }
      
      // Notify backend when component unmounts if still in a call
      if (isConnected && channel && currentUser?.id) {
        axios.post(
          "http://localhost:5000/video/leave-channel",
          {
            channelName: channel,
            userId: currentUser.id,
          },
          { withCredentials: true }
        ).catch(error => {
          console.error("Error notifying leave channel on unmount:", error);
        });
      }
    };
  }, [isConnected, channel, currentUser]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="bg-gray-800 text-white p-4 text-center">
        {isConnected ? (
          <h2 className="text-xl font-semibold">In Call: {channel}</h2>
        ) : (
          <h2 className="text-xl font-semibold">Start a Video Call</h2>
        )}
      </div>
      
      <div className="flex-1 flex justify-center items-center p-4">
        {!isConnected ? (
          <div className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <p className="text-lg">Welcome, {currentUser?.username || "User"}</p>
            <input
              onChange={(e) => setChannel(e.target.value)}
              placeholder="Enter Channel Name"
              value={channel}
              className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              disabled={!channel || !currentUser} 
              onClick={() => setCalling(true)}
              className={`p-3 rounded-md text-white text-base transition-colors ${
                !channel || !currentUser 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              <span>Join Channel</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full">
            <div className="relative w-full h-72 bg-gray-800 rounded-lg overflow-hidden">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                playAudio={false}
                videoTrack={localCameraTrack}
                style={{ width: "100%", height: "100%" }}
              >
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {currentUser?.username || "You"}
                </div>
              </LocalUser>
            </div>
            
            {remoteUsers.map((user) => (
              <div key={user.uid} className="relative w-full h-72 bg-gray-800 rounded-lg overflow-hidden">
                <RemoteUser user={user} style={{ width: "100%", height: "100%" }}>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {getUserName(user)}
                  </div>
                </RemoteUser>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {isConnected && (
        <div className="flex justify-center gap-4 p-4 bg-gray-800">
          <button 
            onClick={() => setMic((prev) => !prev)}
            className={`px-6 py-3 rounded-md text-white transition-colors ${
              micOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
            }`}
          >
            {micOn ? "Disable Mic" : "Enable Mic"}
          </button>
          <button 
            onClick={() => setCamera((prev) => !prev)}
            className={`px-6 py-3 rounded-md text-white transition-colors ${
              cameraOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
            }`}
          >
            {cameraOn ? "Disable Camera" : "Enable Camera"}
          </button>
          <button 
            onClick={handleEndCall}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            End Call
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;