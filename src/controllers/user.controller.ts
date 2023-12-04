import {
	Body,
	Controller,
	Get,
	Post,
	UploadedFile,
	UseInterceptors,
	UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe, createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from 'src/configs/multer-config';
import { UserService } from 'src/services/user.service';

const SignInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(2),
});

const SignUpSchema = z.object({
	email: z.string().email(),
	name: z.string().min(2),
	password: z.string().min(2),
});

class SignInDTO extends createZodDto(SignInSchema) {}
class SignUpDTO extends createZodDto(SignUpSchema) {}

@Controller()
export class UserController {
	constructor(private userService: UserService) {}

	@UsePipes(ZodValidationPipe)
	@Post('signin')
	login(@Body() userData: SignInDTO) {
		const { email, password } = userData;
		return this.userService.login({ email, hash: password });
	}

	@UsePipes(ZodValidationPipe)
	@Post('signup')
	createUser(@Body() userData: SignUpDTO) {
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
