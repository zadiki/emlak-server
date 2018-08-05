import express from "express";
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import expressValidator from "express-validator";
import cors from 'cors';
import passport from "passport";
import mongoose from 'mongoose';
import flash from "connect-flash";
import morgan from 'morgan';
import methodOverride from 'method-override';
import cluster from "cluster";
import mongostore from "connect-mongo";

import routes from "./app/router/routes";
import passportauth from "./app/config/passport";
import  * as Constants  from "./app/utils/Constants";




var MongoStore = mongostore(session);
var app = express();
app.use(expressValidator());
app.use(cors());

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


//views engine setup
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'ejs');

mongoose.connect(Constants.MONGODB_URL, {useNewUrlParser: true});
app.use(session({
    secret: 'iProcureSecretCode',
    cookie: {maxAge: 60000 * 60 * 60 * 60},
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

passportauth();


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
    res.locals.session = req.session;
    res.locals.errors = req.flash('errors');
    res.locals.formData = req.flash("formBody")[0];
    next();
});

routes(app);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function (err, req, res, next) {
    res.status(err.status || 500).render("404", {
        message: err.message
    });

});

if (cluster.isMaster) {

    for (let i = 0; i < Constants.WORKERS; i++) {
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
    var server = app.listen(process.env.PORT || 3000, function () {
        console.log('Listening on port ' + server.address().port);
    });
}

module.exports = app;