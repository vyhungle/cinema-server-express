import express from "express";
import { addRoomDetail } from "../api/serverAPI";
const router = express.Router();
import request from "supertest";

import Room from "../models/Room";
import { ValidateRoom } from "../utils/validators";

router.post("/add", async (req, res) => {
  const client = request(req.app);
  const { name, rowNumber, seatsInRow, screenId, cinemaId, timeSlotsId } =
    req.body;

  try {
    const { valid, errors } = ValidateRoom(
      name,
      rowNumber,
      seatsInRow,
      screenId,
      cinemaId
    );
    if (!valid) {
      return res.json({
        success: false,
        message: "Thêm phòng chiếu thất bại",
        errors,
      });
    }
    const room = new Room({
      name,
      rowNumber,
      seatsInRow,
      screen: screenId,
      cinema: cinemaId,
    });
    await room.save();
    // them chi tiet phong
    addRoomDetail(client, timeSlotsId, "/api/roomDetail/add", room._id);

    const newRoom = await Room.findById(room._id)
      .populate("cinema")
      .populate("screen");
    return res.json({
      success: true,
      message: "Thêm phòng chiếu thành công",
      values: {
        room: newRoom,
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

router.put("/update/:id", async (req, res) => {
  const { name, rowNumber, seatsInRow, screenId, cinemaId, timeSlotsId } =
    req.body;

  try {
    const oldRoom = await Room.findById(req.params.id);
    if (oldRoom) {
      const { valid, errors } = ValidateRoom(
        name,
        rowNumber,
        seatsInRow,
        screenId,
        cinemaId
      );
      if (!valid) {
        return res.json({
          success: false,
          message: "Sửa phòng chiếu thất bại",
          errors,
        });
      }

      oldRoom.name = name;
      oldRoom.rowNumber = rowNumber;
      oldRoom.seatsInRow = seatsInRow;
      oldRoom.screen = screenId;
      oldRoom.cinema = cinemaId;

      await oldRoom.save();
      const newRoom = await Room.findById(oldRoom._id)
        .populate("cinema")
        .populate("screen");
      return res.json({
        success: true,
        message: "Sửa phòng chiếu thành công",
        values: {
          room: newRoom,
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

router.delete("/delete/:id", async (req, res) => {
  try {
    const is = await Room.findByIdAndDelete(req.params.id);
    if (is) {
      return res.json({
        success: true,
        message: "Xóa phòng chiếu thành công",
      });
    }
    return res.json({
      success: false,
      message: "Không tìm thấy phòng chiếu này",
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
    const rooms = await Room.find();
    if (rooms) {
      return res.json({
        success: true,
        message: "Lấy danh sách phòng chiếu thành công",
        values: { rooms },
      });
    }
    return res.json({
      success: false,
      message: "Lấy danh sách phòng chiếu thất bại",
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
