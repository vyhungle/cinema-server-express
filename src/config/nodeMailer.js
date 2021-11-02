import hbs from "nodemailer-handlebars";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cinema77.2021@gmail.com", // generated ethereal user
    pass: "ABC@123456", // generated ethereal password
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

export const mailOption = {
  form: process.env.EMAIL_USER,
  to: "lnhv.26112000@gmail.com",
  subject: "Xác minh địa chỉ email của bạn",
  template: "verify",
  context: {
    link: "youtobe.com",
  }, // send extra values to template
};
