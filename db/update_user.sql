UPDATE users 
SET first_name = $2,
last_name = $3, 
description = $4,
artist_type = $5,
info = 'true'
WHERE id = $1;

SELECT * FROM users 
WHERE id = $1