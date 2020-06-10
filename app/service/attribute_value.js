'use strict';

const Service = require('egg').Service;

class AttributeValueService extends Service {
	async create(data) {
		const attribute = await this.ctx.model.Attribute.findByPk(data.attribute_id);
		if (attribute == null) {
			return { res: false, msg: '父属性不存在！' };
		}
		const a = await this.ctx.model.AttributeValue.findOne({ where: { name: data.name, attribute_id: data.attribute_id } });
		if (a != null) {
			return { res: false, msg: '属性值重复！' };
		}
		await this.ctx.model.AttributeValue.create(data);
		return { res: true, msg: '' };
	}

	async index(attribute_id) {
		const attribute = await this.ctx.model.Attribute.findByPk(attribute_id);
		if (attribute == null) {
			return { res: false, msg: '父属性不存在！',data:{} };
		}
		const vs = await this.ctx.model.AttributeValue.findAll({
			attributes: ['id', 'name',],
			where: { attribute_id: attribute_id }
		});
		return { res: true, msg: '', data: vs };
	}

	async delete(id) {
		const value = await this.ctx.model.AttributeValue.findByPk(id);
		if (value == null) {
			return { res: false, msg: '属性值不存在！' };
		}
		const own = value.countSkus();
		if (own != 0) {
			return { res: false, msg: '属性下存在商品！' };
		}
		
		await value.destroy();
		return { res: true, msg: '' };
	}

}
module.exports = AttributeValueService;