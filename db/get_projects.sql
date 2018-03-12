select projects.*, user_name, first_name, last_name, artist_type, users.image as user_image FROM projects
join users on projects.user_id = users.id
WHERE status = 'pending'