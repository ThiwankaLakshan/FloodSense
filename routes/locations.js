const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/',async (req,res) => {
    try {
        const query = `
        SELECT
            l.*,
            r.risk_level,
            r.risk_score,
            r.risk_color,
            r.timestamp as risk_timestamp
        FROM locations l
        LEFT JOIN LATERAL (
            SELECT risk_level, risk_score,
                (factors::json->0->>'color') as risk_color,
                timestamp
            FROM risk_assessments
            WHERE location_id = l.id
            ORDER BY timestamp desc
            LIMIT 1
        ) r ON true
        ORDER BY l.district, l.name
        `;

        const result = await pool.query(query);

        res.json({
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching locations: ',error);
        res.status(500).json({
            error: 'Failed to fetch locations'
        });
    }
});


router.get('/:id', async (req,res) => {
    try{
        const { id } = req.params;

        const locationResult = await pool.query(
            `SELECT * FROM locations WHERE id = $1`,
            [id]
        );

        if (locationResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Location not found'
            });
        }

        const location = locationResult.rows[0];

        const weatherResult = await pool.query(
            `SELECT * FROM weather_data
            WHERE location_id = $1
            ORDER BY timestamp desc
            LIMIT 1`,
            [id]
        );

        const riskResult = await pool.query(
            `SELECT * FROM risk_assessments
            WHERE location_id = $1
            ORDER BY timestamp desc 
            LIMIT 1`,
            [id]
        );

        res.json({
            data: {
                location,
                currentWeather: weatherResult.rows[0] || null,
                currentRisk: riskResult.rows[0] || null
            }
        });
    } catch (error) {
        console.error('Error fetching location:',error);
        res.status(500).json({
            error: 'Failed to fetch location'
        });
    }
});

module.exports = router;