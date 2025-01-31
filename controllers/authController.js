const User = require("../models/user");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../utils/asyncWrapper");

const createToken = (payload) => {
    return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE_TIME });
}

exports.signup = asyncWrapper(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    const isExist = await User.findOne({ email: req.body.email })
    if(isExist) return next(new ApiError(process.env.EMAIL_ALREADY_IN_USE, 400))
    return res.status(201).json({ data: user })
});

exports.login = asyncWrapper(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new ApiError(process.env.INVALID_CREDENTIALS, 401));
    
    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) return next(new ApiError(process.env.INVALID_CREDENTIALS, 401))
    
    const token = createToken(user._id)
    res.cookie("access_token", `Bearer ${token}`, {
        httpOnly: true,
        secure: false,
        sameSite: true,
        withCredentials: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ data: user })

});

exports.logoutCtrl = asyncWrapper(async (req, res) => {
    res.clearCookie("access_token");
    
    await res.send({ success: true });
});

exports.getCurrentUserCtrl = asyncWrapper(async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(404).json({ success: false, error: "user not found." })
    await res.status(200).json({ success: true, data: user });
});