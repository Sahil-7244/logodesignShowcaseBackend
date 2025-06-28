const connectDB = require("../../db/dbConnect");

async function GetContactUs(req, res) {

    try {
        const db = await connectDB();
        const collection = db.collection("contactUs");

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const contactUs = await collection.find().toArray();

        if (contactUs.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "contactUs not found" });
        }

        res.status(200).json({
            contactUs,
            success: true,
            message: "Contact Us fetched Successfully",
        });

    } catch (error) {
        console.log("GetContactUs.js: ", error);
        res.status(500).json({ success: false, message: "contactUs fetch Failed" });
    }
}

module.exports = { GetContactUs };
