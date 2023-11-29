/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from 'src/services/user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.user({ id: id });
  }

	@Post('user')
  createUser(@Body() userData: { email: string; name: string; hash: string }) {
		const { email, name, hash } = userData

		return this.userService.createUser({
			email,
			hash,
			name
		})
	}

	@Get('users')
	getUsers() {
		return this.userService.findAll()
	}
}
