const jwt = require("jsonwebtoken");

const jwt_secret = process.env.JWT_SECRET;

function authenticate(req, res, next) {
    const authToken = req.headers["auth-token"];
    try {
        const data = jwt.verify(authToken, jwt_secret);
        const id = data.user.id;
        req.user = {id};
        next();
    } catch(err) {
        console.log(err.message);
        res.status(401).json({status: "error", message: "Unauthorized access restricted."});
    }
}

module.exports = authenticate;