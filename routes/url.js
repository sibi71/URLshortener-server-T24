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

const delid = req.params.did

const url = await Url.findByIdAndDelete(delid)
if(url){
    res.json({msg:"ok"})
}else{
    res.json({msg:"no data"})
}

 
    
  
    
   
})

module.exports = router