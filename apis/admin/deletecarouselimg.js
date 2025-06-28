const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");
// const path = require("path");
// const fs = require("fs");

async function DeleteCarouselImg(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('carouselImage');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { carouselImgId } = req.body;

        if (!ObjectId.isValid(carouselImgId)) {
            return res.status(400).json({ success: false, message: "Invalid carouselImage ID!" });
        }

        // Fetch the carouselimg to get the image path
        const carousel = await collection.findOne({ _id: new ObjectId(carouselImgId) });

        if (!carousel) {
            return res.status(404).json({ success: false, message: "carouselimg not found!" });
        }

        // Extract the public_id from the stored Cloudinary image URL
        const carouselImgUrl = carousel.carouselImage; // Assuming this field contains the Cloudinary URL
        const fullname = carouselImgUrl.split("/").pop().split(".");
        const publicId = "carouselImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});
        
        const deletedcarouselImg = await collection.deleteOne({ _id: new ObjectId(carouselImgId) });

        if (deletedcarouselImg.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "carouselImg not found!" });
        }

        return res.status(200).json({ success: true, message: "carouselImg deleted successfully" });
    } catch (error) {
        console.error("DeletecarouselImage.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { DeleteCarouselImg };
