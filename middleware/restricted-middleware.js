const bcrypt = require('bcryptjs');

const Users = require('../users/users-model')

module.exports = (req,res,next) => {
    let {username, password} = req.body;

    Users.findBy({username})
    .first()
    .then (user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            next()
        } else {
            res.status(401).json({message: 'Incorrect password'})
        }
    })
    .catch(err => {
        res.status(500).json({message: 'Incorrect username and password'})
    })
}