select users.first_name, users.last_name, users.image, users.id as user_id from connections
join users on users.id = connections.friend_1_id
where friend_2_id = $1 and status = 'pending'