'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const { router, controller, middleware } = app;
	router.get('/', controller.home.index);

	// 用户
	router.post('/user/register', controller.user.register); //注册
	router.post('/user/login', controller.user.login); // 登录
	router.post('/user/send_captcha', controller.user.send_captcha); // 发送验证码
	router.get('/user/profile', middleware.auth, controller.user.get_info); // 获取个人信息
	router.put('/user/submit_profile', middleware.auth, controller.user.update_info); // 修改个人信息
	router.get('/user/login_check', middleware.auth, controller.user.login_check); // 登录状态查询

	
  
};
