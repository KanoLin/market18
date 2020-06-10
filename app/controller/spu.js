'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class SpuController extends Controller {
	async create() {
		const { ctx } = this;
		const rules = {
			category_id: 'int',
			name: { type: 'string', max: 255 },
			spu_pic: 'url',
			attrs: { type: 'array', itemType: 'int' },
			skus: {
				type: 'array', itemType: 'object', rule: {
					name: { type: 'string', max: 255 },
					price: 'number',
					stock: 'int',
					sku_pic: 'url?',
					des_pic: 'url?',
					v: { type: 'array', itemType: 'int' },
				}
			}
		};
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}

		const { res, msg } =await this.ctx.service.spu.create(ctx.request.body);
		if (!res) {
			ctx.status = 400;
			ctx.body = util.make_res(msg, 400, {});
		} else {
			ctx.status = 200;
			ctx.body = util.make_res(msg, 0, {});
		}
		return;
	};

	
	async search() {
		const { ctx } = this;
		const query = ctx.request.query;
		const category_id = query.category_id || null;
		const keyword = query.keyword || null;
		const top = query.top || null;
		const page = query.page || 1;
		const page_num = query.page_num || 4;

		const { res, msg, data } = await ctx.service.spu.search(category_id, keyword, parseInt(top), parseInt(page), parseInt(page_num));
		if (!res) {
			ctx.status = 400;
			ctx.body = util.make_res(msg, 400, {});
		} else {
			ctx.status = 200;
			ctx.body = util.make_res(msg, 0, { data });
		}
		return;
	}

	async detail() {
		const { ctx } = this;
		const { res, msg, data } = await ctx.service.spu.detail(ctx.params.spu_id);
		if (!res) {
			ctx.status = 400;
			ctx.body = util.make_res(msg, 400, {});
		} else {
			ctx.status = 200;
			ctx.body = util.make_res(msg, 0, { data });
		}
		return;
	}

}

module.exports = SpuController;