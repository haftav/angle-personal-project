CREATE TABLE connections (
    id SERIAL PRIMARY KEY,
    friend_1_id INTEGER NOT NULL REFERENCES users (id),
    friend_2_id INTEGER NOT NULL REFERENCES users (id),
    status TEXT
)