const express = require("express");
const multer = require("multer");
const {
  createCtrl,
  postCtrl,
  deleteCtrl,
  detailsCtrl,
  postUpdateCtrl,
} = require("../../controllers/posts/posts");
const postRoutes = express.Router();
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const Post = require("../../model/post/Post");

//instance of multer
const upload = multer({ storage });

//forms
postRoutes.get("/get-post-form", (req, res) => {
  res.render("posts/addPost", { error: "" });
});
postRoutes.get("/get-form-update/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render("posts/updatePost", { post, error: "" });
  } catch (error) {
    res.render("posts/updatePost", { error, post: "" });
  }
});
//post route
postRoutes.post("/", protected, upload.single("file"), createCtrl);

postRoutes.get("/", postCtrl);

postRoutes.get("/:id", detailsCtrl);

postRoutes.delete("/:id", protected, deleteCtrl);

postRoutes.put("/:id", protected, upload.single("file"), postUpdateCtrl);

module.exports = postRoutes;
