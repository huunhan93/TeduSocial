import { IsNotEmpty } from "class-validator";

export default class CreateCommentDto{
    @IsNotEmpty()
    public text: String | undefined;
    @IsNotEmpty()
    public userId: String | undefined;
    @IsNotEmpty()
    public postId: String | undefined;

}