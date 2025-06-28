const connectDB = require("../../db/dbConnect");

async function AddTeam(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('team');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { teammemberName, teammemberrole } = req.body;
        const teammemberImage = req.file?.path;

        if (!teammemberName || !teammemberrole || !teammemberImage) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        await collection.insertOne({
            teammemberName,
            teammemberrole,
            teammemberImage
        });

        return res.status(201).json({ success: true, message: "team member added successfully" });
    } catch (error) {
        console.error("AddTeam.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { AddTeam };
