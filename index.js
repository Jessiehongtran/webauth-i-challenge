const express = require('express');
const server = express();
server.use(express.json())

const bcrypt = require('bcryptjs')

const Users = require('./users/users-model')

const port = process.env.PORT || 5005;
server.listen(port, ()=> console.log(`Running on port ${port}`))

server.get('/', (req,res)=> {
    res.send('Ready to code')
})

server.post('/api/register', (req,res)=> {
    let {username, password} = req.body; 
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
                res.status(200).json({message: `Logged in`})
            } else {
                res.status(401).json({message: 'Invalid username or password'})
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})