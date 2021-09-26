import express from "express";
const router = express.Router();
import RoomDetail from "../models/RoomDetail";
import { ValidateRoomDetail } from "../utils/validators";

router.post("/add", async (req, res) => {
  const { roomId, timeSlotId } = req.body;
  try {
    const { valid, errors } = ValidateRoomDetail(roomId, timeSlotId);
    if (!valid) {
      console.log("error");
      return res.json({
        success: false,
        message: "Thêm phòng chiếu thất bại",
        errors,
      });
    } else {
      const is = await RoomDetail.findOne({
        room: roomId,
        timeSlot: timeSlotId,
      });
      if (is) {
        return res.json({
          success: false,
          message:
            "Phòng đã có khung giờ này rồi, vui lòng chọn khung giờ khác",
        });
      }
    }
    const roomDetail = new RoomDetail({
      room: roomId,
      timeSlot: timeSlotId,
    });
    await roomDetail.save();
    const newRoomDetail = await RoomDetail.findById(roomDetail._id)
      .populate("room")
      .populate("timeSlot");
    return res.json({
      success: true,
      message: "Thêm khung giờ thành công",
      values: {
        roomDetail: newRoomDetail,
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

router.get("/get-times/:id", async (req, res) => {
  try {
    const times = await RoomDetail.find({ room: req.params.id })
      .populate("timeSlot")
      .populate("room");
    if (times) {
      return res.json({
        success: true,
        message: "Lấy danh sách khung giờ theo id phòng thành công",
        values: {
          roomDetails: times,
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Lỗi 400!",
      errors: error.message,
    });
  }
});

module.exports = router;
