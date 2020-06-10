'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {
	async create(data) {
		if (data.father_id != 0) {
			const father = this.ctx.model.Category.findByPk(data.father_id);
			if (father == null) {
				return { res: false, msg: '父分类不存在' };
			}
			if (father.father_id != 0) {
				return { res: false, msg: '父分类不为一级分类' };
			}

		}
		await this.ctx.model.Category.create(data);
		return { res: true, msg: '创建成功' };
	}

	async change(id, data) {
		if (data.father_id != 0) {
			const father = this.ctx.model.findByPk(data.father_id);
			if (father == null) {
				return { res: false, msg: '父分类不存在' };
			}
		}
		await this.ctx.model.Category.update(data, { where: { id: id } });
		return { res: true, msg: '创建成功' };
	}

	async delete(id) {
		const category = await this.ctx.model.Category.findByPk(id);
		const count_sons = category.countSons();
		if (count_sons != 0) {
			return { res: false, msg: '此分类包含'+count_sons+'个子分类！' };
		}
		const count_spu = category.countSpus();
		if (count_spu != 0) {
			return { res: false, msg: '此分类包含'+count_spu+'个商品！' };
		}
		await category.destroy();

		return { res: true, msg: '' };
	}

	

}

module.exports = CategoryService;