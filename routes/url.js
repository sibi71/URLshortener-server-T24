const router = require("express").Router()
const Url = require("../models/url");
const generateUrl = require("../middleware/generateurl ")


router.get("/",async(req,res)=>{
    res.json({msg:"route is working on url"})
})

router.post("/create",async(req,res)=>{

    const createURL  = await Url.create({
        longurl:req.body.longUrl,
        shorturl:generateUrl()
    });
    res.json("data is save for DB")
})


router.get("/data",async(req,res)=>{
    const dataURL= await Url.find()
    res.json(dataURL)
})



router.get("/delete/:did",async(req,res)=>{
//     await Url.findByIdAndDelete({_id:req.params.id},(data,err)=>{
//     if(err){
//         res.json({msgerr:err});
//     }
//     res.json({msg:"remove"});
//    })
const delid = req.params.did
// const delid = false
const url = await Url.findByIdAndDelete(delid)
if(url){
    res.json({msg:"ok"})
}else{
    res.json({msg:"no data"})
}
// res.json({msg:req.params.id})
 
    
  
    
   
})

module.exports = router