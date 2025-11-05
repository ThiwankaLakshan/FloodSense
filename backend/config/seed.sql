-- Seed locations (Western Province high-risk areas)
INSERT INTO locations (name, district, gn_division, latitude, longitude, elevation, population, geom) VALUES
('Wellampitiya', 'Colombo', 'Kolonnawa', 6.9497, 79.9258, 3, 45000, ST_SetSRID(ST_MakePoint(79.9258, 6.9497), 4326)),
('Kelanimulla', 'Colombo', 'Kolonnawa', 6.9525, 79.9311, 4, 38000, ST_SetSRID(ST_MakePoint(79.9311, 6.9525), 4326)),
('Gotatuwa', 'Colombo', 'Kolonnawa', 6.9563, 79.9342, 5, 32000, ST_SetSRID(ST_MakePoint(79.9342, 6.9563), 4326)),
('Malabe', 'Colombo', 'Kaduwela', 6.9094, 79.9528, 8, 55000, ST_SetSRID(ST_MakePoint(79.9528, 6.9094), 4326)),
('Angoda', 'Colombo', 'Kaduwela', 6.9228, 79.9275, 6, 42000, ST_SetSRID(ST_MakePoint(79.9275, 6.9228), 4326)),
('Kottikawatte', 'Colombo', 'Borella', 6.9172, 79.8747, 5, 28000, ST_SetSRID(ST_MakePoint(79.8747, 6.9172), 4326)),
('Mattakkuliya', 'Colombo', 'Colombo North', 6.9656, 79.8603, 2, 35000, ST_SetSRID(ST_MakePoint(79.8603, 6.9656), 4326)),
('Grandpass', 'Colombo', 'Colombo North', 6.9447, 79.8564, 3, 40000, ST_SetSRID(ST_MakePoint(79.8564, 6.9447), 4326)),
('Gampaha', 'Gampaha', 'Gampaha', 7.0914, 80.0140, 12, 75000, ST_SetSRID(ST_MakePoint(80.0140, 7.0914), 4326)),
('Biyagama', 'Gampaha', 'Biyagama', 6.9636, 80.0089, 10, 48000, ST_SetSRID(ST_MakePoint(80.0089, 6.9636), 4326)),
('Wattala', 'Gampaha', 'Wattala', 6.9889, 79.8917, 4, 62000, ST_SetSRID(ST_MakePoint(79.8917, 6.9889), 4326)),
('Kelaniya', 'Gampaha', 'Kelaniya', 6.9553, 79.9200, 7, 58000, ST_SetSRID(ST_MakePoint(79.9200, 6.9553), 4326)),
('Kalutara', 'Kalutara', 'Kalutara', 6.5833, 79.9611, 5, 42000, ST_SetSRID(ST_MakePoint(79.9611, 6.5833), 4326)),
('Panadura', 'Kalutara', 'Panadura', 6.7133, 79.9025, 3, 38000, ST_SetSRID(ST_MakePoint(79.9025, 6.7133), 4326)),
('Wadduwa', 'Kalutara', 'Wadduwa', 6.6669, 79.9281, 2, 25000, ST_SetSRID(ST_MakePoint(79.9281, 6.6669), 4326));

-- Seed historical floods (major events)
INSERT INTO historical_floods (location_id, flood_date, severity, casualties, affected_population, description, source) VALUES
(1, '2016-05-17', 'SEVERE', 4, 172000, 'Heavy monsoon rains caused widespread flooding in Colombo and surrounding areas. Kelani River overflowed.', 'ReliefWeb'),
(2, '2016-05-17', 'SEVERE', 3, 122000, 'Gampaha district severely affected by monsoon floods.', 'ReliefWeb'),
(1, '2017-05-26', 'CATASTROPHIC', 8, 185000, 'Kelani River reached 15.44m water level, causing catastrophic flooding.', 'Wikipedia - 2017 Sri Lanka Floods'),
(9, '2018-05-23', 'MODERATE', 0, 45000, 'Moderate flooding in Gampaha town due to heavy rainfall.', 'Disaster Management Centre'),
(1, '2024-06-03', 'SEVERE', 2, 159000, 'Southwest monsoon intensified, causing severe flooding across Western Province.', 'ReliefWeb'),
(12, '2024-06-03', 'SEVERE', 3, 78000, 'Kelaniya area heavily flooded, schools closed.', 'Save the Children');