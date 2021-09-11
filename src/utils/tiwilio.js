const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;
const tiwilioPhone = process.env.PHONE_NUMBER;

const client = require("twilio")(accountSid, authToken);

export const sendMessage = (code, phone) => {
  client.messages
    .create({
      body: `Cinema Online - Mã xác thực OTP của Quý khách là: ${code}`,
      from: tiwilioPhone,
      to: phone,
    })
    .then((message) => {
      console.log("Send Message Success id: ", message.sid);
    });
};
