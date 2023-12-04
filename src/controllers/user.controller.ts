import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from 'src/configs/multer-config';
import { UserService } from 'src/services/user.service';

@Controller()
export class UserController {
	constructor(private userService: UserService) {}

	@Post('signin')
	login(@Body() userData: { email: string; password: string }) {
		const { email, password } = userData;

		return this.userService.login({ email, hash: password });
	}

	@Post('signup')
	createUser(
		@Body() userData: { email: string; name: string; password: string },
	) {
		const { email, name, password } = userData;
		try {
			return this.userService.createUser({
				email,
				hash: password,
				name,
			});
		} catch (error) {
			return error;
		}
	}

	@Get('users')
	getUsers() {
		try {
			return this.userService.getUsers();
		} catch (error) {
			return error;
		}
	}

	@Post('user/profile')
	@UseInterceptors(FileInterceptor('image', multerConfig))
	uploadImage(
		@UploadedFile() file: Express.MulterS3.File,
		@Body() user: { userid: string },
	) {
		return this.userService.updateProfilePic(user.userid, file);
	}
}
