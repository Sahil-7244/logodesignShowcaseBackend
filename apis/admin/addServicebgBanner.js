const connectDB = require("../../db/dbConnect");
const cloudinary = require("../../cloudinaryConfig");
// const fs = require("fs");
// const path = require("path");


async function AddServicebgBanner(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('servicebgImage');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { servicebgImgName } = req.body;
        const servicebgImage = req.file?.path;

        if (!servicebgImgName || !servicebgImage) {
            // Delete the uploaded file if validation fails
            if (servicebgImage) {
                const fullname = servicebgImage.split("/").pop().split(".");
                const publicId = "serviceImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

                // Delete the image from Cloudinary
                await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});
            }
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }
        
        const servicebgexist= await collection.findOne();
            if(servicebgexist){
            // Delete the uploaded file if a duplicate entry exists
            const fullname = servicebgImage.split("/").pop().split(".");
            const publicId = "serviceImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});
            return res.status(400).json({ success: false, message: "servicebgImg exists so you can't add another servicebgImg!" });
        }
        
        await collection.insertOne({
            servicebgImgName,
            servicebgImage,
            status: "active",
        });

        return res.status(201).json({ success: true, message: "servicebgImg added successfully" });
    } catch (error) {
        console.error("AddservicebgImg.js: ", error);
        // Delete the uploaded file if an error occurs
        if (req.file?.path) {
            const servicebgImage = req.file?.path;
            const fullname = servicebgImage.split("/").pop().split(".");
            const publicId = "serviceImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});
        }
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { AddServicebgBanner };
