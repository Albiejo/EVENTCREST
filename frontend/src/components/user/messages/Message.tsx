import React from 'react'
import './Message.css'
import {format} from 'timeago.js'


const Message = ({message,own}) => {
    return (
        <div className={own ? "message own" : "message"}>
        <div className="messageTop">
        <img
        className="messageImg"
        src="data:image/jpeg;base64,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"
        alt=""
        />
        <p className="messageText">{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
        );
}

export default Message