import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumersController } from'./consumers.controller';
import { ConsumersService } from'./consumers.service';
import { ConsumersRepository } from'./consumers.repository';
import { ConsumersEntity } from './entities/consumers.entity'

@Module({
	imports: [TypeOrmModule.forFeature([ConsumersEntity])],
	providers: [ConsumersService, ConsumersRepository],
	controllers: [ConsumersController],
	exports: [ConsumersService]
})

export class ConsumersModule {}