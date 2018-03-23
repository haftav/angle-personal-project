SELECT messages.*, users.image as user_image from messages
join users on messages.user_id = users.id
where room_id = $1
order by messages.id