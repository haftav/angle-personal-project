INSERT INTO projects
(user_id, name, type, price, description, image, bidding_deadline, project_deadline, status)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
RETURNING *;