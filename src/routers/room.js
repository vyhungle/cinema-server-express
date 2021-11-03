import express from "express";
import { addRoomDetail } from "../api/serverAPI";
const router = express.Router();
import request from "supertest";

import Room from "../models/Room";
import ScreenDetail from "../models/ScreenDetail";
import TimeSlot from "../models/TimeSlot";
import { ValidateRoom } from "../utils/validators";
import { addTimeSlotInRoom } from "../utils/helper";
import { errorCatch } from "../utils/constaints";

router.post("/add", async (req, res) => {
  const client = request(req.app);
  const { name, rowNumber, seatsInRow, screenId, cinemaId } = req.body;

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
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.put("/update/:id", async (req, res) => {
  const { name, rowNumber, seatsInRow, screenId, cinemaId } = req.body;

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
      message: errorCatch,
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
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const rooms = await Room.find().populate("cinema").populate("screen");
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
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get-room-by-screen/:id", async (req, res) => {
  try {
    const rooms = await Room.find({ screen: req.params.id })
      .populate("cinema")
      .populate("screen");
    if (rooms) {
      return res.json({
        success: true,
        message: "Lấy danh sách phòng theo mã màng hình thành công.",
        rooms,
      });
    }
    return res.json({
      success: false,
      message: "Lấy danh sách phòng theo mã màng hình thất bại.",
      rooms: [],
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: errorCatch,
      errors: error.message,
    });
  }
});

router.get("/get-by-movie/:id", async (req, res) => {
  try {
    const listDetail = await ScreenDetail.find({ movie: req.params.id });
    const timeSlots = await TimeSlot.find();
    let listRooms = [];
    for (let item of listDetail) {
      const rooms = await Room.find({ screen: item.screen })
        .populate("cinema")
        .populate("screen");
      listRooms = listRooms.concat(rooms);
    }

    return res.json({
      success: true,
      message: "Lấy danh sách phòng chiếu thành công",
      values: { rooms: addTimeSlotInRoom(listRooms, timeSlots) },
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
