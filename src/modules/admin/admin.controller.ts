import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ResponseController } from '../base/response.controller';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { IRedisUserModel, iResponseJson } from '../base/base.interface';
import { RidersService } from '../riders/riders.service';
import { CreateRidersDto } from '../riders/dto/create-riders.dto';
import { plainToInstance } from 'class-transformer';
import { RidersResponseDto } from '../riders/dto/riders-response.dto';
import { BusinessService } from '../business/business.service';

@ApiTags('Admin')
@Controller({
  path: 'admin',
  version: '1',
})
export class AdminController extends ResponseController {
  constructor(
    private adminService: AdminService,
    private ridersService: RidersService,
    private businessService: BusinessService,
  ) {
    super();
  }

  @HttpCode(HttpStatus.OK)
  @Get('riders')
  async GetRiders(): Promise<iResponseJson> {
    try {
      const riders = await this.ridersService.Find();
      const resp = this.OKResponse(riders);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete('riders/:rider_id')
  async DeleteRiders(
    @Param('rider_id') rider_id: number,
  ): Promise<iResponseJson> {
    try {
      const riders = await this.ridersService.Delete(rider_id);
      const resp = this.OKResponse(riders);
      return resp;
    } catch (error) {
      throw error;
    }
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('rider')
  async Create(
    @Body() body: CreateRidersDto,
    @Req() req: Request,
    @CurrentUser({ required: true })
    current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    try {
      const response = await this.ridersService.CreateRiders(
        { ...body },
        current_user,
      );
      const mapped_response = plainToInstance(RidersResponseDto, response);
      const resp = this.CreatedResponse(mapped_response);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('rider/not-approved')
  async GetNotApproveRiders(): Promise<iResponseJson> {
    try {
      const riders = await this.adminService.NotApprovedRiders();
      const resp = this.OKResponse(riders);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('vendor')
  async GetBusinesses(): Promise<iResponseJson> {
    try {
      const vendors = await this.businessService.Find();
      const resp = this.OKResponse(vendors);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('vendor/not-approved')
  async GetNotApproveVendors(): Promise<iResponseJson> {
    try {
      const vendors = await this.adminService.NotApprovedBusinesses();
      const resp = this.OKResponse(vendors);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete('vendor/:vendor_id')
  async DeleteVendors(
    @Param('vendor_id') vendor_id: number,
  ): Promise<iResponseJson> {
    try {
      const vendors = await this.ridersService.Delete(vendor_id);
      const resp = this.OKResponse(vendors);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Put('/rider/approve/:rider_id')
  async ApproveRider(
    @Param('rider_id') rider_id: number,
  ): Promise<iResponseJson> {
    try {
      const rider = await this.adminService.ApproveRider(rider_id);
      const resp = this.OKResponse(rider);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Put('/vendor/approve/:vendor_id')
  async ApproveBusiness(
    @Param('vendor_id') vendor_id: number,
  ): Promise<iResponseJson> {
    try {
      const vendor = await this.adminService.ApproveBusinesss(vendor_id);
      const resp = this.OKResponse(vendor);
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
