import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { MailService } from 'src/helpers/EmailHelper';
import { appEnv } from 'src/helpers/EnvHelper';
import { Comparepassword, Hashpassword } from 'src/helpers/UtilHelper';
import { UserRepository } from '../users/user.repository';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthResendVerificationEmailDto } from './dto/auth-resend-verification-email.dto';
import { Request, Response } from 'express';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtHelperService } from 'src/helpers/jwt-helper.service';
import { MESSAGES } from 'src/common/messages';
import { AuthChangePasswordDto } from './dto/change-password-dto';
import { UserService } from '../users/users.service';
import * as moment from 'moment';
import { IRedisUserModel } from '../base/base.interface';
import { DataSource } from 'typeorm';
const {
  AUTH: {
    ERROR: {
      USERNAME_PASSWORD_INCORRECT,
      EMAIL_UNVERIFIED,
      VERIFICATION_LINK_EXPIRED,
      USER_ALREADY_VERIFIED,
      USER_NOT_EXIST,
    },
  },
  USER: {
    ERROR: { USER_DOES_NOT_EXIST },
  },
} = MESSAGES;

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private jwtHelperService: JwtHelperService,
    private dataSource: DataSource,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  public async Login(data: AuthEmailLoginDto): Promise<{
    user: any;
    access_token: string;
    refresh_token: string;
  }> {
    try {
      const users: any = await this.userRepository.FindUserWithRoleAndPassword(
        data,
      );
      if (!users) {
        throw new BadRequestException(USERNAME_PASSWORD_INCORRECT);
      } else if (!users.verified) {
        throw new NotAcceptableException(EMAIL_UNVERIFIED);
      }

      const password_is_valid = await Comparepassword(
        data.password,
        users.password,
      );
      const login_date = moment().toDate();
      const flag_promise = this.userRepository.update(
        { id: users.id },
        { login_flag: login_date },
      );

      delete users['password'];
      if (!password_is_valid) {
        throw new BadRequestException(USERNAME_PASSWORD_INCORRECT);
      }
      const payload = {
        user_id: users.id,
        role: users.role_name,
        role_id: users.role_id,
      };
      const access_promise = this.jwtHelperService.SignAccessToken(payload);
      const refresh_promise = this.jwtHelperService.SignRefreshToken(payload);
      const [access_token, refresh_token] = await Promise.all([
        access_promise,
        refresh_promise,
        flag_promise,
      ]);
      return { user: users, access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  }

  public async VerifyEmail(token: string, response: Response): Promise<void> {
    try {
      const user_details = await this.VerifyFPToken(token);
      const user = await this.userRepository.findOneBy({ id: user_details.id });
      if (!user) throw new ForbiddenException(VERIFICATION_LINK_EXPIRED);
      else if (user && user.verified)
        throw new BadRequestException(USER_ALREADY_VERIFIED);
      user.verified = true;
      await this.userRepository.save(user);

      const front_end_url = `${appEnv('FRONTEND_DOMAIN')}/auth/login`;
      return response.redirect(front_end_url);
    } catch (error) {
      throw error;
    }
  }

  public CreateFPToken(user: any) {
    return sign({ id: user.id, email: user.email }, appEnv('FPTOKEN_SECRET'), {
      expiresIn: '72h',
    });
  }

  protected async VerifyFPToken(token: string) {
    let user_details: any;
    try {
      user_details = await verify(token, appEnv('FPTOKEN_SECRET'));
    } catch (err) {
      throw new ForbiddenException(VERIFICATION_LINK_EXPIRED);
    }

    return user_details;
  }

  public async ResendVerificationEmail(
    req: Request,
    data: AuthResendVerificationEmailDto,
  ): Promise<null> {
    try {
      const user = await this.userRepository.findOneBy({ email: data.email });

      if (!user) {
        throw new ForbiddenException(USER_NOT_EXIST);
      }

      const token = this.CreateFPToken(user);
      const replacements = {
        FullName: `${user.email}`,
        ActivationLink: `${this.configService.get('URL_ORIGIN')}://${req.get(
          'host',
        )}/auth/verify/email/${token}`,
      };

      const mail_options = {
        from: appEnv('SMTP_EMAIL'),
        to: data.email,
        subject: 'Verify Account',
      };

      await this.mailService.SendMail(
        'welcome.html',
        replacements,
        mail_options,
      );

      return null;
    } catch (error) {}
  }

  public async ForgotPassword(
    req: Request,
    data: AuthForgotPasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOneBy({ email: data.email });

    if (!user) {
      throw new ForbiddenException(USER_NOT_EXIST);
    }

    const token = this.CreateFPToken(user);

    const replacements = {
      FullName: `${user.email}`,
      ResetPasswordLink: `${this.configService.get('URL_ORIGIN')}://${req.get(
        'host',
      )}/auth/reset/password/${token}`,
    };

    const mail_options = {
      from: appEnv('SMTP_EMAIL'),
      to: data.email,
      subject: 'Reset Password',
    };

    await this.mailService.SendMail(
      'reset-password.html',
      replacements,
      mail_options,
    );

    return null;
  }

  public async VerifyResetPasswordRequest(token: string, response: Response) {
    try {
      const payload = await this.VerifyFPToken(token);
      const user = await this.userRepository.findOneBy({ id: payload.id });
      if (!user) {
        throw new NotFoundException(USER_NOT_EXIST);
      }
      const front_end_url = `${appEnv(
        'FRONTEND_DOMAIN',
      )}/reset-password/${token}`;
      return response.redirect(front_end_url);
    } catch (error) {
      throw error;
    }
  }

  public async ResetPassword(
    data: AuthResetPasswordDto,
    token: string,
  ): Promise<void> {
    try {
      const user_details = await this.VerifyFPToken(token);
      const user = await this.userRepository.findOneBy({ id: user_details.id });
      if (!user) throw new ForbiddenException(VERIFICATION_LINK_EXPIRED);
      user.password = await Hashpassword(data.password);
      await this.userRepository.save(user);
      return null;
    } catch (error) {
      throw error;
    }
  }
  public async SetPassword(
    data: AuthResetPasswordDto,
    token: string,
  ): Promise<void> {
    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.startTransaction();
    try {
      const user_details = await this.VerifyFPToken(token);
      const user = await this.userRepository.findOneBy({ id: user_details.id });
      if (!user) throw new ForbiddenException(VERIFICATION_LINK_EXPIRED);
      user.password = await Hashpassword(data.password);
      (user.verified = true), await this.userRepository.save(user);
      await query_runner.commitTransaction();
      return null;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public async RefreshToken(refresh_token: string): Promise<any> {
    try {
      const { user_id, role, role_id } =
        await this.jwtHelperService.VerifyRefreshToken(refresh_token);

      const access_token = await this.jwtHelperService.SignAccessToken({
        user_id,
        role: role,
        role_id: role_id,
      });
      const ref_token = await this.jwtHelperService.SignRefreshToken({
        user_id,
        role: role,
        role_id: role_id,
      });
      return { access_token, refresh_token: ref_token };
    } catch (error) {
      throw error;
    }
  }

  public async ChangePassword(data: AuthChangePasswordDto): Promise<void> {
    try {
      const { password, ...new_data } = data;
      const user: any = await this.userRepository.FindUserWithRoleAndPassword(
        new_data,
      );

      if (!user) {
        throw new ForbiddenException(MESSAGES.AUTH.ERROR.USER_NOT_EXIST);
      }

      const password_is_valid = await Comparepassword(password, user.password);
      delete user['password'];
      if (!password_is_valid) {
        throw new BadRequestException(USERNAME_PASSWORD_INCORRECT);
      }

      user.password = await Hashpassword(data.new_password);
      await this.userRepository.save(user);
      return null;
    } catch (error) {
      throw error;
    }
  }

  public async GetUser(user_id: number): Promise<any> {
    const users = await this.userService.FindOne(user_id, ['user_roles']);
    if (!users) {
      throw new NotFoundException(USER_DOES_NOT_EXIST);
    }
    const user = await this.userRepository.FindUserWithRoleAndPassword({
      email: users.email,
    });
    delete user['password'];
    return { user };
  }
}
