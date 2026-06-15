const express = require("express");
const upload=require('../middleware/upload.middleware')

const router=express.Router()

router.post('/upload',upload.single("file"))

module.exports = router