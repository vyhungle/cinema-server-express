import express from "express";
const router = express.Router();
import Category from "../models/Category";

router.post("/add", async (req, res) => {
  const { name, image } = req.body;

  try {
    const category = new Category({
      name,
      image,
    });
    await category.save();
    return res.json({
      success: true,
      message: "Thêm thể loại thành công",
      values: {
        category,
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
    const categories = await Category.find();
    if (categories) {
      return res.json({
        success: true,
        message: "Lấy danh sách thể loại phim thành công",
        values: { categories },
      });
    }
    return res.json({
      success: false,
      message: "Lấy danh sách thể loại phim thất bại",
      values: { categories: [] },
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
    const category = await Category.findById(req.params.id);
    if (category) {
      return res.json({
        success: true,
        message: "Lấy thể loại phim thành công",
        values: { category },
      });
    }
    return res.json({
      success: false,
      message: "Lấy thể loại phim thất bại",
      values: { category: {} },
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
