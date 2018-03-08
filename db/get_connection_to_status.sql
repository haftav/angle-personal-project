select connections.status from users
join connections on users.id = connections.friend_1_id
where users.id = $1 and friend_2_id = $2