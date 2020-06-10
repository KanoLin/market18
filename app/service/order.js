'use strict';

const Service = require('egg').Service;

class OrderService extends Service {
	async create(data) {
		const sku = await this.ctx.model.Sku.findByFk(data.id);
		if (sku.stock == 0) return { res: false, msg: '该商品已售罄！' };
		data.price = sku.price * data.num;
		await this.ctx.model.Order.create({
			sku_id: data.id,
			address_id: data.address_id,
			user_id:this.ctx.current_user.user_id,
			num: data.num,
			price: data.price,
			anonymous: data.anonymous
		});
		return { res: true, msg: '' };
	}

	async create_from_cart(data) {
		let sold = [];
		for (let id of data.cart_id_list) {
			const c = await this.ctx.model.Mycart.findByFk(id);
			const sku = await this.ctx.model.Sku.findByFk(c.sku_id);
			if (sku.stock == 0) sold.push(sku.name);
			await this.ctx.model.Order.create({
				sku_id: sku.id,
				address_id: data.address_id,
				user_id: this.ctx.current_user.user_id,
				num: c.num,
				price: sku.price * c.num,
				anonymous: data.anonymous
			});
			await c.destroy();
		}
		if (sold.length != 0) return { res: false, msg: '部分商品售罄！', data: sold };
		return { res: true, msg: '', data: {} };
	}

	async status_update(order_id, data) {
		const order = await this.ctx.model.Order.findByFk(order_id);
		if (data.status < order.status) return { res: false, msg: '订单状态不可逆！' };
		if (data.status > 5 || data.status < 0) return { res: false, msg: '未知订单状态！' };
		await this.ctx.model.OrderStatus.create({ order_id: order_id, status: data.status, description: data.description });
		return { res: true, msg: '' };
	}

	async detail(order_id) {
		const order = await this.ctx.model.Order.findOne({
			where: { id: order_id },
			attribute: ['id', 'num', 'price', 'anonymous', 'status', 'create_at'],
			include: [
				{
					model: this.ctx.model.User,
					as: 'user',
					attribute: ['id', 'username']
				},
				{
					model: this.ctx.model.Address,
					as: 'address',
					attribute: { exclude: ['user_id'] }
				},
				{
					model: this.ctx.model.Sku,
					as: 'sku',
					attribute: ['id','name','price','sku_pic']
				},
				{
					model: this.ctx.model.OrderStatus,
					as: 'statuses',
				},
				{
					model: this.ctx.model.Comment,
					as: 'comment',
					attribute:['id','star','comment','create_at']
				}
			]
		});
		if (!order) return { res: false, msg: '订单不存在！', data: {} };
		if (order.anonymous) delete order.user;
		return { res: true, msg: '', data: {} };
	}
	
	async index_user(user_id) {
		let attrs = ['id', 'num', 'price', 'anonymous', 'status', 'create_at'];
		let include = [
			{ model: this.ctx.model.User, as: 'user', attribute: ['id', 'username'] },
			{ model: this.ctx.model.Sku, as: 'sku', attribute: ['id', 'name'] },
		];
		let where = { user_id: user_id };
		let option = { attributes: attrs, where: where, include: include }
		const data = await this.ctx.model.order.findAll(option);
		return data;
	}

	async index(spu_id, sku_id) {
		let data;
		let attrs = ['id', 'num', 'price', 'anonymous', 'status', 'create_at'];
		let include = [
			{ model: this.ctx.model.User, as: 'user', attribute: ['id', 'username'] },
			{ model: this.ctx.model.Sku, as: 'sku', attribute: ['id', 'name'] },
		];
		let option = { attributes: attrs, include: include };

		if (!spu_id && sku_id) {
			option.where = { sku_id: sku_id };
			data = await this.ctx.model.order.findAll(option);
		} else if (spu_id) {
			const skus = await this.ctx.model.sku.findAll({ attribute: ['id'], where: { spu_id: spu_id } });
			let sku_ids = [];
			for (let sku of skus) sku_ids.push(sku.id);
			option.where = { [this.ctx.sequelize.Op.in]: sku_ids };
			data = await this.ctx.model.order.findAll(option);
		}
		else data = await this.ctx.model.order.findAll(option);
		return data;
	}

	

}

module.exports = OrderService;