const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/:id/risk-history', async (req,res) => {
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
            risk_level,
            risk_score,
            factors,
            rainfall_24h,
            rainfall_72h
        FROM risk_assessments
        WHERE location_id = $1
        AND timestamp >= NOW() - INTERVAL '${interval}'
        `;

        const result = await pool.query(query, [id]);

        res.json({
            period,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching risk history: ',error);
        res.status(500).json({
            error: 'Failed to fetch risk history'
        });
    }
});

module.exports = router;