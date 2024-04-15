import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  findAllUsers,
  findUserByEmail,
  UpdatePassword,
  addVendorToFavorites
  ,findUserById,
  UpdateUserProfileDetails,getfavVendors,findbyIdandUpdate,updateNotificationstatus
} from "../Repository/userRepository";


import User, { UserDocument } from "../Model/User";
import generateOtp from "../util/generateOtp";
import { CustomError } from "../Error/CustomError";
import dotenv from 'dotenv';
import vendor from "../Model/Vendor";
import mongoose from "mongoose";
import admin from "../Model/Admin";
dotenv.config();


interface LoginResponse {
  token: string;
  userData: object;
  message: string;
  refreshToken: string;
}

export const signup = async (
  email: string,
  password: string,
  name: string,
  phone: number
): Promise<object> => {
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new CustomError(`User email already exists`, 401);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const isActive: boolean = true;
    const newUser = await createUser({
      email,
      password: hashedPassword,
      name,
      phone,
      isActive,
    });


    return {user: newUser };

  } catch (error) {
    throw error;
  }
};


export const createRefreshToken = async (refreshToken:string)=>{
  try {
    
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };
 

    const user = await User.findById(decoded._id);
    console.log("user",user)
      
  

    if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    
    return accessToken;


  } catch (error) {
   throw error 
  }
}


export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      throw new CustomError("User not exists..", 404);
    }


    if (!existingUser.isActive) {
      throw new CustomError(`User is Blocked, can't login`, 401);
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);


    if (!passwordMatch) {
      throw new CustomError("Incorrect password..", 401);
    }
    
    const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET!, { expiresIn: "1h"});
    
    let refreshToken = jwt.sign({ _id: existingUser._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
    existingUser.refreshToken = refreshToken;
    
    await existingUser.save();

    return {
      token,
      refreshToken,
      userData: existingUser,
      message: "Successfully logged in..",
    };
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (page: number, limit: number, search: string) => {
  try {
    const users = await findAllUsers(page, limit, search);
    return users;
  } catch (error) {
    throw error;
  }
};


export const toggleUserBlock = async (userId: string): Promise<void> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.isActive = !user.isActive; // Toggle the isActive field
    await user.save();

    const admindata = await admin.find();
    const Admin:any= admindata[0];
    Admin.notifications.push({
      _id: new mongoose.Types.ObjectId(),
      message:`${user.name}'s status was toggled , ${user.isActive ? "active" : "blocked"} now`,
      timestamp: new Date()
    })
  
    await Admin.save();
    console.log("notifi pushed",Admin);
  } catch (error) {
    throw error;
  }
};


export const  findUser = async (userId: string)=>{
try {
  const user = await findUserById(userId)
  return user;
} catch (error) {
  throw error ;
}

};


export const generateOtpForPassword = async (email: string) => {
  try {
    const otpCode = await generateOtp(email);
    if (otpCode !== undefined) {
      return otpCode;
    } else {
      console.log("error on generating otp , please fix ..");
      throw new Error(`couldn't generate otp, error occcured ,please fix !!`);
    }
  } catch (error) {
    throw error;
  }
};

export const ResetPassword = async (password: string, email: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const status = await UpdatePassword(hashedPassword, email);
    if (!status.success) {
      throw new Error(status.message);
    }
  } catch (error) {
    throw error;
  }
};

export const CheckExistingUSer = async (email: string) => {
  try {
    const existingUser = await findUserByEmail(email);
    return existingUser;
  } catch (error) {
    throw error;
  }
};

export const gLogin = async (email: string, password: string) => {
  try {
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      throw new CustomError("User not exists", 404);
    }

    if (existingUser.isActive === false) {
      throw new CustomError("User is blocked..", 404);
    }

    const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    return {
      token: token,
      userData: existingUser,
      message: "logged in successfully!",
    };
  } catch (error) {
    throw error;
  }
};

export const googleSignup = async (
  email: string,
  password: string,
  name: string
): Promise<object> => {
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new CustomError("user already exists", 404);
    }
    const isActive: boolean = true;
    const newUser = await createUser({ email, password, name, isActive });
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET!);
    return { token: token, user: newUser };
  } catch (error) {
    throw error;
  }
};



export const FavoriteVendor = async(vendorId:string , userId:string)=>{
  try {

    const user = await User.findById(userId);
  if (!user) {
  throw new Error("User not found.");
  }

  const vendorIndex = user.favorite.indexOf(vendorId);

  if (vendorIndex === -1) {
    user.favorite.push(vendorId);
  //setting notifications for vendor 
  const vendordata = await vendor.findById(vendorId)
  const data ={
    _id: new mongoose.Types.ObjectId(),
    message:`${user.name} like your profile`,
    timestamp: new Date() ,
    Read:false
  }
  vendordata?.notifications.push(data)
//setting notifications for user
  user.notifications.push({
    _id: new mongoose.Types.ObjectId(),
    message:`You have favorited a profile. Congrats!`,
    timestamp: new Date(),
    Read:false
  })
  await user.save();

  } else {
      user.favorite.splice(vendorIndex, 1);
  }
  await user.save();



  const isFavorite = user.favorite.indexOf(vendorId) === -1 ? false : true;
  return {
    userData: user,
    isFavorite: isFavorite 
};
    
} catch (error) {
    console.error("Error in addToFavorites service:", error);
    throw new Error("Failed to add vendor to favorites.");
}
};



export const checkCurrentPassword = async(currentpassword:string , userId:string)=>{

  try {
    
    const existingUser = await findUserById(userId);
    console.log("existingUser is",existingUser);
    console.log("current password in service is:",currentpassword);
    if(!existingUser){
     throw new Error("user not found")
    }

    const passwordMatch = await bcrypt.compare(currentpassword, existingUser.password);
    if (!passwordMatch) {
     return false;
    }

    return passwordMatch; 

  } catch (error) {
    throw error;
  }
}


export const UpdatePasswordService = async(newPassword:string , userId:string)=>{
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const existingUser = await findUserById(userId);
    if(!existingUser){
      throw new Error("user not found")
    }
    const email = existingUser.email;

    const updatedValue = await UpdatePassword(hashedPassword , email);
    if(updatedValue){
      existingUser.notifications.push({
        _id: new mongoose.Types.ObjectId(),
        message:`You have updated your password , Congrats!`,
        timestamp: new Date(),
        Read:false
      })
      await existingUser.save();
      return true;
    }
    return false
  } catch (error) {
    throw error;
  }
}



export const UpdateUserProfile=async(userId:string , name:string , phone:number , image:string , imageUrl:string)=>{
  try {
    const data = await UpdateUserProfileDetails(userId , name , phone, imageUrl, image);
    if(!data){
      return false;
    }
    return data;
  } catch (error) {
    throw error
  }
}


export const FavoriteVendors=async(userid:string , page: number, pageSize: number)=>{
    try {
      const {favoriteVendors , totalFavVendorsCount} = await getfavVendors(userid , page ,pageSize);
      return {favoriteVendors , totalFavVendorsCount}
    } catch (error) {
      throw error;
    }
}


export const updateNotification = async(userid:string ,notifiID:string ):Promise<object>=>{
  try {
    const data = await updateNotificationstatus(userid ,notifiID)
    return data
  } catch (error) {
    throw error;
  }
}