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
    to: email,
    subject: "Xác minh địa chỉ email của bạn",
    template: "verifyLogin",
    context: {
      link: link,
    }, // send extra values to template
  };
};

export const mailOptionPayment = (email, payment, name, user, date, price) => {
  return {
    form: process.env.EMAIL_USER,
    to: email,
    subject: "Thanh toán dịch vụ thành công",
    template: "paymentBill",
    context: {
      payment,
      name,
      user,
      date,
      price,
    },
  };
};

export const mailOptionOtp = (email, payment, name, otp) => {
  return {
    form: process.env.EMAIL_USER,
    to: email,
    subject: "Mã xác thực",
    template: "otp",
    context: {
      email,
      payment,
      name,
      otp,
    },
  };
};

export const mailOptionInvite = (email, cinema, address, link) => {
  return {
    form: process.env.EMAIL_USER,
    to: email,
    subject: "Thư mời làm xác nhận việc",
    template: "inviteJob",
    context: {
      email,
      cinema,
      address,
      link,
    },
  };
};

export const mailOptionSendPassword = (name, email, password) => {
  return {
    form: process.env.EMAIL_USER,
    to: email,
    subject: "Gửi mật khẩu truy cập",
    template: "sendPassword",
    context: {
      name,
      email,
      password,
    },
  };
};
