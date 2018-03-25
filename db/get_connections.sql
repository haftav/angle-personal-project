select users.first_name, users.last_name, users.image, users.artist_type, users.id as user_id from connections
join users on users.id = connections.friend_2_id
where friend_1_id = $1 and status = 'friends'