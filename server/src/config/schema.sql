


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
bed_number VARCHAR(20) NOT NULL,
bed_code VARCHAR(50) NOT NULL,
bed_name VARCHAR(50) NOT NULL,
location VARCHAR(50) NOT NULL,
is_active BOOLEAN DEFAULT TRUE,
last_avg_moisture DECIMAL (5,2),
hysteresis DECIMAL (5,2) DEFAULT 5,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

