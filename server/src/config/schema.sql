CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(150),
    fullname VARCHAR(150),
    email VARCHAR(150),
    phone_number VARCHAR(150),
    password_hash TEXT,
    role VARCHAR(20),
    status VARCHAR(20),
    profile_pic VARCHAR(255),      
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    refresh_token TEXT NOT NULL,
    device JSONB,
    device_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tray_groups (
    tray_group_id SERIAL PRIMARY KEY,
    tray_group_name VARCHAR(100),
    min_moisture NUMERIC NOT NULL,
    max_moisture NUMERIC NOT NULL,
    is_watering BOOLEAN DEFAULT FALSE,
    plant_type VARCHAR(50),  
    soil_type VARCHAR(50),   
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trays (
    tray_id SERIAL PRIMARY KEY,
    tray_group_id INT REFERENCES tray_groups(tray_group_id),
    plant VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    CONSTRAINT fk_tray_group
        FOREIGN KEY (tray_group_id)
        REFERENCES tray_groups(tray_group_id)
        ON DELETE CASCADE
);


CREATE TABLE plant_batches (
    batch_id SERIAL PRIMARY KEY,
    tray_id INT NOT NULL,
    plant_name VARCHAR(100) NOT NULL,
    total_seedlings INT DEFAULT NULL,    
    alive_seedlings INT DEFAULT NULL,    
    dead_seedlings INT DEFAULT NULL,    
    replanted_seedlings INT DEFAULT NULL, 
    fully_grown_seedlings INT DEFAULT NULL,
    growth_stage VARCHAR(50) DEFAULT 'Seedling',
    date_planted DATE NOT NULL,
    expected_harvest_days INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Growing', 
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_tray
        FOREIGN KEY (tray_id)
        REFERENCES trays(tray_id)
        ON DELETE CASCADE
);


CREATE TABLE sensors(   
    sensor_id SERIAL PRIMARY KEY,
    tray_id INT REFERENCES trays(tray_id)
    sensor_type VARCHAR(100),
    status VARCHAR(40),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE sensor_readings (
   reading_id SERIAL PRIMARY KEY,
   sensor_id INT NOT NULL REFERENCES sensors(sensor_id),
   value DECIMAL(6,2) NOT NULL,
   recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,         
    type VARCHAR(50) NOT NULL,                
    message TEXT NOT NULL,                  
    related_sensor INT REFERENCES sensors(sensor_id), 
    status VARCHAR(10) DEFAULT 'Unread',        
    created_at TIMESTAMP DEFAULT NOW()        
);