const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: { type: String, unique: true },
	password: String,
	role: String,
	createdAt: { type: Date, default: new Date() },
	updatedAt: { type: Date, default: null },
	isDeleted: { type: Boolean, default: 0 },
	deletedAt: { type: Date, default: null },
})

const User = mongoose.model('User', userSchema)
module.exports = User
