const Class = require("../models/Class");

const getTutorClasses = async (req, res) => {
    try {
        const classes = await Class.find({ tutor: req.user.id });
        res.json({ tutorClasses: classes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};



module.exports = { getTutorClasses };
