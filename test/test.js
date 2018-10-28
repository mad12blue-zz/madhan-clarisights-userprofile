'use strict';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('../server.js');
let timeOut = 5000;

describe('Tests for API endpoint /profile', function() {
  this.timeout(timeOut);

  it('should return all profiles', function() {
    return chai.request(app)
      .get('/profile')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;        
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
      });
  });

  it('should return Not Found for invalid path', function() {
    return chai.request(app)
      .get('/INVALID_PATH')
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });

});

describe('Tests for API endpoint /profile/:id', function() {
  this.timeout(timeOut);

  it('should return a specific profile for valid id', async function() {
    let data = await chai.request(app)
      .get('/profile')
      .then(function(res) {
         return [res.body[0]._id, res.body[0].username];
      });
    
    return chai.request(app)
      .get('/profile/'+data[0])
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;        
        expect(res.body).to.be.an('object');
        expect(res.body.username).to.be.eq(data[1]);
      });
  });

  it('should return error for non mongoid for invalid id', function() {
    return chai.request(app)
      .get('/profile/11111aaaaa')
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;        
        expect(res.body).to.be.an('object');
        expect(res.body.id.message).to.be.eq('The id value is malformed.');
        expect(res.body.id.rule).to.be.eq('mongoId');
      });
  });

  it('should return error for non matching id', function() {
    return chai.request(app)
      .get('/profile/5bd526a425f8fbba5301d6ea')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;        
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.eq('No matching id');
      });
  });

});

describe('Tests for API endpoint /profile/new', function() {
  this.timeout(timeOut);

  let uniqueName = "mk"+Date.now()
  it('should add new profile for valid data', function() {    
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "madhan",
          "last_name": "kumar",
          "age": "30"
        })
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.be.an('object');
        expect(res.body[0]).to.have.property('username', uniqueName);
      });
  });

  it('should return error for duplicate username', function() {
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "madhan",
          "last_name": "kumar",
          "age": "30"
        })
      .then(function(res) {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.eq('A profile with this username already exists. Please choose a different username.');
      });
  });

  it('should return error for missing username', function() {
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": "",
          "first_name": "madhan",
          "last_name": "kumar",
          "age": "30"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.username.message).to.be.eq('The username field is mandatory.');
        expect(res.body.username.rule).to.be.eq('required');
      });
  });

  it('should return error for min length username', function() {
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": "a",
          "first_name": "madhan",
          "last_name": "kumar",
          "age": "30"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.username.message).to.be.eq('The username value is malformed.');
        expect(res.body.username.rule).to.be.eq('minLength');
      });
  });

  it('should return error for max length username', function() {
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": "123456789012345678901234567890123456789012345678901",
          "first_name": "madhan",
          "last_name": "kumar",
          "age": "30"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.username.message).to.be.eq('The username can not be greater than 50.');
        expect(res.body.username.rule).to.be.eq('maxLength');
      });
  });

  it('should return error for missing first_name', function() {
    uniqueName = "mk"+Date.now()
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "",
          "last_name": "kumar",
          "age": "30"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.first_name.message).to.be.eq('The first name field is mandatory.');
        expect(res.body.first_name.rule).to.be.eq('required');
      });
  });

  it('should return error for min length first_name', function() {
    uniqueName = "mk"+Date.now()
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "m",
          "last_name": "kumar",
          "age": "30"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.first_name.message).to.be.eq('The first name value is malformed.');
        expect(res.body.first_name.rule).to.be.eq('minLength');
      });
  });

  it('should return error for max length first_name', function() {
    uniqueName = "mk"+Date.now()
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "123456789012345678901234567890123456789012345678901",
          "last_name": "kumar",
          "age": "30"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.first_name.message).to.be.eq('The first name can not be greater than 50.');
        expect(res.body.first_name.rule).to.be.eq('maxLength');
      });
  });

  it('should return error for missing last_name', function() {
    uniqueName = "mk"+Date.now()
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "madhan",
          "last_name": "",
          "age": "30"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.last_name.message).to.be.eq('The last name field is mandatory.');
        expect(res.body.last_name.rule).to.be.eq('required');
      });
  });

  it('should return error for min length last_name', function() {
    uniqueName = "mk"+Date.now()
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "madhan",
          "last_name": "k",
          "age": "30"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.last_name.message).to.be.eq('The last name value is malformed.');
        expect(res.body.last_name.rule).to.be.eq('minLength');
      });
  });

  it('should return error for max length last_name', function() {
    uniqueName = "mk"+Date.now()
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "madhan",
          "last_name": "123456789012345678901234567890123456789012345678901",
          "age": "30"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.last_name.message).to.be.eq('The last name can not be greater than 50.');
        expect(res.body.last_name.rule).to.be.eq('maxLength');
      });
  });

  it('should return error for missing age', function() {
    uniqueName = "mk"+Date.now()
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "madhan",
          "last_name": "kumar",
          "age": ""
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.age.message).to.be.eq('The age field is mandatory.');
        expect(res.body.age.rule).to.be.eq('required');
      });
  });

  it('should return error for min value age', function() {
    uniqueName = "mk"+Date.now()
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "madhan",
          "last_name": "kumar",
          "age": "0"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.age.message).to.be.eq('The age must be at least 1.');
        expect(res.body.age.rule).to.be.eq('min');
      });
  });

  it('should return error for max length age', function() {
    uniqueName = "mk"+Date.now()
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "madhan",
          "last_name": "kumar",
          "age": "130"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.age.message).to.be.eq('The age can not be greater than 120.');
        expect(res.body.age.rule).to.be.eq('max');
      });
  });

  it('should return error for non positive integer value age', function() {
    uniqueName = "mk"+Date.now()
    return chai.request(app)
      .post('/profile/new')
      .send({
          "username": uniqueName,
          "first_name": "madhan",
          "last_name": "kumar",
          "age": "ab"
        })
      .then(function(res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.age.message).to.be.eq('The age must be an integer.');
        expect(res.body.age.rule).to.be.eq('integer');
      });
  });

});