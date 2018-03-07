module.exports = {
    createProject: (req, res) => {
        const db = req.app.get('db');
        const { user_id, name, type, price, description, image } = req.body;
        console.log(req.body);
        db.create_project([user_id, name, type, price, description, image]).then(project => {
            res.status(200).send(project[0])
        })
    },
    getProjects: (req, res) => {
        const db = req.app.get('db');
        db.get_projects().then(projects => {
            console.log(projects);
            res.status(200).send(projects);
        })
    },
    getProject: (req, res) => {
        const db = req.app.get('db');
        const id = req.params.id;
        db.get_project([id]).then(project => {
            res.status(200).send(project[0])
        })
    }
}