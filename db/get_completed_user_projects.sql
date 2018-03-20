SELECT * from projects
where (projects.user_id = $1 or projects.collab_id = $1) and projects.status = 'completed'