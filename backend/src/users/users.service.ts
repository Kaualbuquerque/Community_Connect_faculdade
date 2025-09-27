import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async create(dto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(dto);
        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: { email: email.toLowerCase() },
            select: ['id', 'password', 'email', 'role',],
        });
        return user ?? null;
    }

    async findById(id: number) {
        return this.userRepository.findOne({
            where: { id },
            select: [
                'id',
                'name',
                'email',
                'role',
                'phone',
                'cep',
                'state',
                'city',
                'number',
            ],
        });
    }

    async update(id: number, dto: UpdateUserDto): Promise<User> {
        await this.userRepository.update(id, dto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`User #${id} not found`);
    }
}