const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/:id/weather-history', async (req,res) => {
    try {
        const { id } = req.params;
        const { period = '7d' } = req.query;

        const intervalMap = {
            '24h': '24 hours',
            '7d': '7 days',
            '30d': '30 days'
        };

        const interval = intervalMap[period] || '7 days';

        const query = 
        `SELECT
            timestamp,
            temperature,
            humidity,
            rainfall_1h,
            rainfall_24h,
            wind_speed,
            weather_condition
        FROM weather_data
        WHERE location_id = $1
        AND timestamp >= NOW() - INTERVAL '${interval}'
        ORDER BY timestamp ASC`;

        const result = await pool.query(query, [id]);

        res.json({
            period,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching weather history: ',error);
        res.status(500).json({
            error: 'Failed to fetch weather history'
        });
    }
});

module.exports = router;