INSERT INTO users
(auth_id, first_name, last_name, user_name, image, info, description, artist_type)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;