INSERT INTO connections (friend_1_id, friend_2_id, status) VALUES ($1, $2, 'friends');
UPDATE connections set status = 'friends' where id = $3;

select users.first_name, users.last_name, users.image, users.id as user_id from connections
join users on users.id = connections.friend_1_id
where friend_2_id = $1 and status = 'pending'