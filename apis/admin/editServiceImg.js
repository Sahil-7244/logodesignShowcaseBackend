const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");
const cloudinary = require("../../cloudinaryConfig");

async function EditServiceImg(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('serviceImage');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { serviceImgId, serviceImgName } = req.body;
        const newserviceImage = req.file ? req.file.path : undefined;

        if (!ObjectId.isValid(serviceImgId)) {
            return res.status(400).json({ success: false, message: "Invalid serviceImg ID!" });
        }

        const existingserviceImg = await collection.findOne({ _id: ObjectId.createFromHexString(serviceImgId) });

        if (!existingserviceImg) {
            return res.status(404).json({ success: false, message: "ServiceImg not found!" });
        }
        let serviceImageUrl = existingserviceImg.serviceImage;

        // If a new image is uploaded, upload it to Cloudinary
        if (newserviceImage) {
            // Delete the old image from Cloudinary (if exists)
            const fullname = serviceImageUrl.split("/").pop().split(".");
            const oldpublicId = "serviceImages/"+fullname.slice(0, fullname.length - 1).join(".") // Extract public_id from URL
     
            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(oldpublicId,(error, result) => {console.log('result :: ', result);});

            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(newserviceImage, {
                folder: "serviceImages",
                public_id: `${Date.now()}-${req.file.originalname}`,
                resource_type: "image",
            });

            // Set new image URL from Cloudinary response
            serviceImageUrl = result.secure_url;
        }

        const updatedserviceImg = {
            serviceImgName: serviceImgName || existingserviceImg.serviceImgName,
            serviceImage: serviceImageUrl, // Cloudinary URL for the service background image
        };

        await collection.updateOne({ _id: ObjectId.createFromHexString(serviceImgId) }, { $set: updatedserviceImg });

        return res.status(200).json({ success: true, message: "serviceImg updated successfully" });
    } catch (error) {
        console.error("EditServiceImg.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { EditServiceImg };
