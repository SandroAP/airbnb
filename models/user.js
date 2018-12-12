const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: String, 
	lastName: String,
	description: String,
	phoneNumber: String,
	email: String,
	providerId: String,
	address: {
		street: String,
		city: String,
		state: String,
		country: String
	},
	isVerified: Boolean,
	profilePicture: String,
	userType: String
}, {
	timestamps: true,
});

// Model

const UserModel = mongoose.model('User', UserSchema);

module.exports = {UserSchema, UserModel};
