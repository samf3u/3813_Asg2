const { query } = require('express');
const { ObjectID } = require('mongodb');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const databaseName = 'AssignmentPart2';
const collectionName = 'groups';

// Create a new group by inserting a document in the groups collection
exports.insert = function(req, res){
    MongoClient.connect(url, { userNewUrlParser: true}, function(err, client){
        if (err) throw err;
        let db = client.db(databaseName);
        let newGroup = req.body

        // If the request consists of name, admin, assis, users and rooms return error. Else insert document for new group.
        if(newGroup.name === undefined || newGroup.admin === undefined || newGroup.assis === undefined || newGroup.users === undefined || newGroup.rooms === undefined){
            let lv_response = {Status: 1, StatusMessage: "Error: Must provide name, admin, assis, users and rooms"}
            res.send(lv_response)
        } else {
            // Assign ID to the group and perform insert
            let stringID = new ObjectID
            newGroup._id = stringID.valueOf().toString()
            db.collection(collectionName).insertOne(newGroup, function(err, result){
                console.log('Insert Successful: ')
                console.log(newGroup)
                lv_response = {Status: 0, StatusMessage: "Insert Successful", newGroup}
                res.send(lv_response)
                client.close()
            })
        }       
    })
}

// Find all documents in the groups collection
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

// Find all documents in the users collection for a particular user using the user's ID
exports.findGroupForUser = function(req, res){
    MongoClient.connect(url, { userNewUrlParser: true}, function(err, client){
        if (err) throw err;
        let db = client.db(databaseName);
        let requestObject = req.body
        
        // If request does not have the user _id return error. Else find if user in any groups
        if(requestObject._id === undefined){
            let lv_response = {Status: 1, StatusMessage: "User _id needs to be provided."}
            res.send(lv_response)
        } else {
            db.collection(collectionName).find({users: {_id: requestObject._id}}).toArray().then(function(groups){
                
                // If found one or more groups for user return groups. Else return error
                if(groups.length > 0) {
                    console.log('Found the following records: ')
                    console.log(groups)
                    let lv_response = {Status: 0, StatusMessage: "Found Groups for User", groups}  
                    res.send(lv_response)
                } else {
                    let lv_response = {Status: 1, StatusMessage: "User has no groups."}  
                    res.send(lv_response)
                }
            }).catch((err) => {console.log(err);}).finally(() => {client.close()})
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
            let lv_response = {Status: 1, StatusMessage: "Group _id needs to be provided."}
            res.send(lv_response)
        } else {
            db.collection(collectionName, function(err, collection){
                // Assign query and update to make update on the document
                let queryJSON = {_id: requestObject._id};
                let updateJSON = req.body.update;
    
                collection.updateMany(queryJSON, { $set: updateJSON}, function(err, result) {

                    // If the nModified value in the result section of result is 0 return error. Else return group and what was updated
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

// Delete a group document from the groups collection using the group _id
exports.delete = function(req, res) {
    MongoClient.connect(url, function(err, client) {
        let db = client.db(databaseName);
        let requestObject = req.body
        
        // If _id not provided error. Else perform deletion
        if(requestObject._id === undefined){
            let lv_response = {Status: 1, StatusMessage: "Group _id must be provided."}
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
                        lv_response = {Status: 0, StatusMessage: "Deletion Successful", deletedGroup: queryJSON}
                        res.send(lv_response)
                    }
                    client.close()
                })
            })
        }
        
    })
}

exports.DEV_deleteAllGroups = function(req, res) {
    MongoClient.connect(url, function(err, client) {
        let db = client.db(databaseName);
        db.collection(collectionName, function(err, collection){

            collection.deleteMany({}, function(err, result){
                res.send('Deleted All Groups')
                client.close()
            })
        })
    })
}