select count(*) as review_count from reviews
where user_id = $1