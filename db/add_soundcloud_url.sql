UPDATE users SET soundcloud_profile = $2 
WHERE id = $1;

SELECT * FROM users 
WHERE id = $1