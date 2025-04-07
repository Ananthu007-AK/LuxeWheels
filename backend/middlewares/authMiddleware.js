const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: 'Access Denied: No token provided' });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decoded.userId, role: decoded.role }; // Set req.user
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ error: 'Invalid Token: Token is either expired or malformed' });
    }
}

module.exports = verifyToken;