import express from "express";
const router = express.Router();
import Director from "../models/Director";

router.post("/add", async (req, res) => {
  const {
    name,
    dateOfBirth,
    image,
    joinDate,
    address,
    phoneNumber,
    email,
    introduce,
    male,
  } = req.body;

  try {
    const director = new Director({
      name,
      dateOfBirth,
      image,
      joinDate,
      address,
      phoneNumber,
      email,
      introduce,
      male,
    });
    await director.save();
    return res.json({
      success: true,
      message: "Thêm diễn viên thành công",
      values: {
        director,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const directors = await Director.find();
    if (directors) {
      return res.json({
        success: true,
        message: "Lấy danh sách diễn viên thành công",
        values: { directors },
      });
    }
    return res.status(400).json({
      success: false,
      message: "Lấy danh sách diễn viên thất bại",
      values: { directors: [] },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    if (director) {
      return res.json({
        success: true,
        message: "Lấy diễn viên thành công",
        values: { director },
      });
    }
    return res.status(400).json({
      success: false,
      message: "Lấy diễn viên thất bại",
      values: { director: {} },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server!",
      error: error.message,
    });
  }
});

module.exports = router;
