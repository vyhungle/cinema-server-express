import express from "express";
import { getGeoLocation } from "../api/geolocation";
const router = express.Router();

import Cinema from "../models/Cinema";
import { errorCatch } from "../utils/constaints";
import { checkIsEmptyAddress, getCinemaLocation } from "../utils/helper";
import {
  revenueStatistics,
  revenueStatisticsByDate,
  revenueStatisticsMovie,
  revenueYear,
} from "../utils/service";
import { ValidateCinema } from "../utils/validators";
import verifyToken from "../middleware/staff";
import OtpPayment from "../models/OtpPayment";
import { revenueStatisticsByDateV2 } from "../utils/serviceV2";

router.post("/add", async (req, res) => {
  const { name, address } = req.body;
  try {
    const { valid, errors } = ValidateCinema(name, address);
    if (!valid) {
      res.json({
        success: false,
        message: "Tạo rạp phim thất bại",
        errors: errors,
      });
    } else {
      const geo = await getGeoLocation(
        `${address.street}, ${address.ward}, ${address.district}, ${address.city}`
      );
      const { lat, lng } = geo.data.results[0].geometry;
      const cinema = new Cinema({
        name,
        address: {
          ...address,
          lat,
          lng,
        },
      });
      await cinema.save();
      return res.json({
        success: true,
        message: "Thêm rạp phim thành công",
        values: {
          cinema,
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    if (cinemas) {
      return res.json({
        success: true,
        message: "Lấy danh sách rạp phim thành công",
        values: { cinemas },
      });
    }
    return res.json({
      success: false,
      message: "Lấy danh sách rạp phim thất bại",
      values: { cinemas: [] },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Lỗi server 500!",
      errors: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (cinema) {
      return res.json({
        success: true,
        message: "Lấy rạp phim thành công",
        values: { cinema },
      });
    }
    return res.json({
      success: false,
      message: "Lấy rạp phim thất bại",
      error: "id tào lao",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const oldCinema = await Cinema.findById(req.params.id);
    const { name, address } = req.body;

    const { valid, errors } = ValidateCinema(name, address);
    if (!valid) {
      res.json({
        success: false,
        message: "Sửa rạp phim thất bại",
        errors: errors,
      });
    } else {
      if (!checkIsEmptyAddress(oldCinema.address, address)) {
        console.log(checkIsEmptyAddress(oldCinema.address, address));
        const geo = await getGeoLocation(
          `${address.street}, ${address.ward}, ${address.district}, ${address.city}`
        );
        const { lat, lng } = geo.data.results[0].geometry;
        oldCinema.name = name;
        oldCinema.address = { ...address, lat, lng };
      } else {
        oldCinema.name = name;
      }
      await oldCinema.save();
      return res.json({
        success: true,
        message: "Sửa rạp phim thành công",
        values: {
          cinema: oldCinema,
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const cinema = await Cinema.findOneAndDelete({ _id: req.params.id });
    if (cinema) {
      return res.json({
        success: true,
        message: "Xóa rạp phim thành công",
        values: {
          cinema: cinema,
        },
      });
    }
    return res.json({
      success: false,
      message: "Xóa rạp phim thất bại",
      error: "id tào lao",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get/locations", async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    return res.json({
      success: true,
      message: "Lấy danh sách location thành công.",
      values: {
        locations: getCinemaLocation(cinemas),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get/cinema-by", async (req, res) => {
  try {
    const { location } = req.query;
    const cinemas = await Cinema.find();
    return res.json({
      success: true,
      message: "lấy danh sách cinema thành công",
      values: {
        cinemas: cinemas.filter((x) => x.address.city === location),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.post("/get/thong-ke-rap", async (req, res) => {
  const { cinemaId, dateStart, dateEnd } = req.body;
  console.log(cinemaId, dateStart, dateEnd);
  try {
    const data = await revenueStatisticsMovie(cinemaId, dateStart, dateEnd);
    return res.json({
      success: true,
      message: "",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.post("/get/thong-ke-theo-ngay", async (req, res) => {
  const { cinemaId, dateStart, dateEnd } = req.body;
  try {
    const data = await revenueStatisticsByDate(cinemaId, dateStart, dateEnd);
    return res.json({
      success: true,
      message: "",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.post("/get/thong-ke-theo-ngay-v2", async (req, res) => {
  const { cinemaId, dateStart, dateEnd } = req.body;
  try {
    const data = await revenueStatisticsByDateV2(cinemaId, dateStart, dateEnd);
    return res.json({
      success: true,
      message: "",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.post("/get/thong-ke-theo-quy", async (req, res) => {
  const { cinemaId } = req.body;
  try {
    const data = await revenueYear(cinemaId);
    return res.json({
      success: true,
      message: "",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.post("/add-payment", verifyToken, async (req, res) => {
  const { staffId, type } = req;
  const { cinemaId, user, paymentType, otp } = req.body;
  try {
    if (type == 0) {
      const otpMail = await OtpPayment.findOne({ otp, user });
      if (otpMail && (Date.now() > otpMail.dateEX || !otpMail.status)) {
        return res.json({
          success: false,
          message: "Mã xác thực đã hết hạng.",
        });
      } else if (!otpMail) {
        return res.json({
          success: false,
          message: "Mã xác thực không đúng.",
        });
      }
      otpMail.status = false;
      await otpMail.save();

      const cinema = await Cinema.findById(cinemaId);
      const isPayment = cinema.payments.some((x) => x.type == paymentType);
      if (isPayment) {
        return res.json({
          success: false,
          message: "Đã tồn tại hình thức thanh toán này trong rạp.",
        });
      } else {
        cinema.payments.push({
          type: paymentType,
          user,
        });
        await cinema.save();
        return res.json({
          success: true,
          message: "Thêm hình thức thanh toán thành công",
        });
      }
    }
    return res.json({
      success: false,
      message: "Bạn không có quyền truy cập chức năng này.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

module.exports = router;
