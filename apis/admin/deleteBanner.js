const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");
// const path = require("path");
// const fs = require("fs");

async function DeleteBanner(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('banner');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { bannerId } = req.body;

        if (!ObjectId.isValid(bannerId)) {
            return res.status(400).json({ success: false, message: "Invalid Banner ID!" });
        }

        // Fetch the bannerimg to get the image path
        const banner = await collection.findOne({ _id: new ObjectId(bannerId) });

        if (!banner) {
            return res.status(404).json({ success: false, message: "bannerimg not found!" });
        }

        // Extract the public_id from the stored image URL
        const bannerImgUrl = banner.bannerImg;
        const fullname = bannerImgUrl.split("/").pop().split(".");
        const publicId = "bannerImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId,(error, result) => {console.log('result :: ', result);});

        // // Define the path to the image
        // const imagePath = path.join(__dirname, "../../images/bannerImages", banner.bannerImg);

        // // Delete the image file if it exists
        // if (fs.existsSync(imagePath)) {
        //     fs.unlinkSync(imagePath);
        // } else {
        //     console.log("Image file does not exist, skipping deletion.");
        // }
        
        const deletedBanner = await collection.deleteOne({ _id: ObjectId.createFromHexString(bannerId) });

        if (deletedBanner.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Banner not found!" });
        }

        return res.status(200).json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        console.error("deleteBanner.js ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { DeleteBanner };
