module.exports = {
    addBid: (req, res) => {
        const db = req.app.get('db');
        const { project_id, bidder_id } = req.body;
        db.add_bid([project_id, bidder_id]).then(bids => {
            res.status(200).send(bids);
        })
    },
    removeBid: (req, res) => {
        const db = req.app.get('db');
        const project_id = req.params.id;
        const bidder_id = req.user.id;
        db.remove_bid([project_id, bidder_id]).then(bids => {
            res.status(200).send(bids);
        })
    }
}