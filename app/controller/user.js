'use strict';

const Controller = require('egg').Controller;
const util = require('../util');

// 用户注册登录修改信息
class UserController extends Controller {
	// 登录
	async login() {
		const email = this.ctx.request.body.email;
		const pwd = this.ctx.request.body.password;
		const { res, data } = await this.ctx.service.user.login(email, pwd);
		if (res) {
			this.ctx.status = 200;
			this.ctx.body = util.make_res('登录成功', 0, data);
		} else {
			this.ctx.status = 401;
			this.ctx.body = util.make_res('用户或密码错误', 401, {});
		}
		return;
	}

	// 注册
	async register() {
		const { ctx, app } = this;
		const rules = {
			email: { type: 'email' },
			password: { type: 'string' },
			code: { type: 'string' },
		};
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}

		const captcha = await app.redis.get(ctx.request.body.email);
		if (captcha !== ctx.request.body.code) {
			ctx.status = 400;
			ctx.body = util.make_res('验证码错误', 400, {});
			return;
		}
		const { res } = await ctx.service.user.register(ctx.request.body);
		if (res) {
			ctx.status = 200;
			ctx.body = util.make_res('注册成功', 0, {});
		} else {
			ctx.status = 400;
			ctx.body = util.make_res('该邮箱已被注册', 400, {});
		}
		return;
	}

	// 邮件验证码
	async send_captcha() {
		const { ctx, app } = this;
		const rules = {
			email: { type: 'email' },
		};
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}

		const email = ctx.request.body.email;
		const captcha = util.new_captcha();
		await app.redis.set(email, captcha, 'EX', 3 * 60);
		const mailOptions = {
			from: process.env.EMAIL,
			to: email,
			subject: '【十八里铺】注册验证',
			html: '您的验证码为 ' + captcha + ' ，请在3分钟内使用',
		};
		await app.email.sendMail(mailOptions);

		ctx.status = 200;
		ctx.body = util.make_res('验证码发送成功', 0, {});
		return;
	}

	// 修改密码
	async change_pwd() {
		const { ctx, app } = this;
		const rules = {
			email: { type: 'email' },
			code: { type: 'string' },
			new_pwd: { type: 'string' },
		};
		try {
			ctx.validate(rules);
		} catch (e) {
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}
		const captcha = await app.redis.get(ctx.request.body.email);
		if (captcha !== ctx.request.body.code) {
			ctx.status = 400;
			ctx.body = util.make_res('验证码错误', 400, {});
			return;
		}
		const res = await ctx.service.user.change_pwd(ctx.request.body.email, ctx.request.body.new_pwd);
		if (res) {
			ctx.status = 200;
			ctx.body = util.make_res('修改成功', 0, {});
		} else {
			ctx.status = 400;
			ctx.body = util.make_res('该邮箱不存在', 400, {});
		}
		return;
	}

	// 完善个人信息
	async update_info() {
		const { ctx } = this;
		const rules = {
			username: { type: 'string', max: 30, require: false },
			avatar: { type: 'url', required: false },
			birthday: { type: 'date', required: false },
			sex: { type: 'bool', require: false },
			phone: { type: 'string', max: 15, required: false },
		}
		try {
			ctx.validate(rules);
		} catch (e) {
			console.log(e);
			ctx.status = 400;
			ctx.body = util.make_res('参数错误', 400, {});
			return;
		}

		ctx.current_user.update(ctx.request.body);
		ctx.status = 200;
		ctx.body = util.make_res('修改成功', 0, {});
		return;
	}

	// 获取用户信息
	async get_info() {
		const { ctx } = this;
		const user = ctx.current_user;
		const data = {
			id: user.id,
			avatar: user.avatar,
			username: user.username,
			email: user.email,
			birthday: user.birthday,
			sex: user.sex,
			phone: user.phone,
			identity: user.identity,
		};
		ctx.status = 200;
		ctx.body = util.make_res('', 0, { data });
		return;
	}

	// 登录状态查询
	async login_check() {
		this.ctx.status = 200;
		this.ctx.body = util.make_res('已登录', 0, {});
		return;
	}
}

module.exports = UserController;