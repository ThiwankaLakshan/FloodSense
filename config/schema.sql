-- location table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    gn_division VARCHAR(255),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    elevation INT,
    population INT,
    geom GEOMETRY(POINT, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- create spatial index
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);


-- weather data table
CREATE TABLE weather_data (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id),
    timestamp TIMESTAMP NOT NULL,
    temperature DECIMAL(5, 2),
    humidity INT,
    rainfall_1h DECIMAL(6, 2),
    rainfall_24h DECIMAL(6, 2),
    rainfall_72h DECIMAL(6, 2),
    wind_speed DECIMAL(5, 2),
    pressure INT,
    weather_condition VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weather_location_time ON weather_data(location_id, timestamp DESC);


-- risk assessments table
CREATE TABLE risk_assessments(
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id),
    timestamp TIMESTAMP NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    risk_score INT NOT NULL,
    factors JSONB,
    rainfall_24h DECIMAL(6, 2),
    rainfall_72h DECIMAL(6, 2),
    elevation_factor INT,
    season_factor INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_location_time ON risk_assessments(location_id, timestamp DESC);


-- alerts table

CREATE TABLE alerts(
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id),
    risk_assessment_id INT REFERENCES risk_assessments(id),
    alert_type VARCHAR(20) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_status ON alerts(status, created_at);


-- alert subscriptions table

CREATE TABLE alert_subscriptions (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    min_risk_level VARCHAR(20) DEFAULT 'MODERATE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- historical floods table 
CREATE TABLE historical_floods (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES locations(id),
    flood_date DATE NOT NULL,
    severity VARCHAR(20),
    casualties INT DEFAULT 0,
    affected_population INT,
    damage_estimate DECIMAL(12, 2),
    description TEXT,
    source VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- system logs table

CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    log_type VARCHAR(50) NOT NULL,
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_type_time ON system_logs(log_type, created_at DESC);