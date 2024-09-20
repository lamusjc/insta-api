"use strict";

const express = require("express");
var router = express.Router();

//Endpoints de usuario
router.post("/register", require("./register.js"));
router.put("/update", require("./update_user.js"));
router.post("/login", require("./login.js"));
router.get("/info", require("./info.js"));
router.get("/logout", require("./logout.js"));

//Endpoints de posts
router.post("/post", require("./create_post.js"));
router.get("/post", require("./get_post.js"));
router.post("/like", require("./like"));
router.post("/dislike", require("./dislike"));
router.post("/comment", require("./create_comment"));

// Endpoints otros
router.get("/user/:users_id", require("./get_user"));
router.get("/user", require("./get_all_user.js"));
router.post("/follow", require("./follow"));
router.post("/unfollow", require("./unfollow"));
router.post("/delete_post", require("./delete_post"));
router.post("/hide_post", require("./hide_post"));
router.post("/unhide_post", require("./unhide_post"));
router.get("/notifications", require("./get_notifications"));

module.exports = router;
