const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWellcomeEmail = (email, name) => {
    sgMail.send({
        // to: 'cherenettekelmariam@gmail.com',
        to: email,
        from: 'behaylugule@gmail.com',
        subject: 'this is my first email',
        text: `${name} wellcome to task manager.thanks for using our app`

    })
}
const sendCancelationEmail = (email, name) => {
    sgMail.send({
        // to: 'cherenettekelmariam@gmail.com',
        to: email,
        from: 'behaylugule@gmail.com',
        subject: 'this is my first email',
        text: `${name}, your account have been deleted, goodbay`
    })
}
module.exports = {
    sendWellcomeEmail,
    sendCancelationEmail
}