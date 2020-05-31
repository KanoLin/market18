'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserService extends Service {
	async register(data) {
		const user = await this.ctx.model.User.findOne({ where: { email: data.email, }, });
		if (user) return { res: false };
		const salt = bcrypt.genSaltSync();
		data.password = bcrypt.hashSync(data.password, salt);
		await this.ctx.model.User.create(data);
		return { res: true };
	}

	async login(email, pwd) {
		const user = await this.ctx.model.User.findOne({ where: { email: email, }, });
		if (!user || !bcrypt.compareSync(pwd, user.password))
			return { res: false, data: {} }
		const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, { expiresIn: '7d' });
		return { res: true, data: { Authorization: token } };
	}

	async change_pwd(email, new_pwd) {
		const user = await this.ctx.model.User.findOne({ where: { email: email, }, });
		if (!user) return { res: false };
		const salt = bcrypt.genSaltSync();
		const password = bcrypt.hashSync(new_pwd, salt);
		user.update({ password: password });
		return { res: true };
	}
}

module.exports = UserService;