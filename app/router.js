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
	router.post('/user/change_pwd', controller.user.change_pwd); // 修改密码

	// 地址
	router.post('/address/add', middleware.auth, controller.address.create); // 新增地址
	router.put('/address/modify/:address_id', middleware.auth, controller.address.change); // 修改地址
	router.get('/address', middleware.auth, controller.address.index); // 获取地址列表
	router.delete('/address/delete/:address_id', middleware.auth, controller.address.delete); // 删除地址

	// 分类与属性
	router.post('/category', middleware.admin, controller.category.create); //创建分类
	router.get('/category', controller.category.index); // 获取分类
	router.post('/attribute', middleware.admin, controller.attribute.create); // 添加属性
	router.get('/category/:category_id/attributes', controller.attribute.index); // 获取属性
	router.post('/attribute/value', middleware.admin, controller.attributeValue.create); // 添加属性值
	router.get('/attribute/:attribute_id', controller.attributeValue.index); // 获取属性值

	// 商品
	router.post('/item', middleware.admin, controller.spu.create); //新增商品
	router.get('/item/:spu_id', controller.spu.detail); //商品详情
	router.get('/search', controller.spu.search); //搜索商品
	router.put('/item/:id/off_shelf', middleware.admin, controller.spu.off_shelf);  // 下架商品
	router.put('/item/:id/put_shelf', middleware.admin, controller.spu.put_shelf);  // 重新上架商品

	// 购物车
	router.post('/cart', middleware.auth, controller.mycart.create);  // 添加至购物车
	router.get('/cart', middleware.auth, controller.mycart.index);  // 获取购物车列表
	router.delete('/cart/:id', middleware.auth, controller.mycart.delete);  // 删除购物车
	

	// 订单
	router.post('/order', middleware.auth, controller.order.create);  // 下单
	router.post('/order/from_cart', middleware.auth, controller.order.create_from_cart);  // 从购物车下单
	router.get('/order/all', middleware.admin, controller.order.index);  // 管理端获取全部订单
	router.get('/order/:id', middleware.auth, controller.order.detail);  // 订单详情
	router.get('/order', middleware.auth, controller.order.index_user);  // 用户端查看自己订单
	router.post('/order/:id/status', middleware.admin, controller.order.status_update);  // 添加订单状态
	router.put('/order/:id/receipt', middleware.auth, controller.order.receipt);  // 用户端收货

	// 评论
	router.post('/order/:id/comment', middleware.auth, controller.comment.create);  // 对订单添加评论
	router.get('/item/:spu_id/comment', controller.comment.index);  // 获取商品评论

	// 附件
	router.post('/attachment/upload', controller.attachment.upload); // 上传图片
  
};
