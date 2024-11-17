import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import Avatar from "./Avatar";
import { UserContext } from "./UserContext";

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setselectedUserId] = useState(null);
  const [newMessageText, setnewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { username, id } = useContext(UserContext);

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
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
    setMessages((prev) => [
      ...prev,
      { text: data.text, sender: id, recipient: selectedUserId },
    ]);
    setnewMessageText("");
  }

  const onlinePeopleExcOurplp = { ...onlinePeople };
  delete onlinePeopleExcOurplp[id];

  return (
    <div className="flex h-screen bg-gray-100">
     
      <div className="bg-gray-50 w-1/3 border-r border-gray-200">
        <div className="text-gray-900 font-bold text-xl p-4 border-b border-gray-200">
          Chats
        </div>
        <div className="mt-2">
          {Object.keys(onlinePeopleExcOurplp).map((userId) => (
            <div
              onClick={() => setselectedUserId(userId)}
              key={userId}
              className={`flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer hover:bg-yellow-100 ${
                userId === selectedUserId ? "bg-yellow-100" : "bg-white"
              }`}
            >
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span className="text-gray-800 font-medium">
                {onlinePeople[userId]}
              </span>
            </div>
          ))}
        </div>
      </div>

      
      <div className="flex flex-col w-2/3 bg-white">
        <div className="flex-grow p-4 overflow-y-auto">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center text-gray-500 text-lg">
              Select a person to start chatting
            </div>
          )}
          {!!selectedUserId && (
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-lg max-w-[70%] ${
                    message.sender === id
                      ? "bg-indigo-500 text-white ml-auto"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
          )}
        </div>

        {!!selectedUserId && (
          <form
            className="flex items-center gap-2 border-t border-gray-200 p-4"
            onSubmit={sendMessage}
          >
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setnewMessageText(e.target.value)}
              className="bg-gray-50 border border-gray-300 p-3 rounded-md flex-grow focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-md hover:bg-yellow-300 transition"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
