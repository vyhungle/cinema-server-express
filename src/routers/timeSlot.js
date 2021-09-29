import express from "express";
const router = express.Router();
import TimeSlot from "../models/TimeSlot";
import Room from "../models/Room";
import ShowTime from "../models/ShowTime";
import RoomDetail from "../models/RoomDetail";

router.post("/add", async (req, res) => {
  const { time } = req.body;
  try {
    const newTime = new TimeSlot({
      time,
    });
    await newTime.save();
    return res.json({
      success: true,
      message: "Thêm khung giờ thành công",
      values: {
        timeSlot: newTime,
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
    const times = await TimeSlot.find();
    return res.json({
      success: true,
      message: "Lấy danh sách khung giờ thành công",
      values: {
        timeSlots: times,
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

router.get("/list-time", async (req, res) => {
  const { dateStart, dateEnd, roomId } = req.body;
  try {
    // const start = new Date(dateStart);
    // const end = new Date(dateEnd);

    const showTimes = await ShowTime.find({ room: roomId, date: dateStart });
    const roomDetail = await RoomDetail.find({ room: roomId }).populate(
      "timeSlot"
    );

    let timeSlots = [];
    if (showTimes) {
      showTimes.map((item) => {
        timeSlots.push(item.timeSlot);
      });
    }

    if (timeSlots.length > 0) {
      // filterRoomDetail = roomDetail.filter(
      //   (item) => !timeSlots.includes(item.timeSlot._id)
      // );
      roomDetail.map((room, index) => {
        timeSlots.map((time) => {
          if (room.timeSlot._id.toString() === time.toString()) {
            roomDetail.splice(index, 1);
          }
        });
      });
    }

    let newTimeSlots = [];
    roomDetail.map((item) => {
      newTimeSlots.push(item.timeSlot);
    });

    // console.log(start.getDate(), end.getDate);
    return res.json({
      success: true,
      message: "lấy danh sách khung giờ thành công",
      values: {
        timeSlots: newTimeSlots.sort(),
      },
    });
  } catch (error) {}
});

module.exports = router;
