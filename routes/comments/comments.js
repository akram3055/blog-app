const express=require("express");
const multer = require("multer");
const { commentcreatectrl,
    commentdeletectrl,
    commentdetailctrl,
    commentUpdateCtrl
 } = require("../../controllers/comments/comments")
 const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");

const commentRoutes=express.Router()

commentRoutes.post("/:id",protected,commentcreatectrl)

commentRoutes.get("/:id",commentdetailctrl)



commentRoutes.delete("/:id",protected,commentdeletectrl)

commentRoutes.put("/:id",protected,commentUpdateCtrl)

module.exports=commentRoutes;