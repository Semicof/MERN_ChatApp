const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Message = require("../models/Message");
const ws = require("ws");
const fs = require("fs");
dotenv.config();
const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_KEY;
const bcryptSalt = bcrypt.genSaltSync(8);

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

const testFnc = (req, res) => res.json("test ok");

const returnMsgFnc = async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
};

const deleteMsg = async (req, res) => {
  try {
    console.log("id 1:", req.params.id);
    const deletedMessage = await Message.findByIdAndDelete(
      mongoose.Types.ObjectId(req.params.id)
    );
    if (!deletedMessage) {
      res.status(404).json({ message: "Message not found" });
    } else {
      res.json({ message: "Message deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const returnPeopleFnc = async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
};

const checkValidUser = (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            id: foundUser._id,
          });
        }
      );
    }
  }
};

const logout = (req, res) =>
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");

const register = async (req, res) => {
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
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: createdUser._id,
          });
      }
    );
  } catch (err) {
    if (err) throw err;
    res.status(500).json("error");
  }
};

const showUserInfo = async (req, res) => {
  try {
    const user = await User.findById(mongoose.Types.ObjectId(req.params.id));
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    res.status(400).json({ message: "Passwords do not match!" });
    return;
  }

  try {
    const user = await User.findById(mongoose.Types.ObjectId(userId));
    if (user) {
      const passOk = bcrypt.compareSync(oldPassword, user.password);
      if (passOk) {
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await User.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(userId) },
          { password: hashedPassword }
        );
        res.status(400).json({ message: "Change password successfully!!" });
        return;
      } else {
        res.status(400).json({ message: "Wrong password!" });
        return;
      }
    } else {
      return res.json("No user found!");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Server error");
  }
};

module.exports = {
  testFnc,
  returnMsgFnc,
  returnPeopleFnc,
  checkValidUser,
  login,
  logout,
  register,
  deleteMsg,
  showUserInfo,
  changePassword,
};
