import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'zadiki.ochola@iprocu.re',
        pass: 'NELSONHASSAN1'
    }
});


export const sendEmail = (user, confirmationurl) => {
    var url = confirmationurl;

    var dirname = __dirname.split(path.sep).reverse()[2];

    ejs.renderFile(dirname + "/app/views/email.ejs", {user: user, hostname: process.env.CLIENT_HOST,url}, function (err, data) {

        if (err) {
            console.log("from mail controller", err);
        } else {
            var mainOptions = {
                from: '"EMLAK.COM HUMAN RESOURCE" zadikiochola@gmail.com',
                to: user.Email,
                subject: 'Registration Confirmation',
                html: data
            };
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }

    });

}
