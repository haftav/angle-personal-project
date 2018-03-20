delete from reviews
where id = $1;

SELECT reviews.*, first_name, last_name, image from reviews
JOIN users on users.id = reviews.reviewer_id
WHERE reviews.user_id = $2
