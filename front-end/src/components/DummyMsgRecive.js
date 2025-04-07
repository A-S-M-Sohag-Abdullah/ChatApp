import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatComponent = ({ chatId = "67b40fa5f8c47c10bb6693ae" }) => {
  const [typedMsg, setTypedMsg] = useState();
  const [messages, setMessages] = useState([]);

  const sendMsg = (e) => {
    e.preventDefault();
    socket.emit("sendMessage", {
      chatId: chatId,
      content: typedMsg,
      sender: "67b7fe6519f0b3793d197f53",
    });
  };

  useEffect(() => {
    socket.emit("joinChat", chatId); // Join chat room

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage"); // Cleanup on unmount
    };
  }, [chatId]);

  return (
    <div>
      <form action="" onSubmit={sendMsg}>
        <input
          type="text"
          onChange={(e) => {
            setTypedMsg(e.target.value);
          }}
        />
        <button type="Submit">send</button>
      </form>

      {messages.map((msg, index) => (
        <p key={index}>{msg.content}</p>
      ))}
    </div>
  );
};

export default ChatComponent;
