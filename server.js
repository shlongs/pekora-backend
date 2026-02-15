const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Mock Database (Replace with MongoDB or PostgreSQL)
const extensionData = {}; 

// Endpoint: Get a user's custom profile data
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json(extensionData[userId] || { theme: null, nameEffect: null, bgUrl: null, isWeb3GL: false, badges: [] });
});

app.post('/api/users/update', (req, res) => {
    // We now accept the new customization variables
    const { userId, bgUrl, nameEffect, isWeb3GL, nameplateUrl, glassBlur } = req.body;
    
    if (!extensionData[userId]) extensionData[userId] = { badges: [] };
    
    // Save everything to the user's profile
    extensionData[userId] = { 
        ...extensionData[userId], 
        bgUrl, 
        nameEffect, 
        isWeb3GL, 
        nameplateUrl, 
        glassBlur: glassBlur || "12px" 
    };
    
    res.json({ success: true });
});

// Endpoint: Admin Panel - Give Badge
app.post('/api/admin/giveBadge', (req, res) => {
    const { adminId, targetUserId, badgeName } = req.body;
    
    if (adminId !== '13822') {
        return res.status(403).json({ error: "Unauthorized. Nice try." });
    }

    if (!extensionData[targetUserId]) extensionData[targetUserId] = { badges: [] };
    if (!extensionData[targetUserId].badges.includes(badgeName)) {
        extensionData[targetUserId].badges.push(badgeName);
    }
    res.json({ success: true, badges: extensionData[targetUserId].badges });
});


app.listen(3000, () => console.log('Pekora Extension API running on port 3000'));
