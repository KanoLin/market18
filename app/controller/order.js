'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class OrderController extends Controller {
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
		const { res, msg } = await ctx.service.order.create(data);
		if (!res) {
			ctx.status = 400;
			ctx.body = util.make_res(msg, 400, {});
		} else {
			ctx.status = 200;
			ctx.body = util.make_res(msg, 0, {});
		}
		return;
	}

	async create_from_cart() {
		const { ctx } = this;
		const rules = {
			address_id: 'int',
			anonymous:'boolean',
			cart_id_list: { type: 'array', itemType: 'int' }
		}
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}
		const { res, msg, data } = await ctx.service.order.create_from_cart(data);
		if (!res) {
			ctx.status = 400;
			ctx.body = util.make_res(msg, 400, { data });
		} else {
			ctx.status = 200;
			ctx.body = util.make_res(msg, 0, { data });
		}
		return;
	}

	async status_update() {
		const { ctx } = this;
		const rules = {
			status: 'int',
			description: { type: 'string', max: 255 }
		}
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}
		const { res, msg } = await ctx.service.order.status_update(ctx.request.params.id, ctx.request.data);
		if (!res) {
			ctx.status = 400;
			ctx.body = util.make_res(msg, 400, {});
		} else {
			ctx.status = 200;
			ctx.body = util.make_res(msg, 0, {});
		}
		return;

	}

	async detail() {
		const { ctx } = this;
		const { res, msg, data } = await ctx.service.order.detail(ctx.request.params.id);
		if (!res) {
			ctx.status = 400;
			ctx.body = util.make_res(msg, 400, { data });
		} else {
			ctx.status = 200;
			ctx.body = util.make_res(msg, 0, { data });
		}
		return;
	}

	async index_user() {
		const { ctx } = this;
		const data = await ctx.service.order.index_user(ctx.current_user.id);
		ctx.status = 200;
		ctx.body = util.make_res('', 0, { data });
		return;
	}

	async index() {
		const { ctx } = this;
		const spu_id = ctx.request.query.spu_id || 0;
		const sku_id = ctx.request.query.sku_id || 0;
		const data = await ctx.service.order.index(parseInt(spu_id), parseInt(sku_id));
		ctx.status = 200;
		ctx.body = util.make_res('', 0, { data });
		return;
	}


}

module.exports = OrderController;