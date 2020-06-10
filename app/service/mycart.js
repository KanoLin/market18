'use strict';

const Service = require('egg').Service;

class MycartService extends Service {
	async create(user_id, data) {
		await this.ctx.model.Mycart.create({
			address_id: data.address_id,
			anonymous:data.anonymous,
			user_id: user_id,
			sku_id: data.id,
			num: data.num
		});
		return data;
	}

	async index(user_id) {
		const data = await this.ctx.model.Mycart.findAll({
			attribtues: ['id', 'num'],
			where: { user_id: user_id },
			include: [{
				model: this.ctx.model.Sku,
				as: 'sku',
				attributes: ['id', 'price', 'stock', 'sku_pic', 'des_pic', 'sales'],
				include: [{
					model: this.ctx.model.SkuAttributeValue,
					as: 'aavs',
					include: [
						{
							model: this.ctx.model.Attribute,
							as: 'attribute'
						},
						{
							model: this.ctx.model.AttributeValue,
							as: 'values'
						}
					]
				}]
			}]
		}).then(res => {
			if (res == []) return [];
			for (let mc of res) {
				let attrs = [];
				let v = [];
				for (let aav of mc.sku.aavs) {
					attrs.push(aav.attribute.name);
					v.push(aav.values.name);
				}
				mc = mc.toJSON();
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