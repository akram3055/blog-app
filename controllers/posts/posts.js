const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");

//post create
const createCtrl = async (req, res, next) => {
  const { title, description, category, image, user } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      return res.render("posts/addPost", {
        error: "all fields are required",
      });
    }
    //find the user
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    //create post
    const postCreated = await Post.create({
      title,
      description,
      category,
      user: userFound._id,
      image: req.file.path,
    });
    //push the post created into the array of users post
    userFound.posts.push(postCreated._id);
    //resvae the user
    await userFound.save();
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("posts/addPost", {
      error: error.message,
    });
  }
};

//post list
const postCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comments").populate("user");

    res.json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//postDeleteCtrl
const deleteCtrl = async (req, res) => {
  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //check if the post belonng to the user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render("posts/postDetails",{
      error:"your not authorised ri delete the post",
    post:''})
    }
    const id = req.params.id;
    await Post.findByIdAndDelete(id);
    res.redirect("/api/v1/users/profile")
  } catch (error) {
    return res.render("posts/postDetails",{
      error:error.message,
      post:''
    })
  }
};

//post details
const detailsCtrl = async (req, res, next) => {
  try {
    const id = req.params.id;
    //find the post
    const post = await Post.findById(id).populate({
      path: "comments",
      populate:{
        path:'user'}
    }).populate("user");
    res.render("posts/postDetails", {
      post,
      error: "",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//post update
const postUpdateCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;

  try {
    //find the post
    const post = await Post.findById(req.params.id);
    //check if the post belonng to the user
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return res.render('post/updatePost',{
        post:'',
        error:'your not authorized for this post'
      })
    }
    //checj if the user is updating the image
    if(req.file){
      const id = req.params.id;
   await Post.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        image: req.file.path,
      },
      {
        new: true,
      }
    );
    }else{
      const id = req.params.id;
   await Post.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
       
      },
      {
        new: true,
      }
    );
    }
    
    res.redirect('/')
  } catch (error) {
    return res.render('post/updatePost',{
      post:'',
      error:error.message
    })
  }
};
module.exports = {
  createCtrl,
  postCtrl,
  deleteCtrl,
  detailsCtrl,
  postUpdateCtrl,
};
