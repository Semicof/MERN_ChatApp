const express = require("express");
const {
  testFnc,
  returnMsgFnc,
  returnPeopleFnc,
  checkValidUser,
  login,
  logout,
  register,
  deleteMsg,
  showUserInfo,
  changePassword
} = require("../services/webServices");

let router = express.Router();

const initWebRoute = (app) => {
  router.get("/test", testFnc);

  router.get("/messages/:userId", returnMsgFnc);

  router.get("/user/:id",showUserInfo);

  router.post("/user/change-password",changePassword)
  
  router.delete("/message/:id",deleteMsg);

  router.get("/people", returnPeopleFnc);

  router.get("/profile", checkValidUser);

  router.post("/login", login);

  router.post("/logout", logout);

  router.post("/register", register);

  return app.use("/", router);
};

module.exports = initWebRoute;

