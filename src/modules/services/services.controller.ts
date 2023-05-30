import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { ServicesService } from './services.service';
import { ServicesEntity } from './entities/services.entity';
import { CreateServicesDto } from './dto/create-services.dto';
import { ServicesResponseDto } from './dto/services-response.dto';
import { UpdateServicesDto } from './dto/update-services.dto';
import { plainToInstance } from 'class-transformer';
import { iResponseJson } from '../base/base.interface';
import { ConsumersResponseDto } from '../consumers/dto/consumers-response.dto';
import { CreateProductsDto } from '../products/dto/create-products.dto';
import { Request } from 'express';

@ApiTags('Services')
@Controller({
  path: 'services',
  version: '1',
})
export class ServicesController extends ControllerFactory(
  ServicesEntity,
  CreateServicesDto,
  UpdateServicesDto,
  ServicesResponseDto,
) {
  constructor(private servicesService: ServicesService) {
    super(servicesService);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async Create(
    @Body() body: CreateServicesDto,
    @Req() req: Request,
  ): Promise<iResponseJson> {
    try {
      const response = await this.servicesService.Create(body, req);
      return response;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('get/:business_id')
  async GetServicesByBusiness(
    @Param('business_id') business_id: number,
  ): Promise<iResponseJson> {
    try {
      const services = await this.servicesService.GetServicesByBusiness(
        business_id,
      );
      const resp = this.OKResponse(services);
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
