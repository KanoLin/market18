'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class AttributeController extends Controller {
	async create() {
		const { ctx } = this;
		const rules = {
			name: { type: 'string', max: 255 },
			category_id: { type: 'int' }
		}
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}
		const { res, msg } = await ctx.service.attribute.create(ctx.request.body);
		if (!res) {
			ctx.status = 400;
			ctx.body = util.make_res(msg, 400, {});
		} else {
			ctx.status = 200;
			ctx.body = util.make_res(msg, 0, {});
		}
		return;
	}
	
	async index() {
		const { ctx } = this;
		const { res, msg, data } = await ctx.service.attribute.index(ctx.params.category_id);
		if (!res) {
			ctx.status = 400;
			ctx.body = util.make_res(msg, 400, {});
		} else {
			ctx.status = 200;
			ctx.body = util.make_res(msg, 0, { data });
		}
		return;
	}

	async delete() {
		const { ctx } = this;
		const { res, msg } = await ctx.service.attribute.delete(ctx.params.id);
		if (!res) {
			ctx.status = 400;
			ctx.body = util.make_res(msg, 400, {});
		} else {
			ctx.status = 200;
			ctx.body = util.make_res('删除成功', 0, {});
		}
		return;
	}

}

module.exports = AttributeController;
