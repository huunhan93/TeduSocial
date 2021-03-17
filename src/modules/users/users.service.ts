
import UserSchema from "./users.model";
import RegisterDto from "./dtos/register.dto";
import { isEmptyObject } from "@core/utils";
import { HttpException } from "@core/exceptions";
import gravatar from "gravatar";
import bcryptjs from "bcryptjs";
import IUser from "./users.interface";
import { IPagination } from "@core/interfaces";
import { TokenData } from '@modules/auth';
import { RefreshTokenSchema } from '@modules/refresh_token';
import { generateJwtToken, randomTokenString } from "@core/utils/helper";


class UserService {
  public userSchema = UserSchema;

  public async createUser(model: RegisterDto): Promise<TokenData> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }
    const user = await this.userSchema.findOne({ email: model.email });
    if (user) {
      throw new HttpException(409, `Your email ${model.email} already exist.`);
    }

    const avatar = gravatar.url(model.email!, {
      size: "200",
      rating: "g",
      default: "mm",
    });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(model.password!, salt);

    const createdUser: IUser = await this.userSchema.create({
      ...model,
      password: hashedPassword,
      avatar: avatar,
      date: Date.now(),
    });
    const refreshToken = await this.generateRefreshToken(createdUser._id);
    await refreshToken.save()

    return generateJwtToken(createdUser._id, refreshToken.token);
  }

  public async updateUser(userId: string, model: RegisterDto): Promise<IUser> {
    if (isEmptyObject(model)) {
      throw new HttpException(400, "Model is empty");
    }
    const user = await this.userSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(400, "User is not exists");
    }
    let avatar = user.avatar;
    if (user.email === model.email) {
      throw new HttpException(400, "You must using the difference email");
    } 

    const checkEmailExist = await this.userSchema
      .find({
        $and: [{email: { $eq: model.email}}, {_id: { $ne: userId }}],
      })
      .exec();
    
    if (checkEmailExist.length !== 0 ){
      throw new HttpException(400, "Your email has been used by another user")
    }

    avatar = gravatar.url(model.email!, {
      size: '200',
      rating: 'g',
      default: 'mm',
    });

    let updateUserById;
    if (model.password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(model.password, salt);
      updateUserById = await this.userSchema
        .findByIdAndUpdate(userId, {
          ...model,
          avatar: avatar,
          password: hashedPassword,
        }, {new: true})
        .exec();
    } else {
      updateUserById = await this.userSchema
        .findByIdAndUpdate(userId, {
          ...model,
          avatar: avatar,
        })
        .exec();
    }

    if (!updateUserById) throw new HttpException(409, "User are not an user");

    return updateUserById;
  }

  public async getUserById(userId: string): Promise<IUser> {
    const user = await this.userSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(409, `User is not exists`);
    }
    return user;
  }

  public async getAll() : Promise<IUser[]>{
    const users = await this.userSchema.find().exec();
    return users;
  }

  public async getAllPaging(keyword: string, page: number): Promise<IPagination<IUser>> {
    const pageSize = Number(process.env.PAGE_SIZE || 10);
    let query = {};
    if(keyword){
      query = this.userSchema
        .find({
          $or : [
            {email: keyword}, 
            {first_name: keyword}, 
            {last_name: keyword}
          ]
        })
        .sort({date: -1});
    }

    const users = await this.userSchema
      .find(query)
      .skip((page -1) * pageSize)
      .limit(pageSize)
      .exec();

    const rowCount = await this.userSchema.find(query).countDocuments().exec();
    return {
      total : rowCount,
      page : page,
      pageSize : pageSize,
      items: users
    } as IPagination<IUser>;
  }

  public async deleteUser(userId: string) : Promise<IUser>{
    const deleteUser = await this.userSchema.findByIdAndDelete(userId).exec();
    if(!deleteUser) throw new HttpException(409, "Your id is invalid")
    return deleteUser;
  }

  private async generateRefreshToken(userId: string) {
    // create a refresh token that expires in 7 days
    return new RefreshTokenSchema({
      user: userId,
      token: randomTokenString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }
}

export default UserService;
