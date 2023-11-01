require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const userRoutes = require("./routes/users/Users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalHandler");
const Post = require("./model/post/Post");
const { truncatePost } = require("./utils/helpers");


require("./config/dbConnect");
const app = express();

//helpers
app.locals.tuncatePost=truncatePost;

//middlewares
//configure ejs
app.set("view engine", "ejs");
//server static files
app.use(express.static(__dirname, +"/public"));

//routes
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //pass form data

// method override
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, //1day
    }),
  })
);

//save the login user into locals
app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

//render home page
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.render("index", { posts });
  } catch (error) {
    res.render("index", { error: error.message });
  }
});

//post/api/v1/user/register
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use(globalErrHandler);

//post/api/v1/user/login
// app.post("/api/v1/user",userRoutes)
// //get/api/v1/user/:id
// app.get("/api/v1/user/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"User details"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })

// //get/api/v1/user/profile/:id
// app.get("/api/v1/user/profile/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"User Details"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })

// //put/api/v1/user/profile-photo-upload/:id
// app.put("/api/v1/user/profile-photo-upload/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"User profile image upload"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })
//put/api/v1/user/cover-photo-upload/:id
// app.put("/api/v1/user/cover-photo-upload/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"User cover image upload"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })

// //put/api/v1/user/update-password/:id
// app.put("/api/v1/user/update-password/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"User password update"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })

// //put/api/v1/user/update/:id
// app.put("/api/v1/user/update/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"User update"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })

//put/api/v1/user/logout
// app.get("/api/v1/user/logout",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"User logged out"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })

//post route

// //post/api/v1/posts

// //get/api/v1/posts
// app.get("/api/v1/posts",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"post list"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })

// //get/api/v1/posts/:id
// app.get("/api/v1/posts/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"post details"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })
// //delete/api/v1/posts/:id
// app.delete("/api/v1/posts/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"post deleted"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })
// //delete/api/v1/posts/:id
// app.put("/api/v1/posts/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"post updated"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })

//comments

//post/api/v1/comments
// app.post("/api/v1/comments",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"comments created"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })

// //get/api/v1/comments/:id
// app.get("/api/v1/comments/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"comments details"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })
// //delete/api/v1/comments/:id
// app.delete("/api/v1/comments/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"comment deleted"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })
// //delete/api/v1/comments/:id
// app.put("/api/v1/comments/:id",async(req,res)=>{
//     try{
//         res.json({
//             status:"success",
//             user:"post updated"
//         })

//     }catch(error){
//         res.json(error);
//     }
// })

//Error handler middlewares
//listen server
const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`Servver is running on PORT ${PORT}`));
