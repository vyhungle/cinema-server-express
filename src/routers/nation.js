import express from "express";
const router = express.Router();
import Nation from "../models/Nation";

router.post("/add", async (req, res) => {
  const { name } = req.body;

  try {
    const nation = new Nation({
      name,
    });
    await nation.save();
    return res.json({
      success: true,
      message: "Thêm quốc gia thành công",
      values: {
        nation,
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
    const nations = await Nation.find();
    if (nations) {
      return res.json({
        success: true,
        message: "Lấy danh sách quốc gia thành công",
        values: { nations },
      });
    }
    return res.json({
      success: false,
      message: "Lấy danh sách quốc gia thất bại",
      values: { languages: [] },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const nation = await Nation.findById(req.params.id);
    if (nation) {
      return res.json({
        success: true,
        message: "Lấy quốc gia thành công",
        values: { nation },
      });
    }
    return res.json({
      success: false,
      message: "Lấy quốc gia thất bại",
      values: { nation: {} },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

module.exports = router;
