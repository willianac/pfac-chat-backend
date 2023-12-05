import * as multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const s3Config = new S3Client({
	region: 'sa-east-1',
	credentials: {
		accessKeyId: process.env.S3_KEY,
		secretAccessKey: process.env.S3_SECRET_KEY,
	},
});

const multerConfig = {
	storage: multerS3({
		s3: s3Config,
		bucket: 'pfac-chat',
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key(req, file, callback) {
			const extension = path.parse(file.originalname).ext;
			const fileName = Date.now().toString();

			callback(null, fileName + extension);
		},
	}),
};

export default multerConfig;
