const mongoose = require("mongoose");

//Schema
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    role:{
      type:String,
      default:'blogger'
    },
    bio:{
      type:String,
      default:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam cupiditate soluta, aperiam unde amet nisi. Repellendus, sequi magnam itaque assumenda facilis repellat doloribus nobis voluptas, quis dolores natus dicta ducimus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam cupiditate soluta, aperiam unde amet nisi. Repellendus, sequi magnam itaque assumenda facilis repellat doloribus nobis voluptas, quis dolores natus dicta ducimus. Lorem ipsum dolor sit amet consectetur adipisicing elit",
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

//compile the schema to form a model
const User = mongoose.model("User", userSchema);

module.exports = User;
