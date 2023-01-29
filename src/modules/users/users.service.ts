/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/helpers/EmailHelper';
import { DataSource } from 'typeorm';
import { BaseService } from '../base/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { plainToInstance } from 'class-transformer';
import { Hashpassword } from 'src/helpers/UtilHelper';
import { UserRolesEntity } from '../user_role/entities/user.role.entity';
import { RoleRepository } from '../roles/role.repository';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { appEnv } from 'src/helpers/EnvHelper';
import { CompleteProfileDto } from './dto/complete.profile.dto';
import { IRedisUserModel } from '../base/base.interface';
import { KEY_EXTRACTOR } from 'src/utils/key.extractor.from.error.detail';
import { MESSAGES } from 'src/common/messages';
const {
  USER: {
    ERROR: { USER_DOES_NOT_EXIST },
  },
} = MESSAGES;

@Injectable()
export class UserService extends BaseService<
  UserEntity,
  CreateUserDto,
  UpdateUserDto,
  UserResponse
> {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
    private dataSource: DataSource,
    private configService: ConfigService,
    private roleRepository: RoleRepository,
    private authService: AuthService,
  ) {
    super(userRepository);
  }
  public async Create(
    body: CreateUserDto,
    req: Request,
  ): Promise<UserResponse> {
    let user_details: UserEntity;
    const { role_id, ...user } = body;
    user.password = await Hashpassword(user.password);
    const map_user = await plainToInstance(UserEntity, user);

    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();

    try {
      user_details = await query_runner.manager.save(map_user);
      const { id } = user_details;
      const mapped_user_roles = await plainToInstance(UserRolesEntity, {
        user_id: id,
        role_id,
      });
      await query_runner.manager.save(mapped_user_roles);

      const user_role = await this.roleRepository.find({
        select: { name: true },
        where: { id: role_id },
      });
      const token = this.authService.CreateFPToken({
        id: user_details.id,
      });
      const replacements = {
        FullName: `${body.email}`,
        ActivationLink: `${this.configService.get('URL_ORIGIN')}://${req.get(
          'host',
        )}/auth/reset/password/${token}`,
      };

      const mail_options = {
        from: appEnv('SMTP_EMAIL'),
        to: body.email,
        subject: 'Verify Account',
      };

      await this.mailService.SendMail(
        'welcome.html',
        replacements,
        mail_options,
      );
      const resp: any = await plainToInstance(UserResponse, {
        ...user_details,
        user_role,
      });
      await query_runner.commitTransaction();

      return resp;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw new InternalServerErrorException({ message: error });
    } finally {
      await query_runner.release();
    }
  }

  async CompleteProfileStepOne(
    body: CompleteProfileDto,
    current_user?: IRedisUserModel,
  ): Promise<any> {
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const user = await this.userRepository.findOneBy({
        id: current_user.user_id,
      });

      if (!user) {
        throw new BadRequestException(USER_DOES_NOT_EXIST);
      }

      if (user.is_profile_completed == false) {
        user.is_profile_completed = true;
      }
      const updated_body = {
        is_profile_completed: user.is_profile_completed,
        ...body,
      };
      const mapped_user = await plainToInstance(UserEntity, {
        ...user,
        ...updated_body,
      });
      const resp = await query_runner.manager.save(mapped_user);
      await query_runner.commitTransaction();
      return resp;
    } catch (error) {
      await query_runner.rollbackTransaction();
      if (error.code == 23505) {
        const value = await KEY_EXTRACTOR(error.detail);
        throw new ConflictException({
          message: `${value} ${MESSAGES.GLOBAL.ERROR.ALREADY_EXIST}`,
          statusCode: 409,
        });
      }
      if (error.code === '22P02') {
        throw new UnprocessableEntityException({
          message: error.message,
        });
      }
      throw new InternalServerErrorException({ message: error.message });
    } finally {
      await query_runner.release();
    }
  }
}
