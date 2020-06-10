'use strict';

const Service = require('egg').Service;

class AttributeService extends Service {
	async create(data) {
		const categroy = await this.ctx.model.Categroy.findByFk(data.categroy_id);
		if (categroy == null) {
			return { res: false, msg: '父分类不存在！' };
		}
		const a = await categroy.hasAttribute({ name: data.name });
		if (a != null) {
			return { res: false, msg: '属性名重复！' };
		}
		await this.ctx.model.Attribute.create(data);
		return { res: true, msg: '' };
	}

	async index(categroy_id) {
		const categroy = await this.ctx.model.Categroy.findByFk(categroy_id);
		if (categroy == null) {
			return { res: false, msg: '父分类不存在！',data:{} };
		}
		const as = await this.ctx.model.Attribute.findAll({
			attributes: ['id', 'name',],
			where: { categroy_id: categroy_id }
		});
		return { res: true, msg: '', data: as.toJSON() };
	}

	async delete(id) {
		const attribute = await this.ctx.model.Attribute.findByFk(id);
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