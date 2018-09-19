
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

    var html= ejs.render( "email", { user:user,hostname:hostname });

            var mainOptions = {
                from: '"IPROCURE  HUMAN RESOURCE" zadikiochola@gmail.com',
                to: user.Email,
                subject: 'Registration Confirmation',
                html: html
            };
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });

}
