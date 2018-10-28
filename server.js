var express = require('express');
var profile = require('./routes/profile');
const validator = require('node-input-validator');
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

//Endpoint to Get the list of all profiles in the db
app.get('/profile', profile.findAll);

//Endpoint to Get a specific profile linked to a id in the db
app.get('/profile/:id', function (req, res) {
    let validate = new validator( req.params, {
            id:'required|mongoId'
            });
        validate.check().then(function (matched) {
            if (!matched) {
                res.status(422).send(validate.errors);
            } else {
                profile.findById(req, res);
        }
    });
});

//Endpoint to Add a new profile into the db
app.post('/profile/new', function (req, res) {
    let validate = new validator( req.body, {
            username:'required|minLength:5|maxLength:50',
            first_name: 'required|string|minLength:2|maxLength:50',
            last_name: 'required|string|minLength:2|maxLength:50',
            age: 'required|integer|min:1|max:120'
            });
        validate.check().then(function (matched) {
            if (!matched) {
                res.status(422).send(validate.errors);
            } else {
                profile.addProfile(req, res);
            }
    });
});

//Port on which the endpoint will run
app.listen(3000);
console.log('Listening on port 3000...');

module.exports = app;