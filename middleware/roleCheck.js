const httpStatus = require('http-status')
const {
	GenericResponseEntity,
	httpResponse,
} = require('../utils/GenericResponse')

module.exports = async function (req, res, next) {
	const response = new GenericResponseEntity()
	try {
		response.statusCode = httpStatus.FORBIDDEN
		response.message = `Forbidden / You don't have authorize to access this action !`
		if (req.user.role !== 'admin') {
			return httpResponse(response, res)
		}
        next()
	} catch (e) {
		response.statusCode = httpStatus.BAD_REQUEST
		response.message = e.message
		return httpResponse(response, res)
	}
}
