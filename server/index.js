require('dotenv').config();
const express = require('express')
, session = require('express-session')
, passport = require('passport')
, Auth0Strategy = require('passport-auth0')
, massive = require('massive')
, bodyParser = require('body-parser');

const projects_controller = require('./controllers/projects_controller');

const {
    SERVER_PORT,
    SESSION_SECRET,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    CONNECTION_STRING
} = process.env;

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
})

const app = express();
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
}, function(accessToken, refreshToken, extraParams, profile, done) {
    const db = app.get('db');
    db.find_user([profile.id]).then(users => {
        if (!users[0]) {
            for (prop in profile.name) {
                if (profile.name[prop] === undefined) {
                    profile.name[prop] = ''
                }
            }
            const {id, displayName, name, picture} = profile;
            db.create_user([id, name.givenName, name.familyName, displayName, picture, 'false', '', 'Both']).then(user => {
                done(null, user[0].id)
            })
        } else {
            done(null, users[0].id)
        }
    })
}) )

passport.serializeUser( (id, done) => {
    done(null, id);
} )

passport.deserializeUser( (id, done) => {
    app.get('db').find_session_user([id]).then( user => {
        done(null, user[0]);
    } ) 
} )

app.get('/api/auth', passport.authenticate('auth0'));
app.get('/api/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/#/info',
    failureRedirect: 'http://localhost:3000/#/'
    
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
    const { user_name, first_name, last_name, description, artist_type } = req.body;
    const db = app.get('db');
    db.update_user([req.user.id, user_name, first_name, last_name, description, artist_type]).then(user => {
        res.status(200).send(user[0])
    })

})

app.get('/api/user/:id', (req, res) => {
    const db = app.get('db');
    db.find_id_user([req.params.id]).then(user => {
        res.status(200).send(user[0])
    })
})

// app.get('/auth/logout', function(req, res){
//     req.logOut();
//     res.redirect('http://localhost:3535/');
// });

/* PROJECT ENDPOINTS */
app.get('/api/projects', projects_controller.getProjects);
app.get('/api/projects/:id', projects_controller.getProject)
app.post('/api/projects', projects_controller.createProject);


app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`));