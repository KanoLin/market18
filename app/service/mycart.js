'use strict';

const Service = require('egg').Service;

class MycartService extends Service {
	async create(user_id, data) {
		await this.ctx.model.Mycart.create({
			user_id: user_id,
			sku_id: data.sku_id,
			num: data.num
		});
		return data;
	}

	async index(user_id) {
		const data = await this.ctx.model.Mycart.findAll({
			where: { user_id: user_id },
			include: [{
				model: this.ctx.model.Sku,
				as: 'sku',
				include: [{
					model: this.ctx.model.SkuAttributeValue,
					as: 'aavs',
					include: [
						{
							model: this.ctx.model.Attribute,
							as: 'attr'
						},
						{
							model: this.ctx.model.AttributeValue,
							as: 'v'
						}
					]
				}]
			}]
		}).then(res => {
			if (res == []) return [];
			res = res.toJSON();
			for (let mc of res) {
				let attrs = [];
				let v = [];
				for (let aav of mc.sku.aavs) {
					attrs.push(aav.attr.name);
					v.push(aav.v.name);
				}
				delete mc.sku.aavs;
				mc.sku.attrs = attrs;
				mc.sku.v = v;
			}
			return res;
		});

		return data;
	}

	async delete() {
		await this.ctx.model.Mycart.findByFk(this.ctx.request.params.id).destroy();
		return;
	}


}

module.exports = MycartService;