import mongoose from "mongoose";
import Booking , { bookingDocument } from "../Model/Booking";
import { createNewBooking  , findBookingsByVendorId , findBookingsByUserId , findBookingsByBookingId , updateBookingStatusById , 
  updatebookingCancel,checkDate
} from "../Repository/bookingRepository";
import vendor from "../Model/Vendor"


export const checkIfDatePresent = async(vendorId:string , date:string):Promise<boolean>=>{
try {
  const value =  await checkDate(vendorId , date);
  return value? true : false;
} catch (error) {
  throw error;
}
}




export const addABooking=async(eventName:string, name:string, city:string,date:string,pin:number,mobile:number,vendorId:string,userId:string):Promise<object>=>{
    try{
        const vendorIdObjectId =new mongoose.Types.ObjectId(vendorId) as unknown as mongoose.Schema.Types.ObjectId;
        const userIdObjectId=new mongoose.Types.ObjectId(userId) as unknown as mongoose.Schema.Types.ObjectId;
        const booking= await createNewBooking({eventName, name, city,date,pin,mobile, vendorId:vendorIdObjectId,userId:userIdObjectId});
        return booking;
      } catch (error) {
        throw error;
      }
}

export const getAllBookingsByUser=async(userId:string , skip: number, limit: number):Promise<bookingDocument[]>=>{
    try{
      const bookings=await findBookingsByUserId(userId , skip, limit)
      return bookings;
    } catch (error) {
      throw error;
    }
}



export const getAllBookingsByVendor=async(vendorId:string):Promise<bookingDocument[]>=>{
    try{
      const bookings=await findBookingsByVendorId(vendorId)
      return bookings;
    } catch (error) {
      throw error;
    }
}


export const getAllBookingsById=async(bookingId:string):Promise<bookingDocument|{}>=>{
  try{
    const bookings=await findBookingsByBookingId(bookingId)
    return bookings;
  } catch (error) {
    throw error;
  }
}



export const updateStatusById=async(bookingId:string,status:string , vid:string , userId:string)=>{
  try{
    const bookings=await updateBookingStatusById(bookingId,status , vid, userId)
    return bookings;
  } catch (error) {
    throw error;
  }
}


export const countTotalBookingsByUser =async(userId: string)=>{
  try {
    const totalBookings = await Booking.countDocuments({ userId: userId });
    return totalBookings;
  } catch (error) {
    throw error;
  }
}

export const MarkBookingCancel = async(bookingId:string , vendorId:string , date:string)=>{
try {
  const result = await updatebookingCancel(bookingId , vendorId , date);
  return result
} catch (error) {
  throw error;
}
}

export const acquireLockForDate = async (vendorId: string, date: string): Promise<void> => {
  try {
    const vendorData = await vendor.findById(vendorId);
   
    if (!vendorData) {
      throw new Error("Vendor not found");
    }

    const existingLock = vendorData.locks.find(lock => lock.date === date);
   
    if (existingLock && existingLock.isLocked) {
      throw new Error('Date is already locked');
    }

    vendorData.locks.push({
      date: date,
      isLocked: true
    });
    
    await vendorData.save();
  } catch (error) {
    throw error;
  }
}


export const releaseLockForDate=async (vendorId: string, date: string): Promise<void> =>{
  try {

    const vendorData = await vendor.findById(vendorId);
   
    if (!vendorData) {
      throw new Error("Vendor not found");
    }

    const lockIndex = vendorData.locks.findIndex(lock => lock.date === date);


    if (lockIndex !== -1) {
      vendorData.locks.splice(lockIndex, 1);
      await vendorData.save();
    }
  } catch (error) {
    throw error;
  }
}

