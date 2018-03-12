CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    type TEXT,
    deadline TEXT,
    price TEXT,
    description VARCHAR(700),
    image VARCHAR(300),
    status VARCHAR(20),
    user_id INTEGER NOT NULL REFERENCES users(id),
    collab_id INTEGER REFERENCES users(id),
    bidding_deadline DATE,
    project_deadline DATE
)