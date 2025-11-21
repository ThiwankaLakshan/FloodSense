const { query } = require('../config/database');
const logger = require('../config/logger');

class RiskService {

    async calculateRiskForLocation(locationId) {
        try {
                const locationResult = await query(
                'SELECT * FROM locations WHERE id = $1',
                [location_id]
            );

            if (locationResult.rows.length === 0) {
                throw new Error(`Location ${locationId} not found`);
            }

            const location = locationResult.rows[0];

            //get latest weather data
            const weatherResult = await query(
                `SELECT * FROM weather_data
                WHERE location_id = $1
                ORDER BY timestamp DESC LIMIT 1`,
                [locationId]
            );

            if (weatherResult.rows.length === 0) {
                logger.warn(`No weather available for location ${locationId}`);
                return null;
            }

            const weather = weatherResult.rows[0];

            //calculate 24h and 72 rainfall
            const rainfall24h = await this.getRainfall(locationId, 24);
            const rainfall72h = await this.getRainfall(locationId, 72);

            //get historical flood count
            const floodCountResult = await query(
                `SELECT COUNT(*) as count FROM historical_floods
                WHERE location_id = $1 AND flood_date > NOW() - INTERVAL '5 years'`,
                [locationId]
            );
            const historicalFloodCount = parseInt(floodCountResult.rows[0].count);

            //calculate risk score
            const riskScore = this.calculateRiskScore({
                rainfall24h,
                rainfall72h,
                elevation: location.elevation,
                historicalFloodCount,
                currentRainfall: weather.rainfall_1h
            });

            const riskLevel = this.getRiskLevel(riskScore);

            //save risk assessment
            await query(
                `INSERT INTO risk_assessments
                (location_id, risk_level, risk_score, rainfall_24h, rainfall_72h)
                VALUES ($1, $2, $3, $4, $5)`,
                [locationId, riskLevel, riskScore, rainfall24h, rainfall72h]
            );

            logger.info( `Risk calculated for ${location.name}: ${riskLevel} (score: ${riskScore}) `);

            return {
                location_id: locationId,
                location_name: location.name,
                risk_level: riskLevel,
                risk_score: riskScore,
                rainfall_24h: rainfall24h,
                rainfall_72h: rainfall72h
            };
        }catch (error) {
            logger.error(`Error calculating risk for location ${locationId}: `,error);
            throw error;
        } 
    }
    async getRainfall(locationId, hours) {
    try {
        const result = await query(
            `SELECT SUM(rainfall_24h) as total
            FROM weather_data
            WHERE location_id = $1
            AND timestamp > NOW() - INTERVAL '${hours} hours'`,
            [locationId]
        );

        return parseFloat(result.rows[0]?.total || 0);

    } catch (error) {
        logger.error(`Error getting ${hours}h rainfall for location ${locationId}:`, error);
        throw error;
    }
    }

    calculateRiskScore({ rainfall24h, rainfall72h, elevation, historicalFloodCount, currentRainfall }) {

        let score = 0;

        //rainfall factors (0 - 40 points)
        if( rainfall24h > 150) score += 20;
        else if (rainfall24h > 100) score += 15;
        else if (rainfall24h > 50) score +=10;
        else if (rainfall24h > 25) score += 5;

        if ( rainfall72h > 300) score += 20;
        else if (rainfall72h > 200) score += 15;
        else if (rainfall72h > 100) score += 10;
        else if (rainfall72h > 50) score += 5;

        //elevation factor (0 - 20 points)
        if ( elevation < 3) score += 20;
        else if (elevation < 5) score += 15;
        else if (elevation < 8) score += 10;
        else if (elevation < 12) score += 5;

        //historical flood factor (0 - 20 points)
        if ( historicalFloodCount > 10) score += 20;
        else if(historicalFloodCount > 5) score += 15;
        else if(historicalFloodCount > 2) score += 10;
        else if(historicalFloodCount > 0) score += 5;

        //current rainfall intensity (0 -20 points)
        if( currentRainfall > 50) score += 20;
        else if(currentRainfall > 25) score += 15;
        else if(currentRainfall > 10) score += 10;
        else if(currentRainfall > 5) score += 5;

        return Math.min(score, 100);
    }

    getRiskLevel(score) {
        if (score >= 75) return 'CRITICAL';
        if (score >= 50) return 'HIGH';
        if (score >= 25) return 'MODERATE';
        return 'LOW';
    }

}

module.exports = new RiskService();

