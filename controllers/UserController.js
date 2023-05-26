const UserServices = require('../services/UserServices')
const { httpResponse } = require('../utils/GenericResponse')

class UserController {
	async register(req, res, next) {
		httpResponse(await new UserServices().register(req.body), res)
	}

	async login(req, res, next) {
		httpResponse(await new UserServices().login(req.body), res)
	}

	async getAll(req, res, next) {
		httpResponse(await new UserServices().getAll(), res)
	}

	async getByUsername(req, res, next) {
		httpResponse(await new UserServices().getByUsername(req.params.username), res)
	}

	async update(req, res, next) {
		httpResponse(await new UserServices().update(req.params.username, req.body), res)
	}

	async delete(req, res, next) {
		httpResponse(await new UserServices().delete(req.params.username), res)
	}
}

module.exports = UserController
