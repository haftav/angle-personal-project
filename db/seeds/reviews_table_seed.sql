CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    description VARCHAR(800),
    post_date DATE,
    reviewer_id INTEGER NOT NULL REFERENCES users (id),
    user_id INTEGER NOT NULL REFERENCES users (id)
)
