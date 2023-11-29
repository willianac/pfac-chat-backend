/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Prisma } from "@prisma/client"

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput
		})
	}

	async createUser(userCreateInput: Prisma.UserCreateInput) {
		return this.prisma.user.create({
			data: userCreateInput
		})
	}

	async findAll() {
		return this.prisma.user.findMany()
	}
}