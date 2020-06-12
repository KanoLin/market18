'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class MycartController extends Controller {
	async create() {
		const { ctx } = this;
		const rules = {
			sku_id: 'int',
			num: 'int'
		}
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}
		await ctx.service.mycart.create(ctx.current_user.id, ctx.request.body);
		ctx.status = 200;
		ctx.body = util.make_res('', 0, {});
		return;
	}

	async index() {
		const { ctx } = this;
		const data=await ctx.service.mycart.index(ctx.current_user.id);
		ctx.status = 200;
		ctx.body = util.make_res('', 0, { data });
		return;
	}

	async delete() {
		await this.ctx.service.mycart.delete(this.ctx.params.id);
		this.ctx.status = 200;
		this.ctx.body = util.make_res('', 0, {});
		return;
	}

}

module.exports = MycartController;