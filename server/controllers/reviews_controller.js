module.exports = {
    checkReviewStatus: (req, res) => {
        const id = Number(req.params.id);
        const user_id = req.user.id;
        const db = req.app.get('db');
        db.get_completed_user_projects([id]).then(projects => {
            let found = projects.find((el) => {
                return el.user_id === user_id || el.collab_id === user_id;
            })
            if (found) {
                res.status(200).send(true);
            } else {
                res.status(200).send(false)
            }
        })
    }
}