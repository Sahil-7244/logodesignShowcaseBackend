const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
// cloudinary.config({
//     cloud_name: 'de6hjewio', // Replace with your Cloudinary cloud name
//     api_key: '413134492531275',       // Replace with your API key
//     api_secret: 'lIK1K7_qPwa7Mzi9DHV7PcWH7FQ', // Replace with your API secret
// });
cloudinary.config({
    cloud_name: 'dunwmbapt', // Replace with your Cloudinary cloud name
    api_key: '428332598992682',       // Replace with your API key
    api_secret: 'qNN6ISffDav-3NFcP_iNT4HwzmA', // Replace with your API secret
});

module.exports = cloudinary;