'use strict';

const Controller = require('egg').Controller;
const util = require('../util');
const path = require('path')
const sendToWormhole = require('stream-wormhole');
const md5 = require('md5');
const moment = require('moment');
const fs = require('fs');
const pump = require('pump');

class AttachmentController extends Controller {
	async upload() {
		const { ctx } = this;
		let urls = Array();
		let stream;
		const pic_dir = process.env.PIC_DIR;
		if (!fs.existsSync(pic_dir)) fs.mkdirSync(pic_dir);
        const parts = ctx.multipart();
        while ((stream = await parts()) != null) {
            if (!stream.filename) continue;
            const filename_orign = stream.filename;
			const timestamp = moment().format('YYMMDD_hhmmss');
			const filename = timestamp+'_'+md5(filename_orign)+path.extname(filename_orign).toLocaleLowerCase();
			
			let target = path.join(pic_dir, filename);
			try {
				let write_stream = fs.createWriteStream(target);
				await pump(stream, write_stream);
			}
			catch (e) {
				await sendToWormhole(stream);
				ctx.status = 400;
				ctx.body = util.make_res('图片上传失败！', 400, {});
				return;
			}
			
			urls.push(process.env.PIC_URL + '/' + filename);
        }
		ctx.status = 200;
		ctx.body = util.make_res('', 0, { urls: urls });
		return;
	}
  
}

module.exports = AttachmentController;