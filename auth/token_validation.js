const jwt = require("jsonwebtoken");
const fs = require("fs");

const publicKey = fs.readFileSync("./public.key", "utf-8");

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get("authorization");
        token = token.slice(7);
        console.log(req.body.email);
        let decoded = jwt.verify(token, publicKey, {
            expiresIn: "1h",
            algorithm: "RS256"
        });
        console.log("Decoded: ", JSON.stringify(decoded));
        if(token) {
            jwt.verify(token, publicKey, (err, decoded) => {
                if(err) {
                    res.json({
                        success: 0,
                        message: "Invalid token",
                        error: err
                    });
                } else {
                    next();
                }
            })
        } else {
            return res.json({
                success: 0,
                message: "Access denied! Unauthorized user."
            })
        }
    }
}