'use strict';

const Service = require('egg').Service;

class AttributeService extends Service {
	async create(data) {
		const category = await this.ctx.model.Category.findByPk(data.category_id);
		if (category == null) {
			return { res: false, msg: '父分类不存在！' };
		}
		const a = await this.ctx.model.Attribute.findOne({ where: { name: data.name } });
		if (a != null) {
			return { res: false, msg: '属性名重复！' };
		}
		await this.ctx.model.Attribute.create(data);
		return { res: true, msg: '' };
	}

	async index(category_id) {
		const category = await this.ctx.model.Category.findByPk(category_id);
		if (category == null) {
			return { res: false, msg: '父分类不存在！',data:{} };
		}
		const attrs = await this.ctx.model.Attribute.findAll({
			attributes: ['id', 'name',],
			where: { category_id: category_id }
		});
		return { res: true, msg: '', data: attrs };
	}

	async delete(id) {
		const attribute = await this.ctx.model.Attribute.findByPk(id);
		if (attribute == null) {
			return { res: false, msg: '属性不存在！' };
		}
		const own = await attribute.getAttributeValues().then(res => {
			for (let v of res) {
				let c = v.countSkus();
				if (c != 0) return true;
			}
			return false;
		});
		if (own) {
			return { res: false, msg: '属性下存在商品！' };
		}

		await attribute.destroy();
		return { res: true, msg: '' };
	}

}
module.exports = AttributeService;