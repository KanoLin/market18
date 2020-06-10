'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class CommentController extends Controller {
	async create() {
		const { ctx } = this;
		const rules = {
			star: { type: 'int', min: 1, max: 5 },
			comment: { type: 'string' },
		}
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}
		const { res, msg } = await ctx.service.comment.create(ctx.params.order_id, ctx.current_user.id, data);
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
		const data = await ctx.service.comment.index(ctx.params.spu_id);
		ctx.status = 200;
		ctx.body = util.make_res(msg, 0, { data });
		return;
	}
	
}

module.exports = CommentController;