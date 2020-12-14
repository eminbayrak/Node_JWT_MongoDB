const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user.js");
require('dotenv').config();

exports.register = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    let user = new User({
        email: req.body.email,
        name: req.body.name,
        password: hashPassword,
        user_type_id: req.body.user_type_id
    })

    user.save((err, registeredUser) => {
        if (err) {
            console.log(err)
        } else {
            // Create payload then Generate an access token
            let payload = { id: registeredUser._id, user_type_id: req.body.user_type_id || 0 };
            const token = jwt.sign(payload, process.env.TOKEN_SECRET);
            res.status(200).send({ token })
        }
    })
}

exports.login = async (req, res) => {
    User.findOne({ email: req.body.email }, async (err, user) => {
        if (err) {
            console.log(err)
        } else {
            if (user) {
                const validPass = await bcrypt.compare(req.body.password, user.password);
                if (!validPass) return res.status(401).send("Password is wrong.");
                // Create and assign token
                let payload = { id: user._id, user_type_id: user.user_type_id };
                const token = jwt.sign(payload, process.env.TOKEN_SECRET);
                res.status(200).header("auth-token", token).send({ "token": token });
            }
            else {
                res.status(401).send('Invalid user.');
            }
        }
    })
}
