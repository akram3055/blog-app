const bcrypt = require("bcryptjs");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");
const e = require("express");

//register
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;

  //check if field is empty
  if (!fullname || !email || !password) {
    return res.render("users/register", {
      error: "all fields are require",
    });
  }
  //check if user exist
  try {
    const userFound = await User.findOne({ email });
    //throw an erroe
    if (userFound) {
      return res.render("users/register", {
        error: "user already register",
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    //register the user
    const user = await User.create({
      fullname,
      email,
      password: passwordHashed,
    });
    //redirect
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    res.json(error);
  }
};

//login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  //check if thete is no email password
  if (!email || !password) {
    return res.render("users/login", {
      error: "Email and password fields are required",
    });
  }
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    const validPassword = await bcrypt.compare(password, userFound.password);
    if (!validPassword) {
      return res.render("users/login", {
        error: "Invalid login credentials",
      });
    }
    //save the user login
    req.session.userAuth = userFound._id;

    //redirect
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    res.json(error);
  }
};

//userDetails
const userDetailCtrl = async (req, res) => {
  try {
    
    //get the user id
    const userId = req.params.id;
    //find the user
    const user = await User.findById(userId);

    res.render("users/updateUser", {
      user,
      error:""
    });
  } catch (error) {
    res.json(error);
  }
};
//profile
const profileCtrl = async (req, res) => {
  try {
    //get the user login
    const userID = req.session.userAuth;
    //find the user
    const user = await User.findById(userID)
      .populate("posts")
      .populate("comments");
    res.render("users/profile", { user });
  } catch (error) {
    res.json(error);
  }
};

//upload profile photo
const uploadProfilePhotoCtrl = async (req, res, next) => {
  try {
    //check if file exist
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "Please upload image",
      });
    }
    //1. Find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    //2. check if user is found
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }
    //5.Update profile photo
    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
      }
    );
    //redirect
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};
//profile photo
const coverUploadCtrl = async (req, res) => {
  try {
    if (!req.file) {
      return res.render("users/uploadCoverPhoto", {
        error: "Please upload image",
      });
    }
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    if (!userFound) {
      return res.render("users/uploadCoverPhoto", {
        error: "User not found",
      });
    }
    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true,
      }
    );
    //redirect
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/uploadCoverPhoto", {
      error: error.message,
    });
  }
};
//password update
const passwordUpadateCtrl = async (req, res, next) => {
  const { password } = req.body;

  try {
    if (!password) {
      return res.render("users/updatePassword", {
        error: "please provide details",
        
      });
    }
    //check if the user is updating the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate(
        req.session.userAuth,
        {
          password: passwordHashed,
        },
        {
          new: true,
        }
      );
      res.redirect('/api/v1/users/profile')
      
    }
    //update user
  } catch (error) {
    return res.render("users/uploadPassword", {
      error: error.message,
    });
  }
};

//profileUpdate
const profileUpdateCtrl = async (req, res, next) => {
  const { fullname, email } = req.body;

  try {
    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "please provide details",
        user:""
        
      });
    }
    //if the email is nopt taken
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.render("users/updateUser", {
          error: "email is already taken",
          user:"",
         
          
        });
      }
    }
    //update the user
    await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    return res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/update", {
      error: error.message,
      user: "",
    });
  }
};
//logout
const logoutCtrl = async (req, res) => {
  try {
    //destroy the session
    req.session.destroy(() => {
      res.redirect("/api/v1/users/login");
    });
  } catch (error) {
    res.json(error);
  }
};
module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  coverUploadCtrl,
  passwordUpadateCtrl,
  profileUpdateCtrl,
  logoutCtrl,
};
