module.exports = {
    createProject: (req, res) => {
        const db = req.app.get('db');
        const { user_id, name, type, price, description, image, bidding_deadline, project_deadline } = req.body;
        let sort_date = new Date();
        db.create_project([user_id, name, type, price, description, image, bidding_deadline, project_deadline, sort_date]).then(project => {
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
                    projects = [...projects, ...values];
                    console.log(projects);
                    projects.sort((a, b) => {
                        return b.sort_date > a.sort_date ? 1 : b.sort_date < a.sort_date ? -1 : 0
                    })
                    console.log(projects);
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
                if (project[0].status !== 'pending') {
                    const { collab_id } = project[0]
                    db.find_id_user([collab_id]).then(user => {
                        project[0].collab_user = user[0];
                        res.status(200).send(project[0]);
                    })
                } else {
                    res.status(200).send(project[0])
                }
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
                console.log(project[0])
                res.status(200).send(project[0])
            })
        })
    },
    getCollabs: (req, res) => {
        const db = req.app.get('db');
        const userid = req.user.id;
        // CHANGE THIS BACK WHEN DONE STYLING PROJECTS PAGE
        db.get_collabs_user([userid]).then(usercollabs => {
            db.get_collabs_other([userid]).then(othercollabs => {
                db.get_collabs_pending([userid]).then(pendingcollabs => {
                    let collabs = [...usercollabs, ...othercollabs, ...pendingcollabs]
                    collabs.sort((a, b) => {
                        return a.project_deadline - b.project_deadline;
                    })
                    if (!req.query.status) {
                        res.status(200).send(collabs);
                    } else {
                        let status = req.query.status;
                        collabs = collabs.filter((el) => {
                            return el.status === status;
                        })   
                        res.status(200).send(collabs);
                    }
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
        const { id, name, description, image } = req.body;
        const db = req.app.get('db');
        db.update_project([id, name, description]).then(project1 => {
            if (image) {
                db.update_project_image([id, image]).then(project2 => {
                    res.status(200).send(project2[0])
                })
            } else {
                res.status(200).send(project1[0])
            }
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
    closeBidding: (req, res) => {
        const db = req.app.get('db');
        const id = req.params;
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
        let sort_date = new Date();
        //eventually add in completed link to this db query
        db.complete_project([id, sort_date]).then(output => {
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