import React, { useState } from "react";
import axios from "axios";

function MessageList({ messages, id,selectedUserId,setMessages }) {
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const handleMouseEnter = (messageId) => setHoveredMessage(messageId);
  const handleMouseLeave = () => setHoveredMessage(null);
  const [showConfirmBox, setShowConfirmBox] = useState(false);

  const handleConfirmDelete = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (confirmed) {
      try {
        await axios.delete(`/message/${messageId}`);
      } catch (err) {
        console.error(err);
      }
      setShowConfirmBox(false);
      if (selectedUserId) {
        axios.get("/messages/" + selectedUserId).then((res) => {
          setMessages(res.data);
        });
      }
    } else {
    }
  };


  return (
    <div>
      {messages.map((message) => (
        <div
          key={message._id}
          className={`  ${
            message.sender === id ? "text-right message-container" : "text-left"
          }`}
          onMouseEnter={() => handleMouseEnter(message._id)}
          onMouseLeave={handleMouseLeave}
        >
          {hoveredMessage === message._id && message.sender === id && (
            <div
              className="delete-icon"
              onClick={() => handleConfirmDelete(hoveredMessage)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </div>
          )}
          <div
            className={`inline-block p-2 my-2 rounded-md text-sm ${
              message.sender === id
                ? "bg-blue-700 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            <div className="message-text">{message.text}</div>
          </div>
        </div>
      ))}
      {/* {showConfirmBox && (
      <div className="overlay">
        <div className="confirm-box">
          <p>Are you sure you want to delete this message?</p>
          <div className="choices-holder">
            <button onClick={()=>handleConfirmDelete(currentMessage)} className="bg-blue-500 hover:bg-blue-700">Yes</button>
            <button onClick={() => setShowConfirmBox(false)} className="bg-gray-500 hover:bg-gray-700">No</button>
          </div>
        </div>
      </div>
    )} */}
    </div>
  );
}

export default MessageList;
