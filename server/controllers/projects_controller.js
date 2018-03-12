module.exports = {
    createProject: (req, res) => {
        const db = req.app.get('db');
        const { user_id, name, type, price, description, image } = req.body;
        db.create_project([user_id, name, type, price, description, image]).then(project => {
            res.status(200).send(project[0])
        })
    },
    getProjects: (req, res) => {
        const db = req.app.get('db');
        db.get_projects().then(projects => {
            res.status(200).send(projects);
        })
    },
    getProject: (req, res) => {
        const db = req.app.get('db');
        const id = req.params.id;
        db.get_project([id]).then(project => {
            db.get_bids([id]).then(bids => {
                project[0].bids = bids;
                res.status(200).send(project[0])
            })
        })
    },
    getCollab: (req, res) => {
        const db = req.app.get('db');
        const id = req.params.id;
        db.get_project([id]).then(project => {
            const { collab_id } = project[0];
            db.find_id_user([collab_id]).then(user => {
                project[0].collab_user = user[0]
                res.status(200).send(project[0])
            })
        })
    },
    getUserProjects: (req, res) => {
        console.log('you hit this')
        const db = req.app.get('db');
        const id = Number(req.params.id)
        db.get_user_projects([id]).then(projects => {
            console.log('here');
            console.log(projects);
            res.status(200).send(projects);
        })
    },
    updateProject: (req, res) => {
        const { id, name, description } = req.body;
        const db = req.app.get('db');
        console.log('you hit me')
        db.update_project([id, name, description]).then(project => {
            console.log('project: ', project)
            res.status(200).send(project[0])
        })
    },
    deleteProject: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        db.remove_bids([id]).then(bids => {
            db.delete_project([id]).then(project => {
                res.status(200).send();
            })
        })
    },
    chooseBid: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const { bidder_id } = req.body;
        db.choose_bid([id, bidder_id]).then(bids => {
            db.remove_bids([id]).then(bid => {
                res.status(200).send();
            })
        })
    }

}