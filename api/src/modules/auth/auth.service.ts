import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from 'src/helpers/auth.helper';
import { FindOptionsWhere } from 'typeorm';
import { validateHash } from '../../helpers/password.helpers';
import { TokenType } from '../../types/enums';
import { AuthLogin } from './dto/login-payload.dto';
import { SelfUser, SelfRequestDto } from './dto/self-user.dto';
import { TokenPayloadDto } from './dto/token-payload';
import { UserLoginDto } from './dto/user-login.dto';
import { Staff } from '../staff/entities/staff.entity';
import {
  NoStaffFoundError,
  WrongPasswordError,
  StaffAlreadyExistsError,
} from '../../errors/ResourceError';
import { UserRegisterDto } from './dto/user-register.dto';
import { Session } from './entities/session.entity';

@Injectable()
export class AuthService {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(private jwtService: JwtService) {}

  private async validateUser(validateWith: { id?: string; username?: string }) {
    let user: Staff | undefined = undefined;
    let where: FindOptionsWhere<Staff> | undefined = undefined;

    if (validateWith.id) where = { id: validateWith.id };
    if (validateWith.username) where = { username: validateWith.username };

    user = await Staff.findOne({
      where,
    });
    return user;
  }

  private async checkUserExist(username: string, email: string) {
    const user = await Staff.findOne({
      where: [{ username: username }, { email: email }],
    });

    if (user) {
      StaffAlreadyExistsError();
    }
  }

  public async register(body: UserRegisterDto): Promise<null> {
    const { username, email, staffId, firstName, lastName, password } = body;

    await this.checkUserExist(username, email);

    const staff = new Staff();
    staff.username = username;
    staff.email = email;
    staff.staffId = staffId;
    staff.firstName = firstName;
    staff.lastName = lastName;

    staff.passwordHash = password;
    await staff.save();

    return null;
  }

  public async login(body: UserLoginDto): Promise<AuthLogin> {
    const { username, password } = body;

    const user: Staff = await this.validateUser({
      username: username,
    });

    if (!user) {
      NoStaffFoundError();
    }

    const isPasswordValid: boolean = await validateHash(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      WrongPasswordError();
    }

    const token = new TokenPayloadDto();
    token.expiresIn = 86400;
    token.accessToken = await this.helper.generateToken({
      id: user.id.toString(),
      type: TokenType.ACCESS_TOKEN,
    });

    const session = new Session();
    session.staffId = user.id.toString();
    session.accessToken = token.accessToken;
    session.lastLoginAt = new Date();
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + token.expiresIn);
    session.expiresAt = expiresAt;
    await session.save();

    const loginPayload = new AuthLogin();
    loginPayload.ownerUser = user;
    loginPayload.expiredIn = token.expiresIn;
    loginPayload.accessToken = token.accessToken;
    loginPayload.lastLoggedInAt = session.lastLoginAt;

    return loginPayload;
  }

  public async self(self: SelfRequestDto): Promise<SelfUser> {
    const user = await this.validateUser({
      id: self.id,
    });

    const selfUser = new SelfUser();
    selfUser.id = user.id;
    selfUser.username = user.username;

    return selfUser;
  }

  public async logout(self: SelfRequestDto): Promise<boolean> {
    const user = await this.validateUser({
      id: self.id,
    });

    if (!user) {
      NoStaffFoundError();
    }

    await Session.delete({ staffId: user.id });

    return true;
  }
}
