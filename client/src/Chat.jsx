import { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
});

export default function Chat() {
  useEffect(() => {
    
    socket.connect();

   
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">contacts</div>
      <div className="bg-blue-300 flex flex-col w-2/3 p-2">
        <div className="flex-grow">message with selected person</div>
        <div className="flex gap-2 mx-2">
          <input
            type="text"
            className="bg-white border p-2 flex-grow rounded-sm"
            placeholder="Type a message"
          />
          <button className="bg-yellow-400 text-black p-2 rounded-sm">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}