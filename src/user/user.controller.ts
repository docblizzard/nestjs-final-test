import { Body, Controller, Delete, Get, HttpCode, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Get()
    async getUser(@Body('email') email: string): Promise<User> {
      console.log(email)
      return await this.userService.getUser(email);
    }

    @Get('all')
    async getAllUsers(): Promise<User[]> {
        return await this.userService.getAllUsers();
    }
    
    @HttpCode(201)
    @Post()
    async createUser(@Body('email') email: string): Promise<User> {
      return await this.userService.addUser(email);
    }

    @Delete('delete')
    async deleteUsers(){
        return await this.userService.resetData()
    }
}
