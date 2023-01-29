import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { OrdersEntity } from './entities/orders.entity';
import { OrdersRepository } from './orders.repository';
import { CreateOrdersDto } from './dto/create-orders.dto';
import { OrdersResponseDto } from './dto/orders-response.dto';
import { UpdateOrdersDto } from './dto/update-orders.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { IRedisUserModel } from '../base/base.interface';
import { DataSource, In } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ConsumersEntity } from '../consumers/entities/consumers.entity';
import { BusinessServiceProductsEntity } from '../products/entities/business.service.products.entity';
import { CartEntity } from './entities/cart.entity';
import { CartBusinessServiceProductsEntity } from './entities/cart.business.service.product.entity';
import duplicationProneBatchInsertion from 'src/helpers/duplicationProneBatchInsertion';
import { Cart_Status_Enum } from 'src/common/enum';
import { MESSAGES } from 'src/common/messages';

@Injectable()
export class OrdersService extends BaseService<
  OrdersEntity,
  CreateOrdersDto,
  UpdateOrdersDto,
  OrdersResponseDto
> {
  constructor(
    private ordersRepository: OrdersRepository,
    private dataSource: DataSource,
  ) {
    super(ordersRepository);
  }
  public async CreateCart(
    body: CreateCartDto,
    current_user: IRedisUserModel,
  ): Promise<any> {
    const { business_service_products, quantity } = body;
    const bsp_temp = business_service_products;
    if (business_service_products.length != quantity.length) {
      throw new BadRequestException(
        'The length of business service products and quantity should be same',
      );
    }
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const consumer = await query_runner.manager.findOneBy(ConsumersEntity, {
        user_id: current_user.user_id,
      });
      const cart_details = await query_runner.manager.findOneBy(CartEntity, {
        consumer_id: consumer.id,
      });
      if (cart_details && cart_details.cart_status == Cart_Status_Enum.OPEN) {
        let business_service_products_prices = await query_runner.manager.find(
          BusinessServiceProductsEntity,
          {
            select: ['price'],
            where: { id: In(business_service_products) },
          },
        );
        const prices: number[] = (business_service_products_prices =
          business_service_products_prices.map(
            (business_service_products: any) => business_service_products.price,
          ));
        const total_amount = prices.reduce(function (r, a, i) {
          return r + a * quantity[i];
        }, 0);

        const mapped_cart = plainToInstance(CartEntity, {
          total_amount,
          consumer_id: consumer.id,
        });
        const cart = await query_runner.manager.save(CartEntity, {
          ...cart_details,
          ...mapped_cart,
        });
        const cart_business_service_products =
          await duplicationProneBatchInsertion(
            query_runner.manager,
            bsp_temp.map((bsp: number, i) => {
              const cart_business_service_products =
                new CartBusinessServiceProductsEntity();
              cart_business_service_products.business_service_product_id = bsp;
              cart_business_service_products.cart_id = cart.id;
              cart_business_service_products.quantity = quantity[i];
              return cart_business_service_products;
            }),
            CartBusinessServiceProductsEntity,
            ['cart_id', 'business_service_product_id'],
          );

        await query_runner.commitTransaction();

        return cart_business_service_products;
      }
      let business_service_products_prices = await query_runner.manager.find(
        BusinessServiceProductsEntity,
        {
          select: ['price'],
          where: { id: In(business_service_products) },
        },
      );
      const prices: number[] = (business_service_products_prices =
        business_service_products_prices.map(
          (business_service_products: any) => business_service_products.price,
        ));
      const total_amount = prices.reduce(function (r, a, i) {
        return r + a * quantity[i];
      }, 0);

      const mapped_cart = plainToInstance(CartEntity, {
        total_amount,
        consumer_id: consumer.id,
      });
      const cart = await query_runner.manager.save(mapped_cart);
      const cart_business_service_products =
        await duplicationProneBatchInsertion(
          query_runner.manager,
          bsp_temp.map((bsp: number, i) => {
            const cart_business_service_products =
              new CartBusinessServiceProductsEntity();
            cart_business_service_products.business_service_product_id = bsp;
            cart_business_service_products.cart_id = cart.id;
            cart_business_service_products.quantity = quantity[i];
            return cart_business_service_products;
          }),
          CartBusinessServiceProductsEntity,
          ['cart_id', 'business_service_product_id'],
        );

      await query_runner.commitTransaction();

      return total_amount;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw new InternalServerErrorException({ message: error });
    } finally {
      await query_runner.release();
    }
  }

  async GetCartByUser(user_id): Promise<any> {
    try {
      const query_runner = this.dataSource.createQueryRunner();
      const consumer = await query_runner.manager.findOneBy(ConsumersEntity, {
        user_id,
      });
      if (!consumer) {
        throw new NotFoundException(MESSAGES.USER.ERROR.USER_DOES_NOT_EXIST);
      }
      const cart = await query_runner.manager.findOneBy(CartEntity, {
        consumer_id: consumer.id,
      });
      if (!cart) {
        throw new NotFoundException(MESSAGES.CART.ERROR.CART_DOES_NOT_EXIST);
      }
      const cart_details = await this.ordersRepository.GetCartByConsumerId(
        consumer.id,
      );

      return cart_details;
    } catch (error) {
      throw error;
    }
  }
}
