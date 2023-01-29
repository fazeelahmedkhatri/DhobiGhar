import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { ConsumersEntity } from './entities/consumers.entity';
import { ConsumersRepository } from './consumers.repository';
import { CreateConsumersDto } from './dto/create-consumers.dto';
import { ConsumersResponseDto } from './dto/consumers-response.dto';
import { UpdateConsumersDto } from './dto/update-consumers.dto';
import { DataSource } from 'typeorm';
import { IRedisUserModel } from '../base/base.interface';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ConsumersService extends BaseService<
  ConsumersEntity,
  CreateConsumersDto,
  UpdateConsumersDto,
  ConsumersResponseDto
> {
  constructor(
    private consumersRepository: ConsumersRepository,
    private dataSource: DataSource,
  ) {
    super(consumersRepository);
  }

  public async CreateConsumers(
    body: CreateConsumersDto,
    current_user: IRedisUserModel,
  ): Promise<ConsumersResponseDto> {
    const consumers = { user_id: current_user.user_id, ...body };
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const mapped_consumers = plainToInstance(ConsumersEntity, consumers);
      const consumers_details = await query_runner.manager.save(
        mapped_consumers,
      );

      await query_runner.commitTransaction();

      return consumers_details;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw new InternalServerErrorException({ message: error });
    } finally {
      await query_runner.release();
    }
  }
}
