import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getRoleByEmail(email: string): Promise<string | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        return user?.role || null;
    }
}
