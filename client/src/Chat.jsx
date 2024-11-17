import { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import Avatar from "./Avatar";
import { UserContext } from "./UserContext";

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setselectedUserId] = useState(null);
  const [newMessageText, setnewMessageText] = useState("");
  const { username, id } = useContext(UserContext);

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });
    setSocket(newSocket);

    newSocket.on("message", handleMessage);
    newSocket.on("onlineUsers", showOnlinePeople);

    return () => {
      newSocket.off("message", handleMessage);
      newSocket.off("onlineUsers", showOnlinePeople);
      newSocket.close();
    };
  }, []);

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(message) {
    console.log("Received message:", message);
  }

  function sendMessage(e) {
    e.preventDefault();
    const data = {
      message: {
        recipient: selectedUserId,
        text: newMessageText,
      },
    };
    socket.emit("sendData", data);
  }

  const onlinePeopleExcOurplp = { ...onlinePeople };
  delete onlinePeopleExcOurplp[id];

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 pl-4 pt-4">
        <div className="text-blue-500 font-bold">Chats</div>
        {Object.keys(onlinePeopleExcOurplp).map((userId) => (
          <div
            onClick={() => setselectedUserId(userId)}
            key={userId}
            className={
              "border-b border-gray-200 py-2 flex items-center gap-2 cursor-pointer " +
              (userId === selectedUserId ? "bg-blue-200" : "")
            }
          >
            <Avatar username={onlinePeople[userId]} userId={userId} />
            <span>{onlinePeople[userId]}</span>
          </div>
        ))}
      </div>
      <div className="bg-blue-300 flex flex-col w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center">
              <div>Select a Person</div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className="flex gap-2 mx-2" onSubmit={sendMessage}>
            <input
              type="text"
              onChange={(e) => setnewMessageText(e.target.value)}
              className="bg-white border p-2 flex-grow rounded-sm"
              placeholder="Type a message"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black p-2 rounded-sm"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
