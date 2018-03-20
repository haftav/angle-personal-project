UPDATE reviews SET description = $1, post_date = $2
WHERE id = $3;

SELECT reviews.*, first_name, last_name, image from reviews
JOIN users on users.id = reviews.reviewer_id
WHERE reviews.user_id = $4