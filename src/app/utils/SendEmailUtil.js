
import nodemailer from "nodemailer";
import ejs from "ejs";


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'zadiki.ochola@iprocu.re',
        pass: 'NELSONHASSAN1'
    }
});


export const sendEmail = (user,req) => {

    var hostname = req.protocol +"://"+req.get('host');
    console.log(__dirname);
    ejs.renderFile( __dirname+"../../views/email.ejs", { user:user,hostname:hostname }, function (err, data) {

        if (err) {
            console.log("from mail controller",err);
        } else {
            var mainOptions = {
                from: '"IPROCURE  HUMAN RESOURCE" zadikiochola@gmail.com',
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
