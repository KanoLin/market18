'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class SpuController extends Controller {
	async create() {
		const { ctx } = this;
		const rules = {
			categroy_id: 'int',
			name: { type: 'string', max: 255 },
			spu_pic: { type: 'array', itemType: 'url' },
			attrs: { type: 'array', itemType: 'int' },
			skus: {
				type: 'array', itemType: 'object', rule: {
					name: { type: 'string', max: 255 },
					price: 'number',
					stock: 'int',
					sku_pic: { type: 'array', itemType: 'url' },
					des_pic: { type: 'array', itemType: 'url' },
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

		const { res, msg } = this.ctx.service.spu.create(ctx.request.data);
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
		const categroy_id = query.categroy_id || 0;
		const keyword = query.keyword || null;
		const page = query.page || 1;
		const page_num = query.page_num || 4;

		const { res, msg, data } = await ctx.service.spu.search(parseInt(categroy_id), keyword, parseInt(page), parseInt(page_num));
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
		const { res, msg, date } = await ctx.service.spu.detail(ctx.request.params.spu_id);
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