class GenericResponseEntity {
	success = false
	message = null
	data = null
	statusCode = 400
	startTime = 0

	constructor() {
		this.startTime = new Date().getTime()
	}

	toResponse() {
		this.statusCode = this.success ? 200 : this.statusCode ?? 400

		return {
			statusCode: this.statusCode,
			success: this.success,
			message: this.message,
			data: this.data,
			responseTime: this.startTime
				? new Date().getTime() - this.startTime + ' ms.'
				: 'unknown',
		}
	}

	errorResponse(message, code, data) {
		const res = new GenericResponseEntity()
		res.success = false
		res.message = message
		res.statusCode = code || 400
		res.data = data

		return res
	}

	successResponse(message, code, data) {
		const res = new GenericResponseEntity()
		res.success = true
		res.message = message
		res.statusCode = code || 200
		res.data = data

		return res
	}
}

const httpResponse = (entity, res) => {
	if (entity instanceof GenericResponseEntity) {
		const response = entity.toResponse()
		res.status(response.statusCode).send({
			success: response.success,
			message: response.message,
			messageTitle: response.messageTitle,
			data: response.data,
			responseTime: response.responseTime,
		})
		return
	}

	res.status(500)
}

module.exports = {
	GenericResponseEntity,
	httpResponse
}
