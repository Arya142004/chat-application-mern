import Avatar from "./Avatar";
export default function Contact({ id, username, onClick, selected, online }) {
    return (
      <div
        onClick={() => onClick(id)}
        className={`flex items-center gap-4 p-4 mx-3 rounded-lg cursor-pointer transition-colors ${
          selected ? "bg-yellow-100 shadow-md" : "hover:bg-gray-100"
        }`}
      >
        <Avatar online={online} username={username} userId={id} />
        <span className="text-gray-800 font-medium">{username}</span>
      </div>
    );
  }