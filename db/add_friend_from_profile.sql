UPDATE connections set status = 'friends' where friend_1_id = $2 and friend_2_id = $1;
INSERT INTO connections (friend_1_id, friend_2_id, status) VALUES ($1, $2, 'friends');

select connections.status from connections
where friend_1_id = $2 and friend_2_id = $1