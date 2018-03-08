select connections.status from connections
where friend_1_id = $2 and friend_2_id = $1