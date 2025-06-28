const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewTeam(req, res) {
    try {
        const db = await connectDB();
        const teammembercollection = db.collection("team");

        const team = await teammembercollection.find().toArray();

        if (team.length === 0) {
            return res.status(400).json({ success: false, message: "team not found" });
        }

        res.status(200).json({
            team,
            success: true,
            message: "team fetch Successful",
        });
    } catch (error) {
        console.log("Viewteam.js: ", error);
        res.status(500).json({ success: false, message: "Enquiries fetch Failed" });
    }
}

module.exports = { ViewTeam };
