const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Method", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res){
    res.send('hello from server')
  });

// USER OPERATIONS
const users = require('./dbOperations/userOperations')

app.post('/usersCreate', users.insert)
app.get('/usersGet', users.findAll)
app.post('/usersAuth', users.auth)
app.post('/usersUpdate', users.update)
app.post('/usersDelete', users.delete)
app.get('/usersDeleteAll', users.DEV_deleteAllUsers)

// GROUP OPERATIONS
const groups = require('./dbOperations/groupOperations')
app.post('/groupsCreate', groups.insert)
app.get('/groupsGet', groups.findAll)
app.post('/groupsForUser', groups.findGroupForUser)
app.post('/groupsUpdate', groups.update)
app.post('/groupsDelete', groups.delete)

app.get('/groupsDeleteAll', groups.DEV_deleteAllGroups)

app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})