INSERT INTO users
(auth_id, first_name, last_name, user_name, image)
VALUES
($1, $2, $3, $4, $5)
RETURNING *;