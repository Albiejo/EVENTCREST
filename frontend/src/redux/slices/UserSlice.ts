import {createSlice} from '@reduxjs/toolkit';


export interface UserData{
    name:string,
    email:string,
    _id:string,
    isActive:boolean,
    image:string,
    phone:string,
    imageUrl:string,
    favorite:Array<string>
}

export interface UserState{
    userdata : UserData | null;
    isUserSignedIn: boolean;
}

const initialState :UserState ={
    userdata:null,
    isUserSignedIn:false
}

 const userSlice =createSlice({
    name:"user",
    initialState,
    reducers:{
    setUserInfo :(state,action)=>{
        state.userdata = action.payload;
        state.isUserSignedIn=true
    },
    logout:(state)=>{
        state.userdata = null;
        state.isUserSignedIn=false;
    }

    }
})

export const  {setUserInfo,logout} = userSlice.actions;
export default userSlice.reducer;