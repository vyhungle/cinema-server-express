import hbs from "nodemailer-handlebars";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      partialsDir: "./src/templates/",
      defaultLayout: "",
    },
    viewPath: "./src/templates/",
    extName: ".hbs",
  })
);

export const mailOption = (email, link) => {
  return {
    form: process.env.EMAIL_USER,
    to: "lnhv.26112000@gmail.com",
    subject: "Xác minh địa chỉ email của bạn",
    template: "verifyLogin",
    context: {
      link: "youtobe.com",
    }, // send extra values to template
  };
};
