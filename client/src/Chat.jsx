import { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Avatar from "./Avatar";
import { UserContext } from "./UserContext";
import axios from "axios";
import Contact from "./Contact";
import {
  MessageCircle,
  LogOut,
  Send,
  Users,
  Circle,
  ChevronRight,
} from "lucide-react";

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [oflinePeople, setOflinePeople] = useState({});
  const [selectedUserId, setselectedUserId] = useState(null);
  const [newMessageText, setnewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { username, id, setUsername, setId } = useContext(UserContext);
  const divundermessages = useRef();

  // Keeping all the existing useEffect hooks and functions the same
  useEffect(() => {
    const newSocket = io("https://arya-mern-chat.onrender.com", {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.off("message", handleMessage);
      newSocket.off("onlineUsers", showOnlinePeople);
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", handleMessage);
    socket.on("onlineUsers", showOnlinePeople);
  }, [socket]);

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function logout() {
    axios.post("/logout").then(() => {
      setId(null);
      setUsername(null);
    });
  }

  function handleMessage(messageData) {
    console.log("Received message:", messageData);
    setMessages((prev) => [...prev, { ...messageData }]);
    setnewMessageText("");
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedUserId) return;

    const data = {
      recipient: selectedUserId,
      text: newMessageText,
    };
    socket.emit("sendMessage", data);
    setnewMessageText("");
    setMessages((prev) => [
      ...prev,
      { text: data.text, sender: id, recipient: selectedUserId },
    ]);
  }

  useEffect(() => {
    const div = divundermessages.current;
    if (div) {
      div.scrollIntoView({ behaviour: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeoples = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeoples[p._id] = p;
      });
      setOflinePeople(offlinePeoples);
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  const onlinePeopleExcOurplp = { ...onlinePeople };
  delete onlinePeopleExcOurplp[id];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-white w-1/3 flex flex-col border-r border-gray-300 shadow-lg">
        <div className="p-4 border-b border-gray-300 flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
        </div>

        <div className="flex-grow overflow-y-auto">
          {Object.keys(onlinePeopleExcOurplp).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePeopleExcOurplp[userId]}
              onClick={() => setselectedUserId(userId)}
              selected={userId === selectedUserId}
            />
          ))}

          {Object.keys(oflinePeople).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={oflinePeople[userId].username}
              onClick={() => setselectedUserId(userId)}
              selected={userId === selectedUserId}
            />
          ))}
        </div>

        <div className="p-4 border-t border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar online={true} userId={id} username={username} />
              <span className="font-medium text-gray-700">{username}</span>
            </div>
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col w-2/3 bg-gray-50">
        {!selectedUserId && (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg">Select a conversation to start chatting</p>
            </div>
          </div>
        )}

        {!!selectedUserId && (
          <>
            <div className="flex-grow p-6 overflow-y-auto">
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-xl shadow-sm ${
                        message.sender === id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={divundermessages}></div>
              </div>
            </div>

            <form
              className="p-4 bg-white border-t border-gray-300 shadow-lg"
              onSubmit={sendMessage}
            >
              <div className="max-w-3xl mx-auto flex items-center gap-3">
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setnewMessageText(e.target.value)}
                  className="flex-grow px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="bg-yellow-400 text-black p-3 rounded-xl hover:bg-yellow-600 transition-colors flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>  
  );
}
