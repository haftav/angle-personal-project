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
        db.delete_project([id]).then(project => {
            res.status(200).send();
        })
    }

}