const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const firebase = require('firebase');
require('firebase/auth');

// FIREBASE
const firebaseConfig = {
	apiKey: process.env.FIREBASE_APIKEY,
	authDomaing: process.env.FIREBASE_AUTHDOMAIN,
	databaseUrl: process.env.FIREBASE_DATABASEURL,
	storageBucket: process.env.FIREBASE_STORAGEBUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const app = express();

// Getting routes
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Adding routes to Express application
app.use('/', indexRouter);
app.use('/user', userRouter); /* user */

//Cach 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});


//Error handler
app.use((err, req, res, next) => {
	const statusCode = err.status || 500;

	//return error
	return res.status(statusCode).json({
		code: statusCode,
		message: err.message,
	})
	
});

module.exports = app;
