const express = require('express');
const server = express();
server.use(express.json())

const bcrypt = require('bcryptjs')

const port = process.env.PORT || 5005;
server.listen(port, ()=> console.log(`Running on port ${port}`))

server.get('/', (req,res)=> {
    res.send('Ready to code')
})

server.post('/api/register', (req,res)=> {
    let {username, password} = req.body; 
    const hash = bscypt.hashSync(password, 12)

    
})