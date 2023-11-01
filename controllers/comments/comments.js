const Comment = require("../../model/comment/Comment");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const appErr = require("../../utils/appErr");



//create comment
const commentcreatectrl=async (req,res,next)=>{
    const {message}=req.body;
    try{
        //find the post
        const post =await Post.findById(req.params.id);
        //create the comments
        const comment=await Comment.create({
            user:req.session.userAuth,
            message,
            post:post._id,
        });
        //push the comments
        post.comments.push(comment._id);
        //find the user
        const user=await User.findById(req.session.userAuth);
        //push the comments to the user
        user.comments.push(comment._id);
        //disable the validation
        //save
        await post.save({validateBeforeSave:false});
        await user.save({validateBeforeSave:false});
        res.redirect(`/api/v1/posts/${post._id}`)

    }catch(error){
       res.json(error)
    }
}
//detele comment
const commentdeletectrl=async (req,res,next)=>{
    try{
        //find the post
    const comment =await Comment.findById(req.params.id);
    //check if the post belonng to the user
    if(comment.user.toString() !==req.session.userAuth.toString()){
       return next(appErr("you r not allowed to delete this comment",403));
    }
   const id=req.params.id;
   await Comment.findByIdAndDelete(id)
   res.redirect(`/api/v1/posts/${req.query.postId}`)
    }catch(error){
        res.json(error);
    }
}

//detele comment
const commentdetailctrl=async (req,res,next)=>{

    try{
        const comment=await Comment.findById(req.params.id)
        res.render('comments/updateComment',{
        comment,
        error:""})

    }
   
    

    catch(error){
        res.render('comments/updateComment',{
            
            error:error.message})
    }
}

//comment update
const commentUpdateCtrl=async (req,res,next)=>{
    try{
        
        //find the post
        const comment =await Comment.findById(req.params.id);
        if (!comment) {
            return next(appErr("Comment Not Found"));
          }
         //check if the post belonng to the user
        if(comment.user.toString() !==req.session.userAuth.toString()){
            return next(appErr("you r not allowed to delete this comment",403));
        }
        const id=req.params.id
        const updateComment=await Comment.findByIdAndUpdate(id,{
            message:req.body.message,
        },
        {
            new:true,
        });
        res.json({
            success:'updated successfully',

        })

    }catch(error){
        next(appErr(error.message))
    }
}

module.exports={
    commentcreatectrl,
    commentdeletectrl,
    commentdetailctrl,
    commentUpdateCtrl

}