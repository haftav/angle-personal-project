CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(200),
    last_name VARCHAR(200),
    user_name VARCHAR(50),
    description VARCHAR(500),
    artist_type TEXT,
    image VARCHAR(300),
    info VARCHAR(10),
    auth_id VARCHAR(200),
    vimeo_profile VARCHAR(200),
    soundcloud_profile VARCHAR(200)
)