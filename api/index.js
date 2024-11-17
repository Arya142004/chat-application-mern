const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Message = require("./models/Message");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
mongoose.connect(process.env.MONGO_URL);
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userdata) => {
        if (err) throw err;
        resolve(userdata);
      });
    } else {
      reject("no token");
    }
  });
}

app.get("/test", (req, res) => {
  res.json("test-ok");
});

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({createdAt : 1});
  res.json(messages);
});

app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userdata) => {
      if (err) throw err;
      res.json(userdata);
    });
  } else {
    res.status(401).json("no token");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passok = bcrypt.compareSync(password, foundUser.password);
    if (passok) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          res.cookie("token", token).json({
            id: foundUser._id,
          });
        }
      );
    }
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).status(201).json({
          id: createdUser._id,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");
  const cookies = socket.request.headers.cookie;
  if (cookies) {
    const tokencookiestring = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokencookiestring) {
      const token = tokencookiestring.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          socket.userId = userId;
          socket.username = username;
        });
      }
    }
  }

  socket.on("sendMessage", async (data) => {
    const { recipient, text } = data;
    if (recipient && text) {
      const messageDoc = await Message.create({
        sender: socket.userId,
        recipient: recipient,
        text: text,
      });
      [...io.sockets.sockets.values()]
        .filter((c) => c.userId === recipient)
        .forEach((c) =>
          c.emit("message", {
            text,
            sender: socket.userId,
            recipient: recipient,
            id: messageDoc._id,
          })
        );
      
    }
  });

  const onlineUsers = [...io.sockets.sockets.values()].map((socket) => ({
    userId: socket.userId,
    username: socket.username,
  }));

  io.emit("onlineUsers", onlineUsers);
});

server.listen(4000);
