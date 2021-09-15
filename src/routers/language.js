import express from "express";
const router = express.Router();
import Language from "../models/Language";

router.post("/add", async (req, res) => {
  const { name } = req.body;

  try {
    const language = new Language({
      name,
    });
    await language.save();
    return res.json({
      success: true,
      message: "Thêm quốc gia thành công",
      values: {
        language,
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
    const languages = await Language.find();
    if (languages) {
      return res.json({
        success: true,
        message: "Lấy danh sách quốc gia thành công",
        values: { languages },
      });
    }
    return res.status(400).json({
      success: false,
      message: "Lấy danh sách quốc gia thất bại",
      values: { languages: [] },
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
    const language = await Language.findById(req.params.id);
    if (language) {
      return res.json({
        success: true,
        message: "Lấy quốc gia thành công",
        values: { language },
      });
    }
    return res.status(400).json({
      success: false,
      message: "Lấy quốc gia thất bại",
      values: { language: {} },
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
