module.exports = {
    getReviews: (req, res) => {
        const db = req.app.get('db');
        const user_id = req.params.id;
        db.get_reviews([user_id]).then(reviews => {
            res.status(200).send(reviews);
        })
    },
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
    },
    addReview: (req, res) => {
        const db = req.app.get('db');
        const { description, post_date, reviewer_id, user_id } = req.body;
        console.log(req.body);
        db.add_review([description, post_date, reviewer_id, user_id]).then(reviews => {
            res.status(200).send(reviews);
        })
    }
}