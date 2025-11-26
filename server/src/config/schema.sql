
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR (150),
    fullname VARCHAR (150),
    email VARCHAR(150),
    phone_number VARCHAR(150),
    password_hash TEXT,
    role VARCHAR(20),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


CREATE TABLE beds (
    bed_id SERIAL PRIMARY KEY,
    bed_number TEXT NOT NULL,         -- e.g., "Bed 1"
    bed_code TEXT UNIQUE NOT NULL,    -- e.g., "BED-CODE-11"
    bed_name TEXT NOT NULL,           -- e.g., "Lettuce Bed"
    location TEXT,                    -- e.g., "RIGHT", "LEFT"
    is_watering BOOLEAN DEFAULT FALSE, -- TRUE if currently watering
    last_avg_moisture NUMERIC,        -- Latest moisture reading
    min_moisture NUMERIC NOT NULL DEFAULT 30, -- Start watering below this %
    max_moisture NUMERIC NOT NULL DEFAULT 70, -- Stop watering above this %
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE sensors (
    sensor_id SERIAL PRIMARY KEY,
    bed_id NOT NULL,
    sensor_type VARCHAR(100) NOT NULL,
    sensor_code VARCHAR(50) NOT NULL,
    unit VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


CREATE TABLE sensor_readings (
   reading_id SERIAL PRIMARY KEY,
   sensor_id NOT NULL,
   value DECIMAL(6,2) NOT NULL,
   recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)


