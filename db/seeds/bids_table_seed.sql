CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects (id),
    bidder_id INTEGER NOT NULL REFERENCES users (id),
    votes INTEGER
)