'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class MycartController extends Controller {
	async create() {
		const { ctx } = this;
		const rules = {
			id: 'int',
			address_id: 'int',
			num: 'int',
			anonymous:'boolean'
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
		const data=await this.ctx.service.index(ctx.current_user.id);
		ctx.status = 200;
		ctx.body = util.make_res('', 0, { data });
		return;
	}

	async delete() {
		await this.ctx.service.mycart.delete(this.ctx.params.id);
		ctx.status = 200;
		ctx.body = util.make_res('', 0, {});
		return;
	}

}

module.exports = MycartController;