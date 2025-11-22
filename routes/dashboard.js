const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/summary', async (req,res) => {
    try {
        const locationsCount = await pool.query(
            `SELECT COUNT(*) as count FROM locations`
        );

        const riskDist = await pool.query(
            `SELECT
            risk_level,
            COUNT(*) as count
        FROM (
            SELECT DISTINCT ON (location_id)
                location_id, risk_level
            FROM risk_assessments
            ORDER BY location_id, timestamp desc
            ) latest_risks
            GROUP BY risk_level`
        );

        const riskDistribution = {
            CRITICAL: 0,
            HIGH: 0,
            MODERATE: 0,
            LOW: 0
        };

        riskDist.rows.forEach(row => {
            riskDistribution[row.risk_level] = parseInt(row.count);
        });

        const lastUpdate = await pool.query(
            `SELECT MAX(timestamp) as last_update
            FROM weather_data`
        );

        res.json({
            data: {
                totalLocations: parseInt(locationsCount.rows[0].count),
                riskDistribution,
                lastUpdate: lastUpdate.rows[0].last_update
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard summary: ',error);
        res.status(500).json({
            error: 'Failed to fetch dashboard summary'
        });
    }
});

module.exports = router;