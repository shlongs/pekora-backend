const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS so the Chrome Extension isn't blocked by security protocols
app.use(cors());
app.use(express.json());

// Mock Database (Stored in RAM)
// ⚠️ Note: If you are on Render's free tier, this will reset if the server goes to sleep!
const extensionData = {}; 

// Endpoint: Get a user's custom profile data
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    console.log(`[GET] Fetching profile data for User: ${userId}`);
    
    // Send the user's data, OR send a properly formatted blank slate so the frontend doesn't crash
    const userData = extensionData[userId] || { 
        theme: null, 
        nameEffect: null, 
        bgUrl: null, 
        isWeb3GL: false, 
        nameplateUrl: null,
        glassBlur: "12px",
        badges: [] 
    };
    
    res.json(userData);
});

// Endpoint: Update user settings
app.post('/api/users/update', (req, res) => {
    const { userId, bgUrl, nameEffect, isWeb3GL, nameplateUrl, glassBlur } = req.body;
    console.log(`[POST] Saving profile data for User: ${userId}`);
    
    // Initialize user if they don't exist yet
    if (!extensionData[userId]) {
        extensionData[userId] = { badges: [] };
    }
    
    // Save everything to the user's profile
    extensionData[userId] = { 
        ...extensionData[userId], 
        bgUrl: bgUrl || null, 
        nameEffect: nameEffect || null, 
        isWeb3GL: isWeb3GL || false, 
        nameplateUrl: nameplateUrl || null, 
        glassBlur: glassBlur || "12px" 
    };
    
    res.json({ success: true, data: extensionData[userId] });
});

// Endpoint: Admin Panel - Give Badge
app.post('/api/admin/giveBadge', (req, res) => {
    const { adminId, targetUserId, badgeName } = req.body;
    console.log(`[ADMIN] User ${adminId} attempting to deploy badge to ${targetUserId}`);
    
    // Security Check
    if (adminId !== '13822') {
        console.log(`[ADMIN] DENIED. ${adminId} is not the master admin.`);
        return res.status(403).json({ error: "Unauthorized. Nice try." });
    }

    // Initialize target user if they don't exist in the database yet
    if (!extensionData[targetUserId]) {
        extensionData[targetUserId] = { 
            theme: null, nameEffect: null, bgUrl: null, isWeb3GL: false, 
            nameplateUrl: null, glassBlur: "12px", badges: [] 
        };
    }

    // Failsafe to ensure the badges array exists
    if (!extensionData[targetUserId].badges) {
        extensionData[targetUserId].badges = [];
    }

    // Prevent duplicate badges
    if (!extensionData[targetUserId].badges.includes(badgeName)) {
        extensionData[targetUserId].badges.push(badgeName);
        console.log(`[ADMIN] SUCCESS. Badge attached to ${targetUserId}.`);
    } else {
        console.log(`[ADMIN] User ${targetUserId} already has this badge.`);
    }
    
    res.json({ success: true, badges: extensionData[targetUserId].badges });
});

// Start the server
app.listen(3000, () => {
    console.log('✅ KoroPlus Backend API running on port 3000');
});


app.listen(3000, () => console.log('Pekora Extension API running on port 3000'));

