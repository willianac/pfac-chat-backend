/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from "@nestjs/common";

@Controller("cars")
export class CarController {
  cars = [];

  @Post()
  addCar(@Body() neew: string) {
		this.cars.push(neew);
		return this.cars[0];
	}

	@Get()
	getCars() {
		return this.cars;
	}
}