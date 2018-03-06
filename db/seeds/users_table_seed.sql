CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(200),
    last_name VARCHAR(200),
    user_name VARCHAR(50),
    description VARCHAR(500),
    artist_type TEXT,
    image VARCHAR(300),
    auth_id VARCHAR(200)
)