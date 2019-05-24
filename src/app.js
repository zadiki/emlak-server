import express from "express";
import path from 'path';
import bodyParser from 'body-parser';
import expressValidator from "express-validator";
import cors from 'cors';
import passport from "passport";
import mongoose from 'mongoose';
import morgan from 'morgan';
import methodOverride from 'method-override';
import cluster from "cluster";
const WORKERS = require("os").cpus().length;
import dotenv from 'dotenv';

import passportauthLocal from "./app/config/passportLocal";

import userrouter from "./app/router/UserRoutes";
import propertyroutes from "./app/router/PropertyRoutes";

var app = express();
app.use(expressValidator());
app.use(cors());

dotenv.config();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/client/build')));

app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'ejs');

const options = {
    useNewUrlParser: true,
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4
};
try {
    mongoose.connect(process.env.MONGODB_URI, options);
} catch (e) {
    console.log(e);
}

app.use(passport.initialize());
passportauthLocal();

app.use("/api/user/",userrouter);
app.use("/api/property",propertyroutes);
app.use("/*",function (req,res) {
    res.sendFile(path.join(__dirname+'/public/client/build/index.html'));
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message
    });

});

if (cluster.isMaster) {

    for (let i = 0; i < WORKERS; i++) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online.');
    });
    cluster.on('exit', function (worker, code, signal) {
        cluster.fork();
        console.log('worker ' + worker.process.pid + ' died.');
    });
 } else {
    var server = app.listen(process.env.PORT || 3001, function () {
        console.log('Listening on port ' + server.address().port);
    });
}

module.exports = app;
