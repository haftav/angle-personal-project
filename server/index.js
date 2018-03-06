require('dotenv').config();
const express = require('express')
, session = require('express-session')
, passport = require('passport')
, Auth0Strategy = require('passport-auth0')
, massive = require('massive')
, bodyParser = require('body-parser');

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
    console.log(profile);
    const db = app.get('db');
    db.find_user([profile.id]).then(users => {
        if (!users[0]) {
            for (prop in profile.name) {
                if (profile.name[prop] === undefined) {
                    profile.name[prop] = ''
                }
            }
            const {id, displayName, name, picture} = profile;
            db.create_user([id, name.givenName, name.familyName, displayName, picture]).then(user => {
                console.log(user);
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
        console.log(user[0]);
        done(null, user[0]);
    } ) 
} )

app.get('/api/auth', passport.authenticate('auth0'));
app.get('/api/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/#/dashboard',
    failureRedirect: 'http://localhost:3000/#/'
    
}))

app.get('/api/user', (req, res) => {
    console.log(req.session);
    console.log(req.user);
    if (req.user) {
        res.status(200).send(req.user);
    } else {
        res.status(401).send('nah');
    }
})

// app.get('/auth/logout', function(req, res){
//     req.logOut();
//     res.redirect('http://localhost:3535/');
// });


app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`));