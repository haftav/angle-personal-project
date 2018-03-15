module.exports = {
    createProject: (req, res) => {
        const db = req.app.get('db');
        const { user_id, name, type, price, description, image, bidding_deadline, project_deadline } = req.body;
        db.create_project([user_id, name, type, price, description, image, bidding_deadline, project_deadline]).then(project => {
            res.status(200).send(project[0])
        })
    },
    getProjects: (req, res) => {
        const db = req.app.get('db');
        db.get_projects().then(projects => {
            db.get_completed_projects().then(completed => {
                const results = completed.map((el) => {
                    const { collab_id } = el;
                    let item = db.find_id_user([collab_id]).then(user => {
                        el.collab_user = user[0];
                        return el;
                    })
                    return item;
                })
                Promise.all(results).then(function(values) {
                    console.log(values);
                    projects = [...projects, ...values]
                    if (!req.query.status && !req.query.type) {
                        res.status(200).send(projects);
                    } else {            
                        if (req.query.status !== 'all') {
                            projects = projects.filter((el) => el.status === req.query.status)
                        }
                        if (req.query.type !== 'all') {
                            projects = projects.filter((el => el.type === req.query.type));
                        }
                        res.status(200).send(projects);
                    }
                })

            })


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
    getCollabs: (req, res) => {
        console.log('here');
        const db = req.app.get('db');
        const userid = req.user.id;
        console.log(userid);
        db.get_collabs_user([userid]).then(usercollabs => {
            db.get_collabs_other([userid]).then(othercollabs => {
                db.get_collabs_pending([userid]).then(pendingcollabs => {
                    let collabs = [...usercollabs, ...othercollabs, ...pendingcollabs]
                    res.status(200).send(collabs);
                })
            })
        })
    },
    getUserProjects: (req, res) => {
        const db = req.app.get('db');
        const id = Number(req.params.id)
        db.get_user_projects([id]).then(projects => {
            projects = projects.filter((el, idx) => {
                return el.status === 'completed'
            })
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
    },
    submitUrl: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        const { finished_url } = req.body;
        db.add_finished_url([id, finished_url]).then(() => {
            db.get_project([id]).then(project => {
                const { collab_id } = project[0];
                db.find_id_user([collab_id]).then(user => {
                    project[0].collab_user = user[0]
                    res.status(200).send(project[0])
                })
            })
        })
    },
    completeProject: (req, res) => {
        const db = req.app.get('db');
        const { id } = req.params;
        //eventually add in completed link to this db query
        db.complete_project([id]).then(output => {
            db.get_project([id]).then(project => {
                const { collab_id } = project[0];
                db.find_id_user([collab_id]).then(user => {
                    project[0].collab_user = user[0]
                    res.status(200).send(project[0])
                })
            })
        })
    }

}