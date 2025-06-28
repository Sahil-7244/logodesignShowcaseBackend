// const fs = require("fs");
// const path = require("path");
const connectDB = require("../../db/dbConnect");
const cloudinary = require("../../cloudinaryConfig");

async function AddServiceImg(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('serviceImage');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { serviceImgName } = req.body;
        const serviceImage = req.file?.path;

        if (!serviceImgName || !serviceImage) {
            if (serviceImage) {
                const fullname = serviceImage.split("/").pop().split(".");
                const publicId = "serviceImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

                // Delete the image from Cloudinary
                await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});
            }
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }
     
        const serviceexist= await collection.findOne();
        if(serviceexist){
            // If service image already exists, delete the uploaded file
        const fullname = serviceImage.split("/").pop().split(".");
        const publicId = "serviceImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});
        return res.status(400).json({ success: false, message: "servicebgImg exists to you can't add another servicebgImg!" });
        }
        
        await collection.insertOne({
            serviceImgName,
            serviceImage,
            status: "active",
        });

        return res.status(201).json({ success: true, message: "serviceImg added successfully" });
    } catch (error) {
        console.error("AddCategories.js: ", error);
        if (req.file?.path) {
            const serviceImgUrl = req.file?.path; // Assuming this field contains the Cloudinary URL
        const fullname = serviceImgUrl.split("/").pop().split(".");
        const publicId = "serviceImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});
        }
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { AddServiceImg };
