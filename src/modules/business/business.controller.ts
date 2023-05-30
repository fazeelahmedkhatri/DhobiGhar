import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { BusinessService } from './business.service';
import { BusinessEntity } from './entities/business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessResponseDto } from './dto/business-response.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { IRedisUserModel, iResponseJson } from '../base/base.interface';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AddProductAndServicesDto } from './dto/add-products-and-services.dto';

@ApiTags('Business')
@Controller({
  path: 'business',
  version: '1',
})
export class BusinessController extends ControllerFactory(
  BusinessEntity,
  CreateBusinessDto,
  UpdateBusinessDto,
  BusinessResponseDto,
) {
  constructor(private businessService: BusinessService) {
    super(businessService);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async Create(
    @Body() body: CreateBusinessDto,
    @Req() req: Request,
    @CurrentUser({ required: true })
    current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    try {
      const response = await this.businessService.CreateBusiness(
        { ...body },
        current_user,
      );
      const mapped_response = plainToInstance(BusinessResponseDto, response);
      const resp = this.CreatedResponse(mapped_response);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('add/products-and-services')
  async AddProductAndServices(
    @Body() body: AddProductAndServicesDto,
    @Req() req: Request,
    @CurrentUser({ required: true })
    current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    try {
      const response = await this.businessService.AddProductAndServices(
        { ...body },
        current_user,
      );
      const resp = this.CreatedResponse(response);
      return resp;
    } catch (error) {
      throw error;
    }
  }
  @HttpCode(HttpStatus.OK)
  @Get('products-and-services/get/:business_id')
  async GetProductAndServices(
    @Param('business_id') business_id: number,
  ): Promise<iResponseJson> {
    try {
      const products_services =
        await this.businessService.GetProductAndServices(business_id);
      const resp = this.OKResponse(products_services);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('get/:business_id')
  async GetBusiness(
    @Param('business_id') business_id: number,
  ): Promise<iResponseJson> {
    try {
      const business_details = await this.businessService.GetBusiness(
        business_id,
      );
      const resp = this.OKResponse(business_details);
      return resp;
    } catch (error) {
      throw error;
    }
  }
  @HttpCode(HttpStatus.OK)
  @Get('/past-orders')
  async GetConsumerOrders(
    @CurrentUser() current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    try {
      const consumer_orders =
        await this.businessService.GetPastOrdersByBusiness(
          current_user.user_id,
        );
      const resp = this.OKResponse(consumer_orders);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('details/:business_id')
  async GetBusinessById(
    @Param('business_id') business_id: number,
  ): Promise<iResponseJson> {
    try {
      const business_details = await this.businessService.GetBusinessById(
        business_id,
      );
      const resp = this.OKResponse(business_details);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('products')
  async GetBusinessProductsByService(
    @Query('business_id') business_id: number,
    @Query('service_id') service_id: number,
  ): Promise<iResponseJson> {
    try {
      const business_details =
        await this.businessService.GetBusinessProductsByService(
          business_id,
          service_id,
        );
      const resp = this.OKResponse(business_details);
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
