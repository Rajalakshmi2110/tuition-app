const jwt = require('jsonwebtoken');

const protect = (req, res, next)=>{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized to access this route" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verify error", err);
        res.status(401).json({message: "Not authorized to access this route" });
    }
}

module.exports = protect;