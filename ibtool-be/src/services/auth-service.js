import { usersDocumentModel, validSSODocumentModel } from '../models/mongo-models';
import { tokenDocumentModel } from "../models/token-model";
import { sendEmail } from "./sendEmail";
import { BCRYPT_SALT, JWT_SECRET, DB_URL } from '../config';

require("dotenv").config();

const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const JWTSecret = JWT_SECRET;
const bcryptSalt = BCRYPT_SALT;
const clientURL = DB_URL;

export const signup = async(data) => {
    console.log('---- signing up user: ', data);
    let user = await usersDocumentModel.findOne({ sso: data.sso });
    if (user) {
        throw new Error("User already exist", 422);
    }
    let validSSO = await validSSODocumentModel.findOne({ sso: data.sso });
    if (!validSSO) {
        throw new Error("sso is not valid", 422);
    }
    user = new usersDocumentModel(data);
    const token = JWT.sign({ id: user._id }, JWTSecret);
    await user.save();
    console.log('----- user created.');
    return (data = {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        TeamName: user.TeamName,
        token: token,
    });
};

export const requestPasswordReset = async(email) => {
    const user = await usersDocumentModel.findOne({ email });
    if (!user) throw new Error("Email does not exist");

    let token = await tokenDocumentModel.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

    await new tokenDocumentModel({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
    }).save();

    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

    sendEmail(
        user.email,
        "Password Reset Request", {
            name: user.firstName,
            link: link,
        },
        './template/requestResetPassword.handlebars',
    );
    return link;
};

export const resetPassword = async(userId, token, password) => {
    let passwordResetToken = await tokenDocumentModel.findOne({ userId });

    if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
        throw new Error("Invalid or expired password reset token");
    }

    const hash = await bcrypt.hash(password, Number(bcryptSalt));

    await usersDocumentModel.updateOne({ _id: userId }, { $set: { password: hash } }, { new: true });

    const user = await usersDocumentModel.findById({ _id: userId });

    sendEmail(
        user.email,
        "Password Reset Successfully", {
            name: user.firstName,
        },
        './template/resetPassword.handlebars',
    );

    await passwordResetToken.deleteOne();

    return true;
};