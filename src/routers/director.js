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
      message: "Thêm đạo diễn thành công",
      values: {
        director,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const directors = await Director.find();
    if (directors) {
      return res.json({
        success: true,
        message: "Lấy danh sách đạo diễn thành công",
        values: { directors },
      });
    }
    return res.json({
      success: false,
      message: "Lấy danh sách đạo diễn thất bại",
      values: { directors: [] },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);
    if (director) {
      return res.json({
        success: true,
        message: "Lấy đạo diễn thành công",
        values: { director },
      });
    }
    return res.json({
      success: false,
      message: "Lấy đạo diễn thất bại",
      values: { director: {} },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

module.exports = router;
