import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
