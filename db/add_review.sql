INSERT INTO reviews (description, post_date, reviewer_id, user_id) values ($1, $2, $3, $4);

SELECT reviews.*, first_name, last_name, image from reviews
JOIN users on users.id = reviews.reviewer_id
WHERE reviews.user_id = $4