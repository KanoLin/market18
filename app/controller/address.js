'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class AddressController extends Controller {
	async create() {
		const { ctx } = this;
		const rules = {
			default: { type: 'boolean' },
			province: { type: 'string', max: 20 },
			city: { type: 'string', max: 20 },
			county: { type: 'string', max: 20 },
			postal_code: { type: 'string', max: 6 },
			address: { type: 'string', max: 100 },
			recipient: { type: 'string', max: 30 },
			phone: { type: 'string', max: 15 },
		}
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}

		await ctx.service.address.create(ctx.current_user.id, ctx.request.body);
		
		ctx.status = 200;
		ctx.body = util.make_res('添加成功', 0, {});
		return;
	}

	async index() {
		const { ctx } = this;
		const data = await ctx.model.Address.findAll({ where: { user_id: ctx.current_user.id } });
		ctx.status = 200;
		ctx.body = util.make_res('', 0, { data });
		return;
	}
	
	async change() {
		const { ctx } = this;
		const rules = {
			default: { type: 'boolean' },
			province: { type: 'string', max: 20 },
			city: { type: 'string', max: 20 },
			county: { type: 'string', max: 20 },
			postal_code: { type: 'string', max: 6 },
			address: { type: 'string', max: 100 },
			recipient: { type: 'string', max: 30 },
			phone: { type: 'string', max: 15 },
		}
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}

		await ctx.service.address.change(ctx.params.id, ctx.current_user.id, ctx.request.body);

		ctx.status = 200;
		ctx.body = util.make_res('修改成功', 0, {});
		return;
	}

	async delete() {
		const { ctx } = this;
		await ctx.service.address.destroy(ctx.params.id);
		ctx.status = 200;
		ctx.body = util.make_res('删除成功', 0, {});
		return;
	}

	

}

module.exports = AddressController;