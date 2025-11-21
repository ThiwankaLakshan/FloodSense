const { activitiesUrl } = require("twilio/lib/jwt/taskrouter/util");
const { level } = require("winston");

module.exports = {
    //rainfall scoring rules
    rainfall: {
        rainfall24h: [
            { min: 200, score: 4, label: 'Extreme 24h rainfall' },
            { min: 150, score: 3, label: 'Very heavy 24h rainfall' },
            { min: 100, score: 2, label: 'Heavy 24h rainfall' },
            { min: 50, score: 1, label: 'Moderate 24h rainfall' }
        ],
        rainfall72h: [
            { min: 400, score: 4, label: 'Extreme 72h rainfall' },
            { min: 300, score: 3, label: 'Very heavy 72h rainfall' },
            { min: 200, score: 2, label: 'Heavy 72h rainfall' },
            { min: 100,score: 1, label: 'Moderate 72h  rainfall' }
        ]
    },

    //elevation scoring
    elevation: [
        { max: 5, score: 3, label: 'Extremely low elevation' },
        { max: 10, score: 2, label: 'Very low elevation' },
        { max: 25, score: 1, label: 'low elevation' }
    ],

    //season scoring
    season: [
        { months: [5, 6, 7, 8, 9], score: 2, label: 'SW Monsoon season' },
        { months: [10, 11, 12, 1], score: 2, label: 'NE Monsoon season' },
        { months: [3, 4], score: 1, label: 'Inter-Monsoon period' }
    ],

    //historical flood frequency
    historicalFlood: [
        { floodsLast5Years: 3, score: 2, label: 'Frequently flooded area' },
        { floodsLast5Years: 1, score: 1, label: 'Previously flooded area' }
    ],

    //risk level mapping
    riskLevels: [
        {
            minScore: 9,
            level: 'CRITICAL',
            color: '#DC2626',
            action: 'Evacuate immediately to higher ground'
        },
        {
            minScore: 6,
            level: 'HIGH',
            color: '#F97316',
            action: 'Prepare to evacuate - secure property and gather emergency supplies'
        },
        {
            minScore: 3,
            level: 'MODERATE',
            color: '#EAB308',
            action: 'Stay alert - monitor updates and review evacuation plan'
        },
        {
            minScore: 0,
            level: 'LOW',
            color: '#22C55E',
            action: 'Normal conditions - maintain general awareness'
        }
    ]
}