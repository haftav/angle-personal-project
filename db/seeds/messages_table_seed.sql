CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    message VARCHAR(400),
    post_time TEXT,
    name TEXT NOT NULL,
    room_id INTEGER NOT NULL REFERENCES projects (id),
    user_id INTEGER NOT NULL REFERENCES users (id)
)