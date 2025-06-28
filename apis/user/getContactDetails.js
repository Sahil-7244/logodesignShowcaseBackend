const connectDB = require("../../db/dbConnect");

async function GetContactDetail(req, res) {

    try {
        const db = await connectDB();
        const collection = db.collection("contactDetail");

        const contactDetail = await collection.find().toArray();

        res.status(200).json({
            contactDetail,
            success: true,
            message: "Contact detail fetch Successful",
        });
    } catch (error) {
        console.log("GetContactDetail.js: ",error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { GetContactDetail };
