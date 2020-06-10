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
		const carts = await this.ctx.model.Mycart.findAll({
			attributes: ['id', 'num'],
			where: { user_id: user_id },
			include: [{
				model: this.ctx.model.Sku,
				as: 'sku',
				attributes: ['id', 'name', 'price', 'stock', 'sku_pic'],
				include: [{
					model: this.ctx.model.SkuAttributeValue,
					as: 'aavs',
					include: [
						{
							model: this.ctx.model.Attribute,
							as: 'attribute',
							attributes:['id','name']
						},
						{
							model: this.ctx.model.AttributeValue,
							as: 'values',
							attributes:['id','name'],
						}
					]
				}]
			}]
		});
		if (carts == []) return [];
		let data=[]
		for (let mc of carts) {
			let attrs = [];
			let v = [];
			for (let aav of mc.sku.aavs) {
				attrs.push(aav.attribute.name);
				v.push(aav.values.name);
			}
			let d=mc.toJSON();
			delete d.sku.aavs;
			d.sku.attrs = attrs;
			d.sku.v = v;
			data.push(d);
			
		}
		return data;

	}

	async delete() {
		const mc = await this.ctx.model.Mycart.findByPk(this.ctx.params.id);
		mc.destroy();
		return;
	}


}

module.exports = MycartService;