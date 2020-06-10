'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

class CategroyController extends Controller {
	async create() {
		const { ctx } = this;
		const rules = {
			name: { type: 'string', max: 30 },
			father_id: { type: 'int', min: 0 },
		}
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}

		const { res, msg } = await ctx.service.categroy.create(ctx.request.data);
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
		const data = await ctx.model.Categroy.findAll({
			attributes: ['id', 'name'],
			where: { father_id: 0 },
			include: [{
				model: ctx.model.Category,
				as: 'sons',
				attributes: ['id', 'name'],
			}]
		});
		ctx.status = 200;
		ctx.body = util.make_res('', 0, { data });
		return;
	}

	async change() {
		const { ctx } = this;
		const rules = {
			name: { type: 'string', max: 30, require: false },
			father_id: { type: 'int', min: 0, require: false },
		}
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}
		const { res, msg } = await ctx.service.categroy.change(ctx.params.id, ctx.request.data);
		if (!res) {
			ctx.status = 400;
			ctx.body = util.make_res(msg, 400, {});
		} else {
			ctx.status = 200;
			ctx.body = util.make_res(msg, 0, {});
		}
		return;
	}

	async delete() {
		const { ctx } = this;
		const { res, msg } = await ctx.service.categroy.delete(ctx.params.id);
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

module.exports = CategroyController;