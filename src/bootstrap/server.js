const express = require('express');
const markup = require('../layout/markup');
const bodyParser = require('body-parser');
const Command = require('../utils/Command');
const STATUS = require('../const/status');

const app = express();
const api = express.Router();

let store = [];

app.get('/', function (req, res) {
    res.send(markup);
});

// API

// parse application/json

api.put('/push', function (req, res) {
    if (!req.body.command) return res.sendStatus(400);
    const command = new Command(req.body.command, req.body.comment);
    command.launch();
    store.push(command);
    res.send(command.get());
});

api.post('/kill', function (req, res) {
    store[req.body.id].kill();
    res.sendStatus(200);
});

api.get('/all', function (req, res) {
    res.send(store.map(command => command.get()));
});

api.post('/getSome', function (req, res) {
    const {ids, length} = req.body;
    const commands = {};
    for (let id of ids) {
        if(store[id]) commands[id] = store[id].get();
    }
    if (ids.length !== store.length) {
        for (let i = length; i < store.length; ++i) {
            commands[i] = store[i].get();
        }
    }
    res.send(commands);
});

api.post('/get', function (req, res) {
    res.send(store[req.body.id].get());
});

api.get('/updates', function (req, res) {
    const commands = {};
    for (let i = 0; i < store.length; ++i) {
        if (store[i].status === STATUS.PROCESS) {
            commands[i] = store[i].get();
        }
    }
    res.send(commands);
});

// Launch

app.use(bodyParser.json());
app.use('/api', api);

app.listen(3000, 'localhost', function () {
    console.log('App ran on localhost:3000');
});
