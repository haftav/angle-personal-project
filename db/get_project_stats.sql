select count(*) as project_count from projects
where (user_id = $1 or collab_id = $1) and status = 'completed'