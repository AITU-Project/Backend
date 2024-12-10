import { 
  Injectable, 
  CanActivate, 
  ExecutionContext, 
  ForbiddenException 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { RolesService } from '../service/roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly rolesService: RolesService, // Добавляем RolesService для работы с БД
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!requiredRoles) {
            return true; // Если роли не указаны, доступ разрешается
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new ForbiddenException('Access Denied');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            const email = payload.email; // Предполагаем, что email хранится в токене

            if (!email) {
                throw new ForbiddenException('Invalid token');
            }

            const role = await this.rolesService.getRoleByEmail(email); // Получаем роль из базы

            if (!role || !requiredRoles.includes(role)) {
                throw new ForbiddenException('Access Denied');
            }

            request['user'] = { email, role }; // Добавляем пользователя в запрос
            return true;
        } catch (e) {
            throw new ForbiddenException('Access Denied');
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
