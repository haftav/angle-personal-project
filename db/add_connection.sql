INSERT INTO connections (friend_1_id, friend_2_id, status) VALUES ($1, $2, 'pending');
SELECT status from connections where friend_1_id = $1 and friend_2_id = $2