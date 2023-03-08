const router = require("express").Router()
const urlRoute = require("./url")
const userRoute = require("./user")


router.use("/url" , urlRoute)
router.use("/user",userRoute)


module.exports = router