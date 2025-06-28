const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");

async function EditCarouselImg(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('carouselImage');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { carouselImgId, carouselImgName } = req.body;
        const newcarouselImage = req.file ? req.file.path : undefined;

        if (!ObjectId.isValid(carouselImgId)) {
            return res.status(400).json({ success: false, message: "Invalid carouselImg ID!" });
        }

        const existingcarouselImg = await collection.findOne({ _id: ObjectId.createFromHexString(carouselImgId) });

        if (!existingcarouselImg) {
            return res.status(404).json({ success: false, message: "carouselImg not found!" });
        }
// If a new image is uploaded, upload to Cloudinary and delete the old one
        let carouselImgUrl = existingcarouselImg.carouselImage;
        if (newcarouselImage) {
            // Delete old image from Cloudinary (if exists)
            const fullname = carouselImgUrl.split("/").pop().split(".");
            const oldpublicId = "carouselImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL
     
            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(oldpublicId,(error, result) => {console.log('result :: ', result);});

            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(newcarouselImage, {
                folder: "carouselImages",
                public_id: `${Date.now()}-${req.file.originalname}`,
                resource_type: "image",
            });

            // Set new image URL from Cloudinary response
            carouselImgUrl = result.secure_url;
        }

        const updatedcarouselImg = {
            carouselImgName: carouselImgName || existingcarouselImg.carouselImgName,
            carouselImage: carouselImgUrl,
        };

        await collection.updateOne({ _id: ObjectId.createFromHexString(carouselImgId) }, { $set: updatedcarouselImg });

        return res.status(200).json({ success: true, message: "carouselImg updated successfully" });
    } catch (error) {
        console.error("EditcarouselImg.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { EditCarouselImg };
