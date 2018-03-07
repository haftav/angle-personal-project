INSERT INTO projects
(user_id, name, type, price, description, image, status)
VALUES
($1, $2, $3, $4, $5, $6, 'pending')
RETURNING *;