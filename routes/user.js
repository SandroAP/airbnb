const express = require('express');
const router = express.Router();
const validator = require('validatorjs');
const firebase = require('firebase');
const { UserModel } = require('../models/user');

// GET /
router.get('/', (req,res,next) => {
	UserModel.find({}).then(doc => {
		res.json(doc)
	}).catch(err => {
		res.status(500).json({
			code: 500,
			errors,
		});
	});
	
});

// GET One/
router.get('/:id', (req,res,next) => {
	UserModel.findOne({
		id: req.query.id
	}).then(doc => {
		res.json(doc)
	}).catch(err => {
		res.status(500).json({
			code: 500,
			errors,
		});
	});
	
});

// POST /
router.post('/', (req,res,next) => {
	const { body } = req;

	const userRules = {
		name: 'required|string',
		lastName: 'required|string',
		email: 'required|string|email',
		userType: 'required|string',
		password: 'required|string|confirmed',
		password_confirmation: 'required|string',
	};

	const validation = new validator(body, userRules);
	if(validation.fails()){
		const { errors } = validation.errors;
		return res.status(400).json({
			code: 400,
			errors,
		});
	}

	const { name, lastName, email, userType, password } = body;
	firebase.auth().createUserWithEmailAndPassword(email, password).then(account => {
		const user = new UserModel({
			name,
			lastName,
			email,
			userType,
			providerId: account.user.uid,
		});

		user.save();
		return res.status(201).json({
			user
		});
	}).catch(err => {
		return res.status(400).json({
			code: 400,
			message: err.message,
		});
	});
});

// Update One/
router.put('/:id', (req,res,next) => {
	UserModel.findOneAndUpdate({
		id: req.query.id
	}, req.body, {
			new: true
	}).then(doc => {
		res.json(doc)
	}).catch(err => {
		res.status(500).json({
			code: 500,
			errors,
		});
	});
	
});

// Delete One/
router.delete('/:id', (req,res,next) => {
	UserModel.findOneAndRemove({
		id: req.query.id
	}).then(doc => {
		return res.status(204).json();
	}).catch(err => {
		res.status(500).json({
			code: 500,
			errors,
		});
	});
	
});

// GET /ALL
// GET /:id
// PUT /:id
// DELETE /:id return 204
// Documentation mongoosjs
module.exports = router;