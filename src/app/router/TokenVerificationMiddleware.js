import jwt from "jsonwebtoken";

function tokenVerificationMiddleware(req, res, next) {

    const header = req.headers.authorization;

    let token;
    if (header) token = header.split(" ")[1].trim();
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({"msg": err.message})
        }
        let exp = new Date();
        let time = exp.getTime() / 1000;
        if (decoded.exp <= time) {
            return res.status(401).json({"msg": "invalid token"});
        }
        req.user=decoded;
        return next()
    });
}

export default tokenVerificationMiddleware