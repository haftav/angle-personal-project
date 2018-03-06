UPDATE users 
SET user_name = $2, 
first_name = $3,
last_name = $4, 
description = $5,
artist_type = $6,
info = 'true'
WHERE id = $1;

SELECT * FROM users 
WHERE id = $1