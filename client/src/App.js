import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const joinRoom = () => {
    if (name && room) {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message !== "") {
      const data = { room, name, message };
      socket.emit("send_message", data);
      setChat((prev) => [...prev, data]);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });
  }, []);

  return (
    <div className="container">
      {!joined ? (
        <div className="join-box">
          <h2>Join Chat</h2>
          <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <input placeholder="Room" onChange={(e) => setRoom(e.target.value)} />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div className="chat-box">
          <div className="header">Room: {room}</div>

          <div className="messages">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.name === name ? "own" : "other"
                }`}
              >
                <b>{msg.name}</b>
                <div>{msg.message}</div>
              </div>
            ))}
          </div>

          <div className="input-area">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;