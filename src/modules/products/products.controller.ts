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
import { ProductsService } from './products.service';
import { ProductsEntity } from './entities/products.entity';
import { CreateProductsDto } from './dto/create-products.dto';
import { ProductsResponseDto } from './dto/products-response.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { iResponseJson } from '../base/base.interface';
import { Request } from 'express';
@ApiTags('Products')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController extends ControllerFactory(
  ProductsEntity,
  CreateProductsDto,
  UpdateProductsDto,
  ProductsResponseDto,
) {
  constructor(private productsService: ProductsService) {
    super(productsService);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async Create(
    @Body() body: CreateProductsDto,
    @Req() req: Request,
  ): Promise<iResponseJson> {
    try {
      const response = await this.productsService.Create(body, req);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
