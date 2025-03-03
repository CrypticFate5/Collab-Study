import express from "express";
import { PrismaClient } from "@prisma/client";
import { Role, RtcTokenBuilder } from "agora-token/src/RtcTokenBuilder2.js";
import { Role as RtcRole } from "agora-token/src/RtcTokenBuilder2.js";

const router = express.Router();
const prisma = new PrismaClient();

// Store user data in memory (in production, use a database)
const channelUsers = {};

// Middleware to check authentication
const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

// Generate Agora Token
const generateAgoraToken = (channelName, uid, role) => {
  const tokenExpirationInSecond = 3600;
  const privilegeExpirationInSecond = 3600;
  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID,
    process.env.AGORA_APP_CERT,
    channelName,
    uid,  // Use actual numeric uid instead of 0
    role,
    tokenExpirationInSecond,
    privilegeExpirationInSecond
  );
  console.log("token: ", token);
  return token;
};

// Auto register user in channel with username from token
router.post("/generate-token", authenticateToken, async (req, res) => {
  console.log("Generating Agora token");
  const { channelName, role = "publisher" } = req.body;
  
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  // Get full user details from database to ensure we have the username
  const user = await prisma.users.findUnique({ where: { id: req.user.userId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  
  // Use the user.id as the uid for Agora
  const uid = user.id;
  let agoraRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const agoraToken = generateAgoraToken(channelName, uid, agoraRole);
  
  // Automatically register user in channel with username from database
  if (!channelUsers[channelName]) {
    channelUsers[channelName] = {};
  }
  
  // Store user info with database username
  channelUsers[channelName][uid] = {
    userId: uid,
    displayName: user.username,
    joinedAt: new Date()
  };
  
  console.log(`User ${user.username} (${uid}) registered with token in channel ${channelName}`);
  
  res.json({ 
    agoraToken,
    uid: uid,
    username: user.username
  });
});

// Get all users in a channel
router.get('/channel-users', authenticateToken, (req, res) => {
  const { channelName } = req.query;
  
  if (!channelName) {
    return res.status(400).json({ error: 'Channel name is required' });
  }
  
  // Get all users for this channel
  const users = channelUsers[channelName] || {};
  
  // Convert to array format
  const userArray = Object.values(users);
  
  res.status(200).json(userArray);
});

// Notify when a user leaves
router.post('/leave-channel', authenticateToken, (req, res) => {
  const { channelName, userId } = req.body;
  
  if (!channelName || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Remove user from channel
  if (channelUsers[channelName] && channelUsers[channelName][userId]) {
    delete channelUsers[channelName][userId];
    console.log(`User ${userId} left channel ${channelName}`);
  }
  
  res.status(200).json({ success: true });
});

export default router;