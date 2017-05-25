const express = require('express');
const markup = require('../layout/markup');

const app = express();

app.get('/', function (req, res) {
    res.send(markup);
});

app.listen(3000, 'localhost', function () {
    console.log('App ran on localhost:3000')
});