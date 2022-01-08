import express from "express";
import { getGeoLocation } from "../api/geolocation";
const router = express.Router();

import Cinema from "../models/Cinema";
import { errorCatch } from "../utils/constaints";
import { checkIsEmptyAddress, getCinemaLocation } from "../utils/helper";
import {
  getBillByMonth,
  revenueStatisticsMovie,
  revenueYear,
  thongKeRapTheoQuy,
  thongKeTheoNgay,
} from "../utils/service";
import { ValidateCinema } from "../utils/validators";
import verifyToken from "../middleware/staff";

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
        cinemas: cinemas.filter(
          (x) => x.address.city === location.toString().trim()
        ),
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

router.post("/get/thong-ke-phim-theo-rap", async (req, res) => {
  const { cinemaId, dateStart, dateEnd, movieId } = req.body;
  try {
    const data = await revenueStatisticsMovie(
      cinemaId,
      dateStart,
      dateEnd,
      movieId
    );
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

router.get("/get/thong-ke-theo-quy", async (req, res) => {
  const { cinemaId, year } = req.query;
  const dateNow = new Date();
  try {
    const data = await revenueYear(cinemaId, year || dateNow.getFullYear());
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

router.get("/get/thong-ke-all-rap-theo-quy", async (req, res) => {
  try {
    const { year } = req.query;
    const dateNow = new Date();

    const data = await thongKeRapTheoQuy(year || dateNow.getFullYear());
    return res.json({
      success: true,
      message: "thống kê tạp thành công",
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

router.get(
  "/get/thong-ke-doanh-thu-theo-ngay",
  verifyToken,
  async (req, res) => {
    try {
      const { type, staffId, cinema } = req;
      console.log(type)
      const { date } = req.query;
      let staffIdFilter = undefined;
      if (type == 2) {
        staffIdFilter = staffId;
      }
      return res.json({
        success: true,
        message: "Thống kê thành công",
        values: await thongKeTheoNgay(cinema, date, staffIdFilter),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: errorCatch,
        errors: error.message,
      });
    }
  }
);
router.get(
  "/get/thong-ke-doanh-thu-theo-thang",
  verifyToken,
  async (req, res) => {
    const { cinema } = req;
    try {
      const { month, year } = req.query;
      return res.json({
        success: true,
        message: "Thống kê thành công",
        values: await getBillByMonth(month, year, cinema),
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: errorCatch,
        errors: error.message,
      });
    }
  }
);

module.exports = router;
