
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
    bed_code TEXT UNIQUE NOT NULL,    
    bed_name TEXT NOT NULL,     
    is_watering BOOLEAN DEFAULT FALSE,
    last_avg_moisture NUMERIC,     
    min_moisture NUMERIC NOT NULL DEFAULT 30, -
    max_moisture NUMERIC NOT NULL DEFAULT 70, 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sensors(
    sensor_id SERIAL PRIMARY KEY,
    bed_id INT NOT NULL,
    sensor_type VARCHAR(100) NOT NULL,
    sensor_code VARCHAR(50) NOT NULL,
    unit VARCHAR(50),
    min_value NUMERIC DEFAULT 0,
    max_value NUMERIC DEFAULT 100,
    status VARCHAR(40),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE sensor_readings (
   reading_id SERIAL PRIMARY KEY,
   sensor_id NOT NULL,
   value DECIMAL(6,2) NOT NULL,
   recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)



CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,         
    type VARCHAR(50) NOT NULL,                
    message TEXT NOT NULL,                  
    related_bed INT REFERENCES beds(bed_id),      
    related_sensor INT REFERENCES sensors(sensor_id), 
    status VARCHAR(10) DEFAULT 'Unread',        
    created_at TIMESTAMP DEFAULT NOW()        
);