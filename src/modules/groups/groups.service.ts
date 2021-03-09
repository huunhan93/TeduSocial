import CreateGroupDto from "./dtos/create_group.dto";
import GroupSchema from "./groups.model";
import { HttpException } from "@core/exceptions";
import { IGroup, IManager, IMember } from "./groups.interface";
import { IUser, UserSchema } from "@modules/users";
import SetManagerDto from "./dtos/set_manager.dto";

export default class GroupService {
  public async createGroup(
    userId: string,
    groupDto: CreateGroupDto
  ): Promise<IGroup> {
    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "user id is not exist");

    const existingGroup = await GroupSchema.find({
      $or: [{ name: groupDto.name }, { code: groupDto.code }],
    }).exec();

    if (existingGroup.length > 0)
      throw new HttpException(400, "Name or code existed");
    const newGroup = new GroupSchema({
      ...groupDto,
    });

    const post = await newGroup.save();
    return post;
  }

  public async updateGroup(
    groupId: string,
    groupDto: CreateGroupDto
  ): Promise<IGroup> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group is not exist");

    const existingGroup = await GroupSchema.find({
      $and: [
        { $or: [{ name: groupDto.name }, { code: groupDto.code }] },
        {
          _id: { $ne: groupId },
        },
      ],
    }).exec();
    if (existingGroup.length > 0)
      throw new HttpException(400, "Name or code is existed");
    const groupFields = { ...groupDto };
    const updatedGroup = await GroupSchema.findOneAndUpdate(
      { _id: groupId },
      { $set: groupFields },
      { new: true }
    ).exec();

    if (!updatedGroup) throw new HttpException(400, "Update is not success");

    return updatedGroup;
  }

  public async getAllGroup(): Promise<IGroup[]> {
    const posts = await GroupSchema.find().sort({ date: -1 }).exec();
    return posts;
  }

  public async getAllMembers(groupId: string): Promise<IUser[]> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group is not exists");

    const userIds = group.members.map((member) => {
      return member.user;
    });

    const users = UserSchema.find({_id: userIds}).select("-password").exec();
    return users;
  }

  public async deleteGroup(groupId: string): Promise<IGroup> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group is not exists");

    const deleteGroup = await GroupSchema.findOneAndDelete({
      _id: groupId,
    }).exec();
    if (!deleteGroup) throw new HttpException(400, "Delete is not success");

    return deleteGroup;
  }

  public async joinGroup(userId: string, groupId: string): Promise<IGroup> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group is not exists");

    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User is not exists");

    if (
      group.member_request &&
      group.member_request.some(
        (item: IMember) => item.user.toString() === userId
      )
    ) {
      throw new HttpException(
        400,
        "You has already been requested to join this group"
      );
    }

    if (
      group.members &&
      group.members.some((item: IMember) => item.user.toString() === userId)
    ) {
      throw new HttpException(
        400,
        "You has already been be member of this group"
      );
    }

    group.member_request.unshift({
      user: userId,
    } as IMember);

    await group.save();
    return group;
  }

  public async approveJoinRequest(
    userId: string,
    groupId: string
  ): Promise<IGroup> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group is not exists");

    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User is not exists");

    if (
      group.member_request &&
      group.member_request.some(
        (item: IMember) => item.user.toString() !== userId
      )
    ) {
      throw new HttpException(400, "There is not any request of this user");
    }

    group.member_request = group.member_request.filter(
      ({ user }) => user.toString() !== userId
    );

    group.members.unshift({ user: userId } as IMember);

    await group.save();
    return group;
  }

  public async addManager(
    groupId: string,
    request: SetManagerDto
  ): Promise<IGroup> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group id is not exists");

    const user = await UserSchema.findById(request.userId)
      .select("-password")
      .exec();
    if (!user) throw new HttpException(400, "User is not exists");

    if (
      group.managers &&
      group.managers.some(
        (item: IManager) => item.user.toString() === request.userId
      )
    ) {
      throw new HttpException(
        400,
        "You has already been set manager to this group"
      );
    }

    group.managers.unshift({
      user: request.userId,
      role: request.role,
    } as IManager);

    await group.save();
    return group;
  }

  public async removeManager(groupId: string, userId: string): Promise<IGroup> {
    const group = await GroupSchema.findById(groupId).exec();
    if (!group) throw new HttpException(400, "Group id is not exists");

    const user = await UserSchema.findById(userId).select("-password").exec();
    if (!user) throw new HttpException(400, "User is not exists");

    if (
      group.managers &&
      group.managers.some((item: IManager) => item.user.toString() !== userId)
    ) {
      throw new HttpException(
        400,
        "You has not yet been manager of this group"
      );
    }

    group.managers = group.managers.filter(
      ({ user }) => user.toString() !== userId
    );

    await group.save();
    return group;
  }
}
