select count(*) as connection_count from connections
where friend_1_id = $1