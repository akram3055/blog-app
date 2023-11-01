const express = require("express");
const multer = require("multer");
const {
  registerCtrl,
  loginCtrl,
  userDetailCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  coverUploadCtrl,
  passwordUpadateCtrl,
  profileUpdateCtrl,
  logoutCtrl,
} = require("../../controllers/users/users");
const userRoutes = express.Router();

const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const { updateOne } = require("../../model/post/Post");
//instance of multer
const upload = multer({ storage });

//rendering forms
//render login
userRoutes.get("/login", (req, res) => {
  res.render("users/login", {
    error: "",
  });
});
//render register
userRoutes.get("/register", (req, res) => {
  res.render("users/register", {
    error: "",
  });
});

//render upload profile
userRoutes.get("/profile-photo-upload", (req, res) => {
  res.render("users/uploadProfilePhoto", { error: "" });
});
//render upload profile
userRoutes.get("/cover-photo-upload", (req, res) => {
  res.render("users/uploadCoverPhoto", { error: "" });
});

// render user update form
userRoutes.get("/update-user-password", (req, res) => {
  res.render("users/updatePassword", { error: "" });
});

//post
userRoutes.post("/register", upload.single("profile"), registerCtrl);

userRoutes.post("/login", loginCtrl);

userRoutes.get("/profile", protected, profileCtrl);

userRoutes.put(
  "/profile-photo-upload",
  protected,
  upload.single("profile"),
  uploadProfilePhotoCtrl
);

userRoutes.put(
  "/cover-photo-upload",
  protected,
  upload.single("cover"),
  coverUploadCtrl
);

userRoutes.put("/update-password", passwordUpadateCtrl);

userRoutes.put("/update", profileUpdateCtrl);

userRoutes.get("/logout", logoutCtrl);
userRoutes.get("/:id", userDetailCtrl);

module.exports = userRoutes;
