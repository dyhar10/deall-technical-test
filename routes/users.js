const express = require('express')
const UserController = require('../controllers/UserController')
const auth = require('../middleware/auth')
const roleCheck = require('../middleware/roleCheck')
const router = express.Router()

router.post('/register', auth, roleCheck, async (req, res, next) => {
	await new UserController().register(req, res, next)
})

router.post('/login', async (req, res, next) => {
	await new UserController().login(req, res, next)
})

router.get('/', auth, async (req, res, next) => {
	await new UserController().getAll(req, res, next)
})

router.get('/:username', auth, async (req, res, next) => {
	await new UserController().getByUsername(req, res, next)
})

router.put('/update/:username', auth, roleCheck, async (req, res, next) => {
	await new UserController().update(req, res, next)
})

router.delete('/delete/:username', auth, roleCheck, async (req, res, next) => {
	await new UserController().delete(req, res, next)
})

module.exports = router
