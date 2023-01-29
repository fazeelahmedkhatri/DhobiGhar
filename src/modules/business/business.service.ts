import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { BusinessEntity } from './entities/business.entity';
import { BusinessRepository } from './business.repository';
import { CreateBusinessDto } from './dto/create-business.dto';
import { BusinessResponseDto } from './dto/business-response.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { IRedisUserModel } from '../base/base.interface';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';
import { AddProductAndServicesDto } from './dto/add-products-and-services.dto';
import { MESSAGES } from 'src/common/messages';
import { BusinessServiceProductsEntity } from '../products/entities/business.service.products.entity';
import duplicationProneBatchInsertion from 'src/helpers/duplicationProneBatchInsertion';

@Injectable()
export class BusinessService extends BaseService<
  BusinessEntity,
  CreateBusinessDto,
  UpdateBusinessDto,
  BusinessResponseDto
> {
  constructor(
    private businessRepository: BusinessRepository,
    private dataSource: DataSource,
  ) {
    super(businessRepository);
  }
  public async CreateBusiness(
    body: CreateBusinessDto,
    current_user: IRedisUserModel,
  ): Promise<BusinessResponseDto> {
    const business = { user_id: current_user.user_id, ...body };
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const mapped_business = plainToInstance(BusinessEntity, business);
      const business_details = await query_runner.manager.save(mapped_business);

      await query_runner.commitTransaction();

      return business_details;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw new InternalServerErrorException({ message: error });
    } finally {
      await query_runner.release();
    }
  }

  public async AddProductAndServices(
    body: AddProductAndServicesDto,
    current_user: IRedisUserModel,
  ): Promise<any> {
    const { products, service_id, price } = body;
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const business = await query_runner.manager.findOneBy(BusinessEntity, {
        user_id: current_user.user_id,
      });
      if (!business) {
        throw new NotFoundException({
          message: MESSAGES.BUSINESS.ERROR.BUSINESS_DOES_NOT_EXIST,
        });
      }
      if (products.length != price.length) {
        throw new BadRequestException(
          MESSAGES.PRODUCTS.ERROR.PRODUCT_LENGTH_PRICE_LENGTH_ERROR,
        );
      }

      const business_service_products = await duplicationProneBatchInsertion(
        query_runner.manager,
        products.map((product: number, i) => {
          const business_service_product = new BusinessServiceProductsEntity();
          business_service_product.product_id = product;
          business_service_product.service_id = service_id;
          business_service_product.business_id = business.id;
          business_service_product.price = price[i];
          return business_service_product;
        }),
        BusinessServiceProductsEntity,
        ['business_id', 'service_id', 'product_id'],
      );

      const mapped_business_service_products = await query_runner.manager.save(
        business_service_products,
      );
      await query_runner.commitTransaction();

      return mapped_business_service_products;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw new InternalServerErrorException({ message: error });
    } finally {
      await query_runner.release();
    }
  }
  async GetProductAndServices(user_id): Promise<any> {
    try {
      const business = await this.businessRepository.findOneBy({ user_id });
      if (!business) {
        throw new NotFoundException({
          message: MESSAGES.BUSINESS.ERROR.BUSINESS_DOES_NOT_EXIST,
        });
      }
      const service_products =
        await this.businessRepository.GetServiceProductsByBusinessId(
          business.id,
        );
      return service_products;
    } catch (error) {
      throw error;
    }
  }
  async GetBusiness(business_id): Promise<any> {
    try {
      const business = await this.businessRepository.findOneBy({
        id: business_id,
      });
      if (!business) {
        throw new NotFoundException({
          message: MESSAGES.BUSINESS.ERROR.BUSINESS_DOES_NOT_EXIST,
        });
      }
      const service_products =
        await this.businessRepository.GetServiceProductsByBusinessId(
          business.id,
        );
      const mapped_response = {
        ...business,
        service_products,
      };
      return mapped_response;
    } catch (error) {
      throw error;
    }
  }
}
