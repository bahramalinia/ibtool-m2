import {
    signup,
    requestPasswordReset,
    resetPassword,
} from "../services/auth-service";
import {
    usersDocumentModel,
} from '../models/mongo-models';
const bcrypt = require("bcrypt");

export const loginController = async(req, res) => {
    console.log('----- login request: ', req.body);
    let user = await usersDocumentModel.findOne({ sso: req.body.sso });
    console.log('------ user: ', user);
    if (!user) {
        res.statusCode = 400;
        return res.json({ status: 'fail', message: 'incorrect sso and/or password' });
    }
    bcrypt.compare(req.body.password, user.password, function(err, match) {
        if (err) {
            console.log('--- error: ', err);
        }
        if (match) {
            return res.status(200).json({ status: 'success' });
        } else {
            // response is OutgoingMessage object that server response http request
            return res.status(404).json({ status: 'fail' });
        }
    });
};

export const signUpController = async(req, res) => {
    const signupService = await signup(req.body);
    return res.json(signupService);
};

export const resetPasswordRequestController = async(req, res, next) => {
    const requestPasswordResetService = await requestPasswordReset(
        req.body.email
    );
    return res.json(requestPasswordResetService);
};

export const resetPasswordController = async(req, res, next) => {
    const resetPasswordService = await resetPassword(
        req.body.userId,
        req.body.token,
        req.body.password
    );
    return res.json(resetPasswordService);
};

export const comparePassWithBcrypt = (pass, dbPass) => {

}