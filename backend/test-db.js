const pool = require('./config/database');

async function testDatabase(){
    try {
        //test connection
        const result = await pool.query('SELECT NOW()');
        console.log('Database connection successful!');
        console.log('current time from DB: ', result.rows[0].now);

        //test location query
        const locations = await pool.query('SELECT COUNT(*) FROM locations');
        console.log('Locations count: ', locations.rows[0].count);

        process.exit(0);

    } catch (err){
        console.log('Database test failed: ', err);
        process.exit(1);
    }
}

testDatabase();