
import './vendorMessenger.css'
import Conversation from '../../../Components/Vendor/Conversations/Conversation';
import Message from '../../../Components/User/messages/Message';

import { useSelector } from 'react-redux';
import UserRootState from '../../../Redux/rootstate/UserState';
import VendorRootState from '../../../Redux/rootstate/VendorState';
import { useEffect, useRef, useState } from 'react';
import { axiosInstanceAdmin, axiosInstanceChat, axiosInstanceMsg } from '../../../Api/axiosinstance';
import {io} from 'socket.io-client'
import DefaultLayout from '../../../Layout/DefaultLayout';
import Picker from '@emoji-mart/react'



const Messenger = () => {

    const user = useSelector((state: UserRootState) => state.user.userdata);
    const vendorData = useSelector(
        (state: VendorRootState) => state.vendor.vendordata,
      );


    const [conversation , setconversation] = useState([]);
    const [currentchat , setcurrentchat]  = useState(null);
    const [messages , setmessages] = useState([]);
    const [arrivalMessage , setArrivalMessage] = useState(null)
    const [newMessage, setnewMessage] = useState("");
    const [typing , setTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [receiverdata , setReceiverdata] = useState(null)


    const scrollRef = useRef()
    const socket = useRef(io("ws://localhost:8900")); 

    useEffect(()=>{
        socket.current = io("ws://localhost:8900")
        socket.current.on("getMessage" , (data)=>{
            setArrivalMessage({
                sender : data.senderId , 
                text : data.text,
                createdAt : Date.now()
            });
        })

        socket.current.on("typingsent" , (senderId)=>{
            console.log(typing)
            setTyping(true);
            console.log(typing)
        })

        socket.current.on("stopTypingsent" , (senderId)=>{
            console.log(typing)
            setTyping(false);
            console.log(typing)
        })


     
    },[typing])





    useEffect(()=>{
        arrivalMessage && currentchat?.members.includes(arrivalMessage.sender) &&
        setmessages((prev)=>[...prev , arrivalMessage])  
    },[arrivalMessage , currentchat])







    useEffect(()=>{
     
        socket.current.emit("adduser" , vendorData?._id);
        socket.current.on("getUsers" , (users)=>{
            console.log(users)
        })
    },[user])





    //getting conversations
    useEffect(()=>{
        const getconversation = async()=>{  
            try {
                const res = await axiosInstanceChat.get(`/?userId=${vendorData?._id}`)
                setconversation(res.data)
                
            } catch (error) {
                console.log(error)
            }
        }
        getconversation();

    } , [user?._id])





    //gettin messages
    useEffect(()=>{
        const getmessages = async()=>{
            try {
                const res = await axiosInstanceMsg.get(`/?conversationId=${currentchat?._id}`)
                setmessages(res.data)
                
            } catch (error) {
                console.log(error)
            }
        }
        getmessages();
    },[currentchat])
    


    const receiverId = currentchat?.members.find((member)=>member !==vendorData?._id)

     const handleSubmit=async(e)=>{
        e.preventDefault();

        const message = {
            senderId: vendorData?._id,
            text:newMessage,
            conversationId: currentchat?._id
        };
        
        socket.current.emit("sendMessage" , {
            senderId : vendorData?._id,
            receiverId,
            text:newMessage
        })
        
        try {
                axiosInstanceMsg.post('/' , message).then((res)=>{
                setmessages([...messages , res.data]);
                setnewMessage("")
            })
          
        } catch (error) {
            console.log(error)
        }

     };



     //scrolling to bottom when new msg arrives
     useEffect(()=>{
        scrollRef.current?.scrollIntoView({ behavior:"smooth"})
        fetchreceiverdata();
     },[messages])

     
        const fetchreceiverdata=async()=>{
            await axiosInstanceAdmin.get(`/getUser?userId=${receiverId}`,{withCredentials:true})
            .then((res)=>{
                setReceiverdata(res.data)
            })
        }
        
        const handleTyping = () => {
            socket.current.emit('typing', { receiverId: receiverId });
        };
  
       
        const handleStopTyping = () => {
            socket.current.emit('stopTyping', { receiverId: receiverId });
        };


     const handleInputChange = (e) => {
        setnewMessage(e.target.value);
        handleTyping();
       };

       const handleEmojiSelect = emoji => {
        console.log("emoji is",emoji , emoji.native)
        setnewMessage(prev => prev + emoji.native);
    };



  return (
   <>
   <DefaultLayout>
   <div className="messenger">
    <div className="chatmenu">
        <div className="chatmenuWrapper" >
           <input placeholder='Search for friends' className='chatmenuInput'/>
          
          
          
           {conversation.map((c) => (
                <div onClick={()=> setcurrentchat(c)}>
                <Conversation  conversation={c} currentUser={vendorData}/>
                </div>
            ))}

          
        </div>
    </div>
    <div className="chatbox">
        <div className="chatboxWrapper">
            {
                currentchat ?
                (
                <>
                <div className="chatboxTop">
                    {messages.map((m)=>(
                        <div ref={scrollRef}>
                            <Message message={m} own={m.senderId === vendorData?._id} />
                        </div>
                    ))}

                   {typing && (
                     <div className='userTyping'>Typing...</div>
                    )}
                    
                </div>
            <div className="chatboxBottom">
                <textarea className='chatMessageInput' placeholder='write something..'onChange={handleInputChange} value={newMessage}  onBlur={handleStopTyping}></textarea>
                <button className='chatSubmitButton' onClick={handleSubmit}>send</button>

                {showEmojiPicker && (
                        <Picker
                            set='apple'
                            onSelect={handleEmojiSelect} 
                            style={{ position: 'absolute', bottom: '70px', right: '10px' }}
                        />
                    )}
                 <button onClick={() => setShowEmojiPicker(prev => !prev)}>😀</button>
                 
            </div>
                </> ):( <span className='noConversationtext'>open a conversation to start a chat</span>)
            }
            
        </div>
    </div>
   </div>
   </DefaultLayout>
   </>
  )
}

export default Messenger