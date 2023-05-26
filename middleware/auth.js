const jwt = require('jsonwebtoken')
const {
	GenericResponseEntity,
	httpResponse,
} = require('../utils/GenericResponse')
const User = require('../database/schema/userSchema')
const httpStatus = require('http-status')

module.exports = async function (req, res, next) {
	const response = new GenericResponseEntity()
	try {
		response.statusCode = httpStatus.UNAUTHORIZED
		response.message = httpStatus['401_MESSAGE']
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1]
			const decoded = jwt.verify(token, process.env.SECRET_KEY)

			if (decoded) {
				const user = await User.findOne({ username: decoded.username })
				if (!user) {
					response.message = 'User not found !'
					return httpResponse(response, res)
				}

				req.user = user
				next()
			} else {
				response.message = 'Secret key wrong or token is not valid !'
				return httpResponse(response, res)
			}
		} else {
			response.message = 'Token not found !'
			return httpResponse(response, res)
		}
	} catch (e) {
		response.message = e.message
		httpResponse(response, res)
	}
}
