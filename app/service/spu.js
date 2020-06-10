'use strict';

const Service = require('egg').Service;


class SpuService extends Service {
	async create(data) {
		const category = this.ctx.model.Category.findByPk(data.category_id);
		if (!category) return { res: false, msg: '分类不存在！' };
		const attrs_num = await this.ctx.model.Attribute.count({ where: { id: { [this.app.Sequelize.Op.in]: data.attrs, } } });
		if (attrs_num != data.attrs.length) return { res: false, msg: '部分属性不存在！' };

		const spu = await this.ctx.model.Spu.create({
			name: data.name,
			category_id: data.category_id,
			spu_pic: data.spu_pic,
		});
		for (let _sku of data.skus) {
			if (data.attrs.length != _sku.v.length) return { res: false, msg: 'sku属性值数量与属性数量不匹配！' };
			const v_num = await this.ctx.model.AttributeValue.count({ where: { id: { [this.app.Sequelize.Op.in]: _sku.v, } } });
			if (v_num != _sku.v.length) return { res: false, msg: '部分属性值不存在！' };
			let sku = await this.ctx.model.Sku.create({
				spu_id: spu.id,
				name: _sku.name,
				price: _sku.price,
				stock: _sku.stock,
				sku_pic: _sku.sku_pic,
				des_pic: _sku.des_pic,
			});
			for (let i = 0; i < _sku.v.length; i++) {
				await this.ctx.model.SkuAttributeValue.create({
					attribute_id: data.attrs[i],
					attribute_value_id: _sku.v[i],
					sku_id: sku.id,
				});
			}
		}

		return { res: true, msg: '' };
	}

	async search(category_id, keyword, top, page, page_num) {
		let option = {};
		option.limit = page_num;
		option.offset = (page - 1) * page_num;
		const op = this.app.Sequelize.Op;
		// if (top != null) {
		// 	const skus = await this.ctx.model.Sku.findAll({
		// 		attributes:[['id','spu_id'],['sku_pic','spu_pic']]
		// 	});
		// }

		if (category_id != null) {
			const category = await this.ctx.model.Category.findByPk(category_id);
			if (!category) return { res: false, msg: '分类不存在', data: {} }
			if (category.father_id != 0) {
				const sons = await category.getSons();
				let son_ids = [];
				for (let s of sons) son_ids.push(s.id);
				option.where = { category_id: { [op.in]: son_ids } };
			} else 
				option.where = { category_id: category_id };
		}
		if (keyword != null)
			option.where = Object.assign(option.where || {}, { name: { [op.substring]: keyword } });
		option.include = [{ model: this.ctx.model.Category, as: 'category' }];
		option.attributes = [['id', 'spu_id'], 'name', 'spu_pic'];
		let spus = await this.ctx.model.Spu.findAll(option);
		if (spus == null) return { res: false, msg: '', data:{} };
		let data = [];
		for (let s of spus) { 
			s = s.toJSON();
			let ss = await this.ctx.model.Sku.findOne({ where: { spu_id: s.spu_id } });
			s.price = ss.price;
			s.category = s.category.name;
			data.push(s);
		}
		return { res: true, msg: '', data: data };
	}

	async detail(spu_id) {
		let spu = await this.ctx.model.Spu.findOne({
			attributes: [['id', 'spu_id'], 'spu_pic', 'name'],
			where: { id: spu_id },
			include: [
				{
					model: this.ctx.model.Category,
					as: 'category',
					attributes: ['id', 'name', 'father_id']
				},
				{
					model: this.ctx.model.Sku,
					as: 'skus',
					attributes: ['id', 'price', 'stock', 'sku_pic', 'des_pic', 'sales'],
					include: [
						{
							model: this.ctx.model.SkuAttributeValue,
							as: 'aavs'
						}
					]
				}
			]
		});
		if (spu == null) return { res: false, msg: '商品不存在！', data: {} };
		spu = spu.toJSON();
		let attr_ids = Array();
		let value_ids = Array();
		
		for (let sku of spu.skus) {
			let attrs = Array();
			let v = Array();
			for (let aav of sku.aavs) {
				attr_ids.push(aav.attribute_id);
				value_ids.push(aav.attribute_value_id);
				attrs.push(aav.attribute_id);
				v.push(aav.attribute_value_id);
			}
			sku.attrs = attrs;
			sku.v = v;
			delete sku.aavs;
		}
		attr_ids = Array.from(new Set(attr_ids));
		value_ids = Array.from(new Set(value_ids));
		let attrs2 = Array();
		for (let aid of attr_ids) {
			const attribute = await this.ctx.model.Attribute.findByPk(aid);
			const values = await this.ctx.model.AttributeValue.findAll({
				attributes: ['id', 'name'],
				where: {
					attribute_id: aid,
					id: { [this.app.Sequelize.Op.in]: value_ids }
				}
			});
			let attr = {
				id: attribute.id,
				name: attribute.name,
				values: values
			}
			attrs2.push(attr);
		}
		spu.attrs = attrs2;
		return { res: true, msg: '', data: spu };
	}

	
}
module.exports = SpuService;