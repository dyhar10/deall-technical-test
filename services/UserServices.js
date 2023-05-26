const { GenericResponseEntity } = require('../utils/GenericResponse')
const httpStatus = require('http-status')
const bcrypt = require('bcrypt')
const User = require('../database/schema/userSchema')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

class UserServices {
	async register(body) {
		const response = new GenericResponseEntity()
		try {
			const registrationSchema = Joi.object({
				username: Joi.string().required(),
				password: Joi.string().required(),
				role: Joi.string().valid('admin', 'user').required(),
			})

			const validationBody = registrationSchema.validate(body)
			if (validationBody.error) {
				throw Error(validationBody.error)
			}

			const checkUsername = await User.findOne({
				username: body.username,
			})
			if (checkUsername) throw Error('Username already taken !')

			body.password = await bcrypt.hash(
				body.password,
				Number(process.env.SALT_ROUNDS)
			)

			response.statusCode = httpStatus.CREATED
			response.success = true
			response.message = 'Success register new user'
			response.data = await User.create(body)
			return response
		} catch (error) {
			response.statusCode = httpStatus.BAD_REQUEST
			response.success = false
			response.message = error.message
			return response
		}
	}

	async login(body) {
		const response = new GenericResponseEntity()
		try {
			const registrationSchema = Joi.object({
				username: Joi.string().required(),
				password: Joi.string().required(),
			})

			const validationBody = registrationSchema.validate(body)
			if (validationBody.error) {
				throw Error(validationBody.error)
			}

			const checkUser = await User.findOne({
				username: body.username,
			})
			if (!checkUser) throw Error('User not found !')

			const checkPassword = await bcrypt.compare(
				body.password,
				checkUser.password
			)
			if (!checkPassword) throw Error('Password is wrong !')

			response.statusCode = httpStatus.CREATED
			response.success = true
			response.message = 'Success login !'
			response.data = await jwt.sign(
				{
					username: checkUser.username,
					role: checkUser.role,
				},
				process.env.SECRET_KEY,
				{ expiresIn: '1d' }
			)
			return response
		} catch (error) {
			response.statusCode = httpStatus.BAD_REQUEST
			response.success = false
			response.message = error.message
			return response
		}
	}

	async getAll() {
		const response = new GenericResponseEntity()
		try {
			response.statusCode = httpStatus.OK
			response.success = true
			response.message = 'Success get all user'
			response.data = await User.find({
				isDeleted: false,
			})
			return response
		} catch (error) {
			response.statusCode = httpStatus.BAD_REQUEST
			response.success = false
			response.message = error.message
			return response
		}
	}

	async getByUsername(username) {
		const response = new GenericResponseEntity()
		try {
			response.statusCode = httpStatus.OK
			response.success = true
			response.message = 'Success get user'
			response.data = await User.findOne({
				username: username,
				isDeleted: false,
			})
			return response
		} catch (error) {
			response.statusCode = httpStatus.BAD_REQUEST
			response.success = false
			response.message = error.message
			return response
		}
	}

	async update(username, body) {
		const response = new GenericResponseEntity()
		try {
			const checkUser = await User.findOne({
				username: username,
			})
			if (!checkUser) throw Error('User not found !')

			if (body.username) {
				const checkUsername = await User.findOne({
					username: body.username,
				})
				if (checkUsername) throw Error('Username is already taken !')
			}

			if (body.password) {
				const checkPassword  = await bcrypt.compare(body.password, checkUser.password)
				if (!checkPassword) throw Error('Old password is wrong !')
				if (
					!body.newPassword ||
					!body.repeatPassword ||
					(body.newPassword &&
						body.repeatPassword &&
						body.newPassword !== body.repeatPassword)
				) {
					throw Error(
						'New and Repeat Password is not same or not filled !'
					)
				}
				body.password = await bcrypt.hash(
					body.newPassword,
					Number(process.env.SALT_ROUNDS)
				)
			}

			if (body.role) throw Error(`Role can't be changed !`)

			await User.findOneAndUpdate({ username: username }, body)

			response.statusCode = httpStatus.OK
			response.success = true
			response.message = 'Success update user'
			response.data = await User.findOneAndUpdate(
				{ username: username },
				body
			)
			return response
		} catch (error) {
			response.statusCode = httpStatus.BAD_REQUEST
			response.success = false
			response.message = error.message
			return response
		}
	}

	async delete(username) {
		const response = new GenericResponseEntity()
		try {
			await User.findOneAndUpdate(
				{ username: username },
				{ isDeleted: 1, deletedAt: new Date() }
			)
			response.statusCode = httpStatus.OK
			response.success = true
			response.message = 'Success delete user'
			response.data = await User.findOne({ username: username })
			return response
		} catch (error) {
			response.statusCode = httpStatus.BAD_REQUEST
			response.success = false
			response.message = error.message
			return response
		}
	}
}

module.exports = UserServices
