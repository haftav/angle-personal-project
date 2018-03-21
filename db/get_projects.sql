select projects.*, user_name, first_name, last_name, artist_type, users.image as user_image, count(bids.*) as bid_count FROM projects
join users on projects.user_id = users.id
left join bids on projects.id = bids.project_id
where status = 'pending' 
group by projects.id, users.user_name, first_name, last_name, artist_type, users.image