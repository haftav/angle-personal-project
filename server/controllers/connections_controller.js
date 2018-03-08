module.exports = {
    getConnections: (req, res) => {
        const db = req.app.get('db');
        const id = req.params.id;
        db.get_connections([id]).then(connections => {
            res.status(200).send(connections)
        })
    },
    getPendingConnections: (req, res) => {
        const db = req.app.get('db');
        const id = req.user.id;
        db.get_pending_connections([id]).then(connections => {
            res.status(200).send(connections);
        })
    },
    getStatus: (req, res) => {
        const db = req.app.get('db');
        const id = Number(req.params.id);
        const userid = Number(req.user.id);
        console.log('id: ', id, 'userid: ', userid);
        db.get_connection_status([userid, id]).then(status => {
            console.log(status);
            res.status(200).send(status[0])
        })
    },
    addConnection: (req, res) => {
        const db = req.app.get('db');
        const { friend_id_1, friend_id_2 } = req.body;
        console.log('ids: ', friend_id_1, friend_id_2)
        db.add_connection([friend_id_1, friend_id_2]).then(status => {
            res.status(200).send(status[0]);
        })
    },
    addFriend: (req, res) => {
        const db = req.app.get('db');
        const { userid, id, connection_id } = req.body;
        db.add_friend([userid, id, connection_id]).then(connections => {
            res.status(200).send(connections);
        })
    }
}