import {model,models,Types,Schema,Document} from "mongoose";
//tell developer which fields do we need, and make sure it accept proper TS types
export interface IUser {
    userName:string;
    email:string;
    role: string;
    image?:string;
    team?:[Types.ObjectId];
    userCollection?:[Types.ObjectId];
}
//Mongoose-specific fields like _id and timestamps that auto genertated
//For we can access fields like _id or id or
// any virtual methods provided by Mongoose on any kind of model
export interface IUserDoc extends IUser, Document {}
const UserSchema = new Schema<IUser>({
    userName:{ type: String, required: true, unique: true},
    email:{ type: String, required: true, unique: true },
    role:{ 
        type:String,
        enum:["Free","Pro"],
        required:true,
    },
    image:{type:String},
    team:{type: [Schema.Types.ObjectId]},
    userCollection:{type: [Schema.Types.ObjectId]},
},{timestamps:true});//for generating timestamps on when the user was created

//give the user a name like user, and them pass the user schema right into it
///checl if models user already exist then use that, else create a new model
const User = models?.User || model<IUser>("User",UserSchema);

export default User;