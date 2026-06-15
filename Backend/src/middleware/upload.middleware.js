const multer=require('multer')

const storage=multer.diskStorage({
    destination:'/upload',
    filename:(req,fd,callback)=>{
        callback(
            null,
            `${process.env.APP_NAME}` + "-" + fd.originalname
        )
    }
})

module.export=multer({storage})