const connectDB = require("../../db/dbConnect");

async function ContactUs(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection("contactUs");

        const { username, email, subject, message } = req.body;

        if (!username || !email || !subject || !message) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields!" });
        }

        await collection.insertOne({
            username,
            email,
            subject,
            message,
            date: new Date(),
        });

        return res
            .status(201)
            .json({ success: true, message: "Message sent successfully" });

    } catch (error) {
        console.error("ContactUs.js: ", error);
        return res
            .status(500)
            .json({ success: false, error: "Something went wrong" });
    }
}

module.exports = { ContactUs };
