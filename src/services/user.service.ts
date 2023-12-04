import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async login(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
		const user = await this.prisma.user.findUnique({
			where: { email: userWhereUniqueInput.email },
		});

		if (!user) {
			throw new HttpException('wrong credentials', 200);
		}

		if (typeof userWhereUniqueInput.hash !== 'string') {
			throw new HttpException('hash has invalid type', 500);
		}

		const isPasswordCorrect = await bcrypt.compare(
			userWhereUniqueInput.hash,
			user.hash,
		);

		if (!isPasswordCorrect) {
			throw new HttpException('wrong credentials', 200);
		}

		return user;
	}

	async createUser(userCreateInput: Prisma.UserCreateInput) {
		const userAlreadyExists = await this.prisma.user.findUnique({
			where: {
				email: userCreateInput.email,
			},
		});

		if (userAlreadyExists) {
			throw new HttpException('user already exists', 200);
		}

		const salt = await bcrypt.genSalt();
		const hashedPass = await bcrypt.hash(userCreateInput.hash, salt);

		return this.prisma.user.create({
			data: {
				email: userCreateInput.email,
				name: userCreateInput.name,
				hash: hashedPass,
			},
		});
	}

	async getUsers() {
		return await this.prisma.user.findMany();
	}

	async updateProfilePic(userid: string, file: Express.MulterS3.File) {
		return await this.prisma.user.update({
			where: {
				id: userid,
			},
			data: {
				profile_url: file.location,
			},
		});
	}
}
