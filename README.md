--------------------------------------------------------------------------------------------
Running the userprofiles endpoint:
--------------------------------------------------------------------------------------------

Pre-condition:
- mongodb needs to installed on the local system
- Open terminal on mac and start the local mongo db instance: $ mongod

1. Open terminal on mac

2. Clone the repository: $ git clone https://github.com/mad12blue/madhan-clarisights-userprofile.git

3. Navigate into the above cloned directory: $ cd madhan-clarisights-userprofile

4. Install all dependencies: $ npm install

5. To start the API server: $ npm start

6. Open a browser of your choice and enter the url: http://localhost:3000/profile

7. List of all the profiles are displayed

--------------------------------------------------------------------------------------------
Running unit tests on userprofiles endpoint:
--------------------------------------------------------------------------------------------

Pre-condition:
- Follow steps 1 - 4 along with the pre-condition mentioned in the above section "Running the userprofiles endpoint"

1. To run unit tests on the API endpoints: $ npm test

2. Test summary of the unit tests are displayed in the terminal

--------------------------------------------------------------------------------------------
Additional Info:
--------------------------------------------------------------------------------------------

* UserProifle Web api is implemented using Node.js

* RESTful implementation is achieved using Express.js

* MongoDB is used as the data source for storing and retrieving the profile data

* Following are the end points implemented in this api:
    - Perform Get profile
        > Retrieves id, username, first name, last name, age of all the users existing in the data source
    - Perform POST profile/new
        > Create the Profile entity with the fields described above
    - Perform GET profile/<id>
        > Retrieves username, first name, last name, age if the user exists in the data source

* Unit tests are written using Mocha framework

* Unit test assertions are done using Chai BDD assertions

--------------------------------------------------------------------------------------------
EOF
--------------------------------------------------------------------------------------------