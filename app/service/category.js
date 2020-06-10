'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {
	async create(data) {
		if (data.father_id != 0) {
			const father = this.ctx.model.Categroy.findByPk(data.father_id);
			if (father == null) {
				return { res: false, msg: '父分类不存在' };
			}
			if (father.father_id != 0) {
				return { res: false, msg: '父分类不为一级分类' };
			}

		}
		await this.ctx.model.Categroy.create(data);
		return { res: true, msg: '创建成功' };
	}

	async change(id, data) {
		if (data.father_id != 0) {
			const father = this.ctx.model.findByPk(data.father_id);
			if (father == null) {
				return { res: false, msg: '父分类不存在' };
			}
		}
		await this.ctx.model.Categroy.update(data, { where: { id: id } });
		return { res: true, msg: '创建成功' };
	}

	async delete(id) {
		const categroy = await this.ctx.model.Categroy.findByPk(id);
		const count_sons = categroy.countSons();
		if (count_sons != 0) {
			return { res: false, msg: '此分类包含'+count_sons+'个子分类！' };
		}
		const count_spu = categroy.countSpus();
		if (count_spu != 0) {
			return { res: false, msg: '此分类包含'+count_spu+'个商品！' };
		}
		await categroy.destroy();

		return { res: true, msg: '' };
	}

	

}

module.exports = CategoryService;