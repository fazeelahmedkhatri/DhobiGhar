import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { BusinessService } from './business.service';
import { BusinessEntity } from './entities/business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessResponseDto } from './dto/business-response.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Public } from 'src/decorators/public.decorator';
import { iResponseJson } from '../base/base.interface';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';

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

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  // @UsePipes(createPipe)
  async Create(
    @Body() body: CreateBusinessDto,
    @Req() req: Request,
  ): Promise<iResponseJson> {
    try {
      const response = await this.businessService.Create({ ...body }, req);
      const mapped_resp = plainToInstance(BusinessResponseDto, response);
      const resp = this.CreatedResponse(mapped_resp);
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
