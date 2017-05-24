const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send('Hello world')
});

app.listen(3000, 'localhost', function () {
    console.log('App ran on localhost:3000')
});