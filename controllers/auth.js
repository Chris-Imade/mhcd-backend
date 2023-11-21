const { genPassword, validatePass } = require("../lib/passwordUtils");
const User = require("../schemas/User");
const jwt = require("jsonwebtoken");

const registerUser = async(req, res, next) => {

    const { password, ...rest } = req.body;

    try {
        const { salt, hash } = genPassword(password);

        const userCred = {
            salt,
            hash,
            ...rest
        }

        const userInstance = new User(userCred);
        
        await userInstance.save({ new: true });
        res.status(201).json({ message: "Success", status: 201, detail: "User successfully created" });
    } catch (error) {
        next(error); 
    }

}

const loginUser = (req, res, next) => {
    const { username, password } = req.body;

    User.findOne({ username }).then((user) => {
        // compare passwords match
        const isValid = validatePass(password, user.hash, user.salt);


        if(isValid) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin, email: user.email }, process.env.JWT_SECRET);
            res.status(200).json({ message: "Success", status: 200, details: "User successfully logged in 😇", token });
        }

        if(!isValid) {
            // return an error 
            res.status(401).json({ message: "Failed", status: 401, details: "Invalid Credentials" });
        }
    }).catch((err) => {
        next(err);
    })
}

module.exports = {
    registerUser,
    loginUser
}