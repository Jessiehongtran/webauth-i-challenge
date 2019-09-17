const express = require('express');
const server = express();

const bcrypt = require('bcryptjs')

const Users = require('./users/users-model')

const restricted = require('./middleware/restricted-middleware')

const session = require('express-session')

const port = process.env.PORT || 5005;
server.listen(port, ()=> console.log(`Running on port ${port}`))

const sessionConfig = {
    name: 'monkey1',
    secret: 'keep it secret, keep it safe!',
    cookie: {
        maxAge: 1000*60,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false
}

server.use(express.json())
server.use(session(sessionConfig))

server.get('/', (req,res)=> {
    res.send('Ready to code')
})

server.post('/api/register', (req,res)=> {
    let {username, password} = req.body; 
    console.log(username, password)
    const hash = bcrypt.hashSync(password, 12)

    Users.add({username, password:hash})
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

server.post('/api/login', (req,res)=> {
    let {username, password} = req.body;

    Users.findBy({username})
        .first()
        .then (user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.userinfo= user
                console.log(req.session)
                res.status(200).json({message: `Logged in`})
            } else {
                res.status(401).json({message: 'Invalid username or password'})
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

server.get('/api/users', restricted, (req,res) => {
    Users.find()
        .then(users=> {
            res.json(users);
        })
        .catch(err => res.send(err))
})