delete from bids
where project_id = $1 and bidder_id = $2;
select bids.*, users.id as user_id, first_name, last_name, image from bids
JOIN users on bids.bidder_id = users.id
where bids.project_id = $1