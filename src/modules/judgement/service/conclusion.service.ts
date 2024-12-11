import { Inject, Injectable } from '@nestjs/common';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { FindOptionsRelations } from 'typeorm';

import { OperationsDtos } from '../../../common/operations/decorators/operations.dtos.decorator';
import { OperationsEntity } from '../../../common/operations/decorators/operations.entity.decorator';
import { OperationsService } from '../../../common/operations/service/operations.service';
import { UserInterface } from '../../auth/service/auth.service';
import { RoleEnum } from '../../users/enums/users.enums';
import { EmployeeService } from '../../users/service/employee.service';
import { UsersService } from '../../users/service/users.service';
import { CreateConclusionDto } from '../dto/create-conclusion.dto';
import { UpdateConclusionDto } from '../dto/update-conclusion.dto';
import { Conclusion } from '../entities/conclusion.entity';

@Injectable()
@OperationsEntity({ entity: Conclusion })
@OperationsDtos({ create: CreateConclusionDto, update: UpdateConclusionDto })
export class ConclusionService extends OperationsService<
  Conclusion,
  CreateConclusionDto
> {
  @Inject(EmployeeService)
  private readonly employeeService: EmployeeService;

  @Inject(UsersService)
  private readonly usersService: UsersService;

  sortableColumns = [
    'actionResult',
    'position',
    'status',
    'region',
  ] as Column<Conclusion>[];

  relations = [
    'approvals',
    'called',
    'incident',
    'defender',
  ] as FindOptionsRelations<Conclusion>;

  async findAllFiltered(
    query: PaginateQuery,
    user: UserInterface,
  ): Promise<Paginated<Conclusion>> {
    const usr = await this.usersService.findOne(user.sub);

    if (usr.role === RoleEnum.Employee) {
      const employee = await this.employeeService.getEmployeeFromUserId(
        user.sub,
      );
      return this.pagination.paginate(query, this.repository, {
        sortableColumns: this.sortableColumns,
        where: { createdBy: { id: employee.id } },
        relations: ['called', 'incident', 'approvals', 'defender'],
      });
    }
  }
}
