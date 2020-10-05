const { ObjectID } = require('mongodb');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const databaseName = 'AssignmentPart2';
const collectionName = 'users';

// Create a new user by inserting a document in the users collection
exports.insert = function(req, res){
    MongoClient.connect(url, { userNewUrlParser: true}, function(err, client){
        if (err) throw err;
        let db = client.db(databaseName);

        // Use request body as the object for a new user and assign an ID
        let newUser = req.body
        let stringID = new ObjectID
        newUser._id = stringID.valueOf().toString()       

        // Check that the request consists of a username, email and role. Else response is error
        if(newUser.username !== undefined && newUser.email !== undefined && newUser.role !== undefined){
            db.collection(collectionName).find({username: newUser.username}).toArray().then(function(docs){
                // If the username exists response is error. Else insert the new user
                if(docs.length != 0) {
                    let lv_response = {Status: 1, StatusMessage: "Username exists"}
                    res.send(lv_response)
                } else {
                    //Assign a password of 123
                    newUser.upw = "123"
                    db.collection(collectionName).insertOne(newUser, function(err, result){
                        console.log('Insert Successful: ')
                        console.log(newUser)

                        let lv_response = {Status: 0, StatusMessage: "Insert Successful", newUser}
                        res.send(lv_response)
                        client.close()
                    })
                }
            }).catch((err) => {console.log(err);}).finally(() => {client.close()})
        } else {
            let lv_response = {Status: 1, StatusMessage: "Error when trying to create new user"}
            res.send(lv_response)
        }
    })
}

// User authentication by checking if any user has provided username and password
exports.auth = function(req, res){
    MongoClient.connect(url, { userNewUrlParser: true}, function(err, client){
        if (err) throw err;
        let db = client.db(databaseName);
        let requestObject = req.body

        // If request does not provide unsername and upw return error. Else check if user exists.
        if(requestObject.username === undefined || requestObject.upw === undefined){
            let lv_response = {Status: 1, StatusMessage: "Error: Username and upw need to be provided."}
            res.send(lv_response)
        } else {
            db.collection(collectionName).find(requestObject).toArray().then(function(user){
                console.log('Found the following records: ')
                console.log(user)
                // If user found return user. Else return error
                if(user.length > 0) {
                    let lv_response = {Status: 0, StatusMessage: "Successful Auth", user}
                    res.send(lv_response)
                } else {
                    let lv_response = {Status: 1, StatusMessage: "Auth Failed: No user found"}
                    res.send(lv_response)
                }
            }).catch((err) => {console.log(err);}).finally(() => {client.close()})
        }
    })
}

// Find all documents in the users collection
exports.findAll = function(req, res){
    MongoClient.connect(url, { userNewUrlParser: true}, function(err, client){
        if (err) throw err;
        let db = client.db(databaseName);

        db.collection(collectionName).find({}).toArray().then(function(docs){
            console.log('Found the following records: ')
            console.log(docs)
            res.send(docs)
        }).catch((err) => {console.log(err);}).finally(() => {client.close()})
    })
}

// Delete a user document from the users collection using the user _id
exports.delete = function(req, res) {

    MongoClient.connect(url, function(err, client) {
        let db = client.db(databaseName);
        let requestObject = req.body
        
        // If _id not provided error. Else perform deletion
        if(requestObject._id === undefined){
            let lv_response = {Status: 1, StatusMessage: "User _id must be provided."}
            res.send(lv_response)
        } else {
            db.collection(collectionName, function(err, collection){
                let queryJSON = {_id: requestObject._id};
                collection.deleteMany(queryJSON, function(err, result){
                    
                    // If n in the result section of result is 0 return error. Else return success
                    if(result.result.n.valueOf().toString() == '0'){
                        lv_response = {Status: 1, StatusMessage: "No document was deleted"}
                        res.send(lv_response)
                    } else {
                        console.log("Removed the groups with: ", queryJSON)
                        lv_response = {Status: 0, StatusMessage: "Deletion Successful", deletedUser: queryJSON}
                        res.send(lv_response)
                    }
                    client.close()
                })
            })
        }
        
    })
}

// Make an update on a group in the groups collection using the group _id and the update desired
exports.update = function(req, res){
    MongoClient.connect(url, function(err, client){
        let db = client.db(databaseName);
        let requestObject = req.body

        // If id and update not defined return error. Else proceed with update
        if(requestObject._id === undefined || requestObject.update === undefined){
            let lv_response = {Status: 1, StatusMessage: "User _id needs to be provided."}
            res.send(lv_response)
        } else {
            db.collection(collectionName, function(err, collection){
                // Assign query and update to make update on the document
                let queryJSON = {_id: requestObject._id};
                let updateJSON = req.body.update;
    
                collection.updateMany(queryJSON, { $set: updateJSON}, function(err, result) {

                    // If the nModified value in the result section of result is 0 return error. Else return user and what was updated
                    if(result.result.nModified.valueOf().toString() == '0') {
                        let lv_response = {Status: 1, StatusMessage: "Did not make an update."}
                        res.send(lv_response)
                    } else {
                        console.log("For the documents with ", queryJSON)
                        console.log("SET: " , updateJSON)
                        db.collection(collectionName).find({_id: requestObject._id}).toArray().then(function(groups){
                            lv_response = {Status: 0, StatusMessage: "Update Successful", group: groups[0], updated: updateJSON}
                            res.send(lv_response)
                        }).catch((err) => {console.log(err);}).finally(() => {client.close()})
                    }
                    client.close()
                })
            })
        }
    })
}

exports.DEV_deleteAllUsers = function(req, res) {
    MongoClient.connect(url, function(err, client) {
        let db = client.db(databaseName);
        db.collection(collectionName, function(err, collection){

            collection.deleteMany({}, function(err, result){
                res.send('Deleted All Users')
                client.close()
            })
        })
    })
}