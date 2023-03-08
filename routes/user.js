const router = require("express").Router()
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const  User  = require("../models/user")
const verifyToken = require("../middleware/verifyToken")

router.get("/",(req,res)=>{
    res.json({msg:"route is working on user"})

})

router.post("/signup",async(req,res)=>{

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:passwordHash,

    })
    const token = jwt.sign({id: user._id},process.env.SECRET_KEY)
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"thetemp24@gmail.com",
            pass:process.env.MAIL_PWD,
        },
    });
    let info = await transporter.sendMail({
        from:"URL Short Team <thetemp24@gmail.com>",
        to:req.body.email,
        subject:"Verify your Email - URL Short Team",
        html:`
        <div>
        <strong>${req.body.name}</strong> we welcome to our platform.
        <a href="https://gentle-maamoul-45fa1c.netlify.app/user/verify/${token}">Verify Email </a>
        <div>
        <p>Thanks and Regards</p>
        <p> From URLShort Team </p>
        </div>
        </div>
        `,
    });
        if(info){
            console.log(info);
        }
        res.json({msg:"Account created successfully. please verify your email "})

})

router.post("/login",async(req,res)=>{
    let { email,password} = req.body;

    const result = await User.findOne({email:email});

    if(result){
        if(result.verified){
                bcrypt.compare(password, result.password).then((passwordResult)=>{
                    if(passwordResult){
                            jwt.sign({userId:result._id},process.env.SECRET_KEY,(err,token)=>{
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    return res.json({
                                        success:true,
                                        msg:"login successful",
                                        token
                                    })
                                }
                            });
                    }
                    else{
                        return res.json({success:false,msg:"incorrect password"});
                    }
                });
        }
        else{
            return res.json({success:false,msg:"Please verify your email"});

        }

    }else{
        return res.json({success:false,msg:"User not registered"});
    }
})

router.get("/data",verifyToken,(req,res)=>{
    return res.json(req.user)

})

router.get("/verify/:token",async(req,res)=>{
    const token = jwt.verify(req.params.token,process.env.SECRET_KEY,async(err,decoded)=>{
        if(err){
            return res.json({msg:"Link expired",success:false})
        }
        const id = decoded.id ;
        await User.findByIdAndUpdate(id, {verified:true});
        return res.json({msg:"Account verified successfully", success:true})

    })
})
router.post("/fwd", async (req,res)=>{
    try {
        const users = await User.findOne({email:req.body.email})

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"thetemp24@gmail.com",
                pass:process.env.MAIL_PWD,
            },
        });
       
        const info = await transporter.sendMail({
            from:"Short URL Team <thetemp24@gmail.com>",
            to:req.body.email,
            subject:"Reset Password - Short URL Team",
            html:`
            <div>
            we welcome to our platform.
            <a  href="https://gentle-maamoul-45fa1c.netlify.app/reset/:${req.body.email}">Reset Password..</a>
            <div>
            <p>Thanks and Regards</p>
            <p> From Short URL Team </p>
            </div>
            </div>
            `
        });     
      
            res.json({msg:"please check out your email"})

    } catch (error) {
        
    }
})
router.put("/update/:email",async (req,res)=>{
    User.findOne({email:req.params.email})
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
     await User.findOneAndUpdate(req.body.email,
    {
         password:password,
    },
     {new:true}
    );
        res.json("successfully resetpassword ");
    })

module.exports = router