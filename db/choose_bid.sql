UPDATE projects set status = 'collab', collab_id = $2
WHERE id = $1