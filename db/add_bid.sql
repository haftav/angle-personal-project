INSERT INTO bids (project_id, bidder_id, votes) VALUES ($1, $2, 0);
select bids.*, users.id as user_id, first_name, last_name, image from bids
JOIN users on bids.bidder_id = users.id
where bids.project_id = $1