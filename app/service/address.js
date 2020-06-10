'use strict';

const Service = require('egg').Service;

class AddressService extends Service {
	async create(user_id, data) {
		if (data.default == true) {
			await this.ctx.model.Address.update({ default: false }, { where: { user_id: user_id, default: true } });
		}
		await this.ctx.model.Address.create({ ...data, user_id: user_id });
		return;
	}

	async change(id, user_id, data) {
		if (data.default == true) {
			await this.ctx.model.Address.update({ default: false }, { where: { user_id: user_id, default: true } });
		}
		await this.ctx.model.Address.update(data, { where: { id: id } });
		return;
	}

	async destroy(id) {
		await this.ctx.model.Address.destroy({ where: { id: id } });
		return;
	}

}

module.exports = AddressService;