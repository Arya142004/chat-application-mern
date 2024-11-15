import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const [error, setError] = useState("");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();

    
    if (username.length < 4) {
      setError("Username must be at least 4 characters long.");
      return;
    }

    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const url = isLoginOrRegister === "register" ? "register" : "login";
    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedInUsername(username);
      setId(data.id);
    } catch (error) {
      setError(error.response.data.message || "An error occurred. Please try again.");
    }
  }

  return (
    <div className="bg-gray-50 h-screen flex items-center justify-center">
      <form
        className="w-full max-w-md mx-auto mb-12 bg-white shadow-lg rounded-lg p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Learniee
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="block w-full rounded-md p-3 mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="block w-full rounded-md p-3 mb-6 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
        <button className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold py-3 px-4 rounded-full w-full transition duration-150 ease-in-out shadow-md">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {isLoginOrRegister === "register" && (
            <div>
              Already a member?
              <button
                className="ml-1"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoginOrRegister("login");
                  setError("");
                }}
              >
                Login here
              </button>
            </div>
          )}
          {isLoginOrRegister === "login" && (
            <div>
              Don't have an account?
              <button
                className="ml-1"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoginOrRegister("register");
                  setError("");
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}