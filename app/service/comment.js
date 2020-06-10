'use strict';

const Service = require('egg').Service;

class CommentService extends Service {
	async create(order_id, user_id, data) {
		const order = await this.ctx.model.Sku.findByFk(order_id);
		await this.ctx.model.Comment.create({
			user_id: user_id,
			sku_id: order.sku_id,
			order_id: data.order_id,
			star: data.star,
			comment: data.comment
		});
		return { res: true, msg: '' };
	}

	async index(spu_id) {
		const skus = await this.ctx.model.Sku.findAll({
			attributes: [['id', 'sku_id']],
			where: { spu_id: spu_id },
			include: [
				{
					model: this.ctx.model.Comment,
					as: 'comments',
					attributes: ['id', 'star', 'comment', 'create_at'],
					include: [
						{
							model: this.ctx.model.User,
							as: 'user',
							attribute:['id','username','avater']
						}
					]
				}
			]
		}).then(res => {
			if (res == []) return [];
			res = res.toJSON();
			for (let sku of res)
				for (let comment of sku.comments)
					comment.user.avater = JSON.parse(comment.user.avater);
			return res;
		});
		return data;
	}
}

module.exports = CommentService;