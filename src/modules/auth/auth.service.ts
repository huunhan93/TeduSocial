import { DataStoredInToken, IUser, TokenData } from '@modules/auth';
import { UserSchema } from '@modules/users';
import LoginDto from './auth.dto';
import jwt from 'jsonwebtoken';
import { isEmptyObject } from '@core/utils';
import { HttpException } from '@core/exceptions';
import bcryptjs from 'bcryptjs';

class AuthService {
  public userSchema = UserSchema;

  public async login(model: LoginDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, 'Model is empty');
    }
    const user = await this.userSchema.findOne({ email: model.email });
    if (!user) {
      throw new HttpException(409, `Your email ${model.email} is not exists.`);
    }
    const isMatchPassword = await bcryptjs.compare(model.password, user.password);
    if (!isMatchPassword) throw new HttpException(400, 'Credential is not valid');

    return this.createToken(user);
  }

  private createToken(user: IUser): TokenData {
    const dataInToken: DataStoredInToken = { id: user._id };
    const secret: string = process.env.JWT_TOKEN_SECRET!;
    const expiresIn = 6000;
    return {
      token: jwt.sign(dataInToken, secret, { expiresIn: expiresIn }),
    };
  }

  public async getCurrentLoginUser(userId: string): Promise<IUser> {
    const user = await this.userSchema.findById(userId);
    if (!user) {
      throw new HttpException(404, `User is not exists.`);
    }

    return user;
  }
}

export default AuthService;
