import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { RidersEntity } from './entities/riders.entity';
import { RidersRepository } from './riders.repository';
import { CreateRidersDto } from './dto/create-riders.dto';
import { RidersResponseDto } from './dto/riders-response.dto';
import { UpdateRidersDto } from './dto/update-riders.dto';
import { IRedisUserModel } from '../base/base.interface';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

@Injectable()
export class RidersService extends BaseService<
  RidersEntity,
  CreateRidersDto,
  UpdateRidersDto,
  RidersResponseDto
> {
  constructor(
    private ridersRepository: RidersRepository,
    private dataSource: DataSource,
  ) {
    super(ridersRepository);
  }

  public async CreateRiders(
    body: CreateRidersDto,
    current_user: IRedisUserModel,
  ): Promise<RidersResponseDto> {
    const riders = { user_id: current_user.user_id, ...body };
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const mapped_riders = plainToInstance(RidersEntity, riders);
      const riders_details = await query_runner.manager.save(mapped_riders);

      await query_runner.commitTransaction();

      return riders_details;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw new InternalServerErrorException({ message: error });
    } finally {
      await query_runner.release();
    }
  }
}
