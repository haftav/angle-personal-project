require('dotenv').config();
const express = require('express')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , massive = require('massive')
    , bodyParser = require('body-parser')
    , socket = require('socket.io');
    

const projects_controller = require('./controllers/projects_controller');
const connections_controller = require('./controllers/connections_controller');
const bids_controller = require('./controllers/bids_controller');
const reviews_controller = require('./controllers/reviews_controller');

const {
    SERVER_PORT,
    SESSION_SECRET,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    CONNECTION_STRING,
    SUCCESS_URL,
    FAILURE_URL
} = process.env;

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
})

const app = express();

app.use(express.static(`${__dirname}/../build`))

app.use(bodyParser.json());

// app.use(express.static(__dirname + './../build'))

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: 'openid profile'
}, function (accessToken, refreshToken, extraParams, profile, done) {
    const db = app.get('db');
    db.find_user([profile.id]).then(users => {
        if (!users[0]) {
            for (prop in profile.name) {
                if (profile.name[prop] === undefined) {
                    profile.name[prop] = ''
                }
            }
            const { id, displayName, name, picture } = profile;
            db.create_user([id, name.givenName, name.familyName, displayName, picture, 'false', '', 'Both']).then(user => {
                done(null, user[0].id)
            })
        } else {
            done(null, users[0].id)
        }
    })
}))

passport.serializeUser((id, done) => {
    done(null, id);
})

passport.deserializeUser((id, done) => {
    app.get('db').find_session_user([id]).then(user => {
        done(null, user[0]);
    })
})

app.get('/api/auth', passport.authenticate('auth0'));
app.get('/api/auth/callback', passport.authenticate('auth0', {
    successRedirect: SUCCESS_URL,
    failureRedirect: FAILURE_URL
}))

app.get('/api/user', (req, res) => {
    if (req.user) {
        res.status(200).send(req.user);
    } else {
        res.status(401).send('nah');
    }
})

app.put('/api/user', (req, res) => {
    console.log('body: ', req.body)
    const { user_name, first_name, last_name, description, artist_type, image } = req.body;
    const db = app.get('db');
    if (image) {
        db.update_user([req.user.id, user_name, first_name, last_name, description, artist_type]).then(res1 => {
            db.update_user_image([req.user.id, image]).then(user => {
                res.status(200).send(user[0])
            })
        })
    } else {
        db.update_user([req.user.id, user_name, first_name, last_name, description, artist_type]).then(user => {
            res.status(200).send(user[0])
        })
    }

})

app.get('/api/user/:id', (req, res) => {
    const db = app.get('db');
    db.find_id_user([req.params.id]).then(user => {
        res.status(200).send(user[0])
    })
})

app.put('/api/user/media', (req, res) => {
    const db = app.get('db');
    const id = req.user.id;
    if (req.body.type === 'vimeo') {
        const { vimeo_profile } = req.body;
        db.add_vimeo_url([id, vimeo_profile]).then(user => {
            res.status(200).send(user[0]);
        })
    } else {
        const { soundcloud_profile } = req.body
        db.add_soundcloud_url([id, soundcloud_profile]).then(user => {
            res.status(200).send(user[0]);
        })
    }
})

// app.get('/auth/logout', function(req, res){
//     req.logOut();
//     res.redirect(login page here);
// });

/* PROJECT ENDPOINTS */
app.get('/api/projects', projects_controller.getProjects);
app.get('/api/projects/:id', projects_controller.getProject)
app.get('/api/projects/user/:id', projects_controller.getUserProjects);
app.post('/api/projects', projects_controller.createProject);
app.put('/api/projects/:id', projects_controller.updateProject)
app.put('/api/projects/submit/:id', projects_controller.submitUrl)
app.get('/api/projects/collab/:id', projects_controller.getCollab);
app.get('/api/collabs', projects_controller.getCollabs);
app.put('/api/projects/collab/:id', projects_controller.chooseBid);
app.put('/api/projects/closebidding/:id')
app.put('/api/projects/completed/:id', projects_controller.completeProject);
app.delete('/api/projects/:id', projects_controller.deleteProject);

/* CONNECTIONS ENDPOINTS */
app.get('/api/connections/user/:id', connections_controller.getConnections)
app.get('/api/connections/status/to/:id', connections_controller.getToStatus);
app.get('/api/connections/status/from/:id', connections_controller.getFromStatus);
app.get('/api/connections/pending', connections_controller.getPendingConnections);
app.post('/api/connections/pending', connections_controller.addConnection);
app.post('/api/connections/accepted', connections_controller.addFriend);
app.post('/api/connections/user/accepted', connections_controller.addFriendFromProfile)

/*  BIDS ENDPOINTS  */

app.post('/api/bids/add', bids_controller.addBid);
app.delete('/api/bids/:id', bids_controller.removeBid);

/* REVIEWS ENDPOINTS */

app.get('/api/reviews/check/:id', reviews_controller.checkReviewStatus);
app.get('/api/reviews/:id', reviews_controller.getReviews);
app.post('/api/reviews/add', reviews_controller.addReview);
app.put('/api/reviews/edit', reviews_controller.editReview);
app.delete('/api/reviews/delete/:id/:user_id', reviews_controller.deleteReview);

/* MESSAGES ENDPOINTS */

app.get('/api/messages/:id', (req, res) => {
    const db = app.get('db');
    const id = req.params.id;
    db.get_messages([id]).then(messages => {
        res.status(200).send(messages);
    })
})

/* GET USER STATS */

app.get('/api/stats/:id', (req, res) => {
    const db = app.get('db');
    const id = req.params.id;
    let output = {}
    db.get_project_stats([id]).then(projects => {
        output.project_count = projects[0].project_count;
        db.get_review_stats([id]).then(reviews => {
            output.review_count = reviews[0].review_count;
            db.get_connection_stats([id]).then(connections => {
                output.connection_count = connections[0].connection_count;
                console.log(output);
                res.status(200).send(output)
            }) 
        })
    })
})

const io = socket(app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`)));

io.on('connection', socket => {
    socket.emit('welcome', {userID: socket.id})

    socket.on('message sent', function(data) {
        const db = app.get('db');
        db.add_message([data.message, data.post_time, data.name, data.room, data.user_id]).then(() => {
            io.to(data.room).emit('message dispatched', data)
        })
    })

    socket.on('join room', data => {
        socket.join(data.room);
        io.to(data.room).emit('room joined', data.room)
    })
})