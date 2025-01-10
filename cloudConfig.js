const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wanderlust_dev',
      allowedFormats:['png','jpg','jpeg','pdf'],
      public_id: (req, file) => 'computed-filename-using-request',
    },
  });

  module.exports ={
    cloudinary,
    storage
  }