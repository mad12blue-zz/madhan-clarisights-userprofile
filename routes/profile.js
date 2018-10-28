var mongo = require('mongodb');

var Server = mongo.Server;
var Db = mongo.Db;

//Connect to the local mongo db instance
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('profiledb', server);

//Open the mongo db collection 'profiledb'. If it doesn't exist, create new and populate dummy initial data
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'profiledb' database");
        db.collection('profile', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'profile' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

//Fetch all profiles from 'profiledb' collection
exports.findAll = function(req, res) {
    db.collection('profile', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

//Fetch specific profile from 'profiledb' collection based on id
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving profile: ' + id);
    db.collection('profile', function(err, collection) {
        collection.findOne({'_id':new mongo.ObjectID(id)},{'_id':0}, function(err, item) {
            if (err) {
                res.status(400).send({'error':'An error has occurred'});
            } else if (item === null) {
                res.status(200).send({'error':'No matching id'});
            } else {
                console.log('Success: ' + JSON.stringify(item));
                return res.status(200).send(item);
            }
        });
    });
};

//Insert a new profile into 'profiledb' collection
exports.addProfile = function(req, res) {
    var profile = req.body; 
    db.collection('profile', function(err, collection) {
        collection.count({username:{$eq:profile.username}}, function(err, exists) {
            if (exists) {
                return res.status(400).send({'error':'A profile with this username already exists. Please choose a different username.'});
            } else {
                console.log('Adding profile: ' + JSON.stringify(profile));
                    collection.insert(profile, {safe:true}, function(err, result) {
                        if (err) {
                            res.status(400).send({'error':'An error has occurred'});
                        } else {
                            console.log('Success: ' + JSON.stringify(result[0]));
                            return res.status(201).send(result.ops);
                        }
                    });
            }
        });
    });  
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
var populateDB = function() {

    var profile = [
    {
        username: "madhankumar",
        first_name: "madhan",
        last_name: "kumar",
        age: "30"
    },
    {
        username: "madhankumar1",
        first_name: "madhan",
        last_name: "kumar",
        age: "30"
    }];

    db.collection('profile', function(err, collection) {
        collection.insert(profile, {safe:true}, function(err, result) {});
    });

};
/*--------------------------------------------------------------------------------------------------------------------*/