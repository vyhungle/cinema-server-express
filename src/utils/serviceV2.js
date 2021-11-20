import Movie from "../models/Movie";
import ShowTime from "../models/ShowTime";
import ShowTimeDetail from "../models/ShowTimeDetail";
import Room from "../models/Room";
import TimeSlot from "../models/TimeSlot";
import { filterTimeSTD, parseTime } from "./helper";

export const revenueStatisticsByDateV2 = async (
  cinemaId,
  dateStart,
  dateEnd,
  type = 0
) => {
  const showTimes = await ShowTime.find({ cinema: cinemaId });
  let showTimeDetails = [];

  // get show time detail
  for (let i = 0; i < showTimes.length; i++) {
    const std = await ShowTimeDetail.find({ showTime: showTimes[i]._id });
    std.forEach((item) => {
      item.movieId = showTimes[i].movie;
    });
    showTimeDetails = showTimeDetails.concat(std);
  }
  const filterSTD = filterTimeSTD(showTimeDetails, dateStart, dateEnd);
  if (type === "full") {
    return mergeSTD(filterSTD);
  } else if (type === "room") {
    const rooms = await Room.find({ cinema: cinemaId });
    return await mergeSTDRoom(filterSTD, rooms);
  } else if (type === "time") {
    const timeSlots = await TimeSlot.find();
    const sortTimeSL = timeSlots.sort(
      (a, b) => parseTime(a.time) - parseTime(b.time)
    );
    return await mergeSTDTimeSlot(filterSTD, sortTimeSL);
  } else {
    const movie = await Movie.find();
    return await mergeSTDMovie(filterSTD, movie);
  }
};

const mergeSTD = (showDetails) => {
  const res = [];
  // console.log(showDetails);

  showDetails.forEach((item, index) => {
    const is = res.some((x) => x.date == item.date);
    // console.log(item.food);
    if (!is) {
      res.push({
        date: item.date,
        ticket: item.ticket,
        food: item.food,
        totalPrice: item.totalPrice,
      });
    } else {
      const index = res.findIndex((x) => x.date == item.date);
      res[index] = {
        ...res[index],
        ticket: joinTicketTK(res[index].ticket, item.ticket),
        food: joinFoodTK(res[index].food, item.food),
        totalPrice: res[index].totalPrice + item.totalPrice,
      };
    }
  });
  return res;
};

const mergeSTD_OBJ = (showDetails) => {
  let res = {
    ticket: {
      adult: {
        name: "Vé người lớn",
        count: 0,
        price: 0,
      },
      child: {
        name: "Vé trẻ em",
        count: 0,
        price: 0,
      },
      student: {
        name: "Vé sinh viên",
        count: 0,
        price: 0,
      },
      total: 0,
      totalPromotion: 0,
    },
    food: {
      combo: [],
      total: 0,
      totalPromotion: 0,
    },
    totalPrice: 0,
  };
  showDetails.forEach((item, index) => {
    res = {
      ...res,
      ticket: {
        ...joinTicketTK(res.ticket, item.ticket),
      },
      food: {
        ...joinFoodTK(res.food, item.food),
      },
      totalPrice: res.totalPrice + item.totalPrice,
    };
  });
  return res;
};

const joinTicketTK = (oldItem, item) => {
  const res = {
    adult: {
      name: "Vé người lớn",
      count: oldItem.adult.count + item.adult.count,
      price: oldItem.adult.price + item.adult.price,
    },
    child: {
      name: "Vé trẻ em",
      count: oldItem.child.count + item.child.count,
      price: oldItem.child.price + item.child.price,
    },
    student: {
      name: "Vé sinh viên",
      count: oldItem.student.count + item.student.count,
      price: oldItem.student.price + item.student.price,
    },
    total: oldItem.total + item.total,
    totalPromotion: oldItem.totalPromotion + item.totalPromotion,
  };

  return res;
};

const joinFoodTK = (oldItem, item) => {
  const res = {
    combo: [],
    total: oldItem.total + item.total,
    totalPromotion: oldItem.totalPromotion + item.totalPromotion,
  };
  let tam = [];
  const array = oldItem.combo.concat(item.combo);
  array.forEach((element) => {
    const is = tam.some(
      (x) => x._id.toString().trim() === element._id.toString().trim()
    );
    if (!is) {
      tam.push(element);
    } else {
      const index = tam.findIndex(
        (x) => x._id.toString().trim() === element._id.toString().trim()
      );
      tam[index].count += element.count;
    }
  });
  res.combo = tam;
  return res;
};

const mergeSTDRoom = (showTimeDetails, rooms) => {
  let res = [];
  for (let i = 0; i < rooms.length; i++) {
    const std = showTimeDetails.filter(
      (x) => x.room.toString() == rooms[i]._id.toString()
    );
    res.push({
      room: rooms[i],
      statistical: mergeSTD_OBJ(std),
    });
  }
  return res;
};

const mergeSTDTimeSlot = (showTimeDetails, timeSlots, roomId) => {
  let res = [];
  for (let i = 0; i < timeSlots.length; i++) {
    let std = [];
    if (roomId) {
      std = showTimeDetails.filter(
        (x) =>
          x.timeSlot.toString() == timeSlots[i]._id.toString() &&
          x.room.toString() == roomId.toString()
      );
    } else {
      std = showTimeDetails.filter(
        (x) => x.timeSlot.toString() == timeSlots[i]._id.toString()
      );
    }
    res.push({
      timeSlot: timeSlots[i],
      statistical: mergeSTD_OBJ(std),
    });
  }
  return res;
};

const mergeSTDMovie = (showTimeDetails, movies) => {
  let res = [];
  for (let i = 0; i < movies.length; i++) {
    const std = showTimeDetails.filter(
      (x) => x.movieId.toString() == movies[i]._id.toString()
    );
    res.push({
      movie: movies[i],
      statistical: mergeSTD_OBJ(std),
    });
  }
  return res;
};
