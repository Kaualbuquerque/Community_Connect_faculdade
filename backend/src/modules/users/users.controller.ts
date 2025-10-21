import { Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
    constructor(private readonly userService: UserService) { }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.userService.findOne(id);
    }

    @Put(":id")
    update(@Param("id") id: number, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @Delete(":id")
    remove(@Param("id") id: number) {
        return this.userService.remove(id);
    }
}