require('dotenv').config()
const User = require('./schema/userSchema')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

class SeedAdmin {
	async exec() {
		const payload = {
			username: 'admin',
			password: bcrypt.hashSync('admin', Number(process.env.SALT_ROUNDS)),
			role: 'admin',
			createdAt: new Date(),
		}
		await mongoose.connect(
			`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		)

		const checkUser = await User.findOne({ username: 'admin' })
		if (checkUser === null) {
			await User.create(payload)
			return 'Seeder successfully !'
		} else {
			return 'Seeder is already used !'
		}
	}
}

new SeedAdmin()
	.exec()
	.then((result) => console.log(result))
	.catch((e) => console.error(e))
	.finally(() => process.exit())
