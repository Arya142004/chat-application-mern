export default function Avatar({ userId, username, online }) {
  const colors = [
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
  ];
  const userIdBase10 = parseInt(userId, 12);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
  return (
    <div
      className={`w-12 h-12 relative rounded-full flex items-center justify-center ${color} shadow`}
    >
      <div className="text-center font-medium text-white">{username[0]}</div>
      {online && (
        <div className="absolute w-4 h-4 bg-green-500 bottom-0 right-0 rounded-full border-2 border-white"></div>
      )}
      {!online && (
        <div className="absolute w-4 h-4 bg-gray-400 bottom-0 right-0 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
}