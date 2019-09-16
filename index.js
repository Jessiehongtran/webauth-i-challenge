const express = require('express');
const server = express();
server.use(express.json())

const port = process.env.PORT || 5005;
server.listen(port, ()=> console.log(`Running on port ${port}`))