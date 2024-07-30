import { EMAIL_HOST, EMAIL_USERNAME, EMAIL_PASSWORD, FROM_EMAIL } from '../config';

const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

export const sendEmail = async(email, subject, payload, template) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            service: EMAIL_HOST,
            // port: 465,
            auth: {
                user: EMAIL_USERNAME,
                pass: EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
            },
        });

        const source = fs.readFileSync(path.join(__dirname, template), "utf8");
        const compiledTemplate = handlebars.compile(source);
        const options = {
            from: FROM_EMAIL,
            to: email,
            subject: subject,
            html: compiledTemplate(payload),
        };
        console.log('---- email options: ', options);
        // Send email
        transporter.sendMail(options, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            } else {
                return res.status(200).json({
                    success: true,
                });
            }
        });
    } catch (error) {
        console.log(error);
        return error;
    }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/