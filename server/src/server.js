// server.js 
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

const uri = "mongodb+srv://vp6514764:kHO64evsoP57WUCq@test.khpg1.mongodb.net/?retryWrites=true&w=majority&appName=Test"
const dbName = 'Test';

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

(async function () {
    let client;


    try {
        client = await MongoClient.connect(uri);
        console.log("Connected correctly to server");


        const db = client.db(dbName);
        require('../../app/routes')(app, db);


        app.listen(port, () => {
            console.log('We are live on ' + port);
        });
    } catch (err) {
        console.log(err.stack);
    }
})();