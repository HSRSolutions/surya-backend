const multer = require('multer');
const multers3 = require("multer-s3-transform");
const AWS =  require('aws-sdk');

const config = require('../config/s3.config');

const S3 = new AWS.S3(
   {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
   }
);

const upload = multer({
    storage: multers3({
        s3: S3,
        bucket: config.AWS_BUCKET_NAME,
        // acl: 'public-read',
        key: function(req, file, cb){
            if(file.fieldname == 'video'){
                cb(null, "video/" + file.originalname);
            }
            if(file.fieldname == 'images'){
                cb(null, "images/"+file.originalname);
            }
        }
    })
});


module.exports = upload.fields([
    {
        name: 'video', maxCount: 1
    },
    {
        name: 'images', maxCount: 9
    }
]);