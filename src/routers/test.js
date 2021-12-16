import express from "express";
const router = express.Router();
import ShowTimeDetail from "../models/ShowTimeDetail.js";
import haversine from "haversine";
import axios from "axios";
const jwt = require("jsonwebtoken");
import { generateToken } from "../utils/helper";
import request from "supertest";
import { postAPI } from "../api/serverAPI.js";

router.get("/test", async (req, res) => {
  try {
    const start = {
      latitude: 12.721332807604266,
      longitude: 108.23833814598193,
    };

    // 12.721332807604266, 108.23833814598193
    // 10.806698885168837, 106.62894702634684

    const end = {
      latitude: 10.823126287256677,
      longitude: 106.6453205934414,
    };
    // 10.823126287256677, 106.6453205934414
    // 10.768521579380778, 10.823126287256677
    res.json({
      km: haversine(start, end, { unit: "km" }),
      meter: haversine(start, end, { unit: "meter" }),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.post("/test-momo", async (req, res) => {
  const data = req.body;
  const tokenOrder = generateToken(data);

  var partnerCode = "MOMOB8LF20211028";
  var accessKey = "b8xE4uNzTm61kBbw";
  var secretkey = "nR3w7l6cJIuUotsZVLxuwYFmIriG47Bk";
  var requestId = partnerCode + new Date().getTime();
  var orderId = requestId;
  var orderInfo = "kso shshs";
  var redirectUrl = `http://localhost:4000/api/test/order-payment&token=${tokenOrder}`;
  var ipnUrl = "https://callback.url/notify";
  var amount = "50000";
  var requestType = "captureWallet";
  var extraData = ""; //pass empty value if your merchant does not have stores
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;
  //puts raw signature
  //signature
  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");


  const requestBody = {
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "vi",
  };

  const response = await axios.post(
    "https://test-payment.momo.vn/v2/gateway/api/create",
    requestBody
  );
  return res.json({
    data: response.data,
  });
});

router.post("/check-status", async (req, res) => {
  const data = req.body;
  const { orderId, requestId } = req.body;
  const { resultCode } = req.query;

  var partnerCode = "MOMOB8LF20211028";
  var accessKey = "b8xE4uNzTm61kBbw";
  var secretkey = "nR3w7l6cJIuUotsZVLxuwYFmIriG47Bk";
  var rawSignature =
    "accessKey=" +
    accessKey +
    "&orderId=" +
    orderId +
    "&partnerCode=" +
    partnerCode +
    "&requestId=" +
    requestId;

  //puts raw signature
  //signature
  const crypto = require("crypto");
  var signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");


  const requestBody = {
    partnerCode: partnerCode,
    requestId: requestId,
    orderId: orderId,
    signature: signature,
    lang: "vi",
  };

  const response = await axios.post(
    "https://test-payment.momo.vn/v2/gateway/api/query",
    requestBody
  );
  if (response.resultCode == 0) {
  }
  return res.json({
    data: response.data,
  });
});

router.get("/order-payment", async (req, res) => {
  const { token } = req.query;
  const client = request(req.app);
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const isOrder = postAPI(client, "/api/ticker/add", decoded);
    res.json(isOrder);
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
});

module.exports = router;
