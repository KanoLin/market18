'use strict';

const jwt = require('jsonwebtoken');
const util = require('../util');

async function auth(ctx, next) {
	const token = ctx.get('Authorization');
	let data;
	try {
		data = jwt.verify(token, process.env.JWT_KEY);
	} catch (e) {
		ctx.status = 401;
		ctx.body = util.make_res('未登录', 401, {});
		return;
	}
	ctx.current_user = await ctx.model.User.findByPk(data.id);

	await next();
}

module.exports = auth;