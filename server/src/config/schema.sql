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


CREATE TABLE tray_groups (
    tray_group_id SERIAL PRIMARY KEY,
    tray_group_name VARCHAR(100) NOT NULL,
    is_watering BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE trays (
    tray_id SERIAL PRIMARY KEY,  
    tray_group_id INT REFERENCES tray_groups(tray_group_id), 
    plant_type VARCHAR(50),
    soil_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE sensors(   
    sensor_id SERIAL PRIMARY KEY,
    tray_id INT REFERENCES trays(tray_id), 
    sensor_type VARCHAR(100) NOT NULL,
    min_value NUMERIC DEFAULT 0,
    max_value NUMERIC DEFAULT 100,
    status VARCHAR(40),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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