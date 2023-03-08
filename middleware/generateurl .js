const generateUrl = ()=>{
    let random = " ";
    let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstunvwxyz0123456789";
    for(let i=0; i < 5; i++){
       random += char.charAt(
        Math.floor(Math.random()*char.length)
       )
       

    }
    return random


}

module.exports = generateUrl