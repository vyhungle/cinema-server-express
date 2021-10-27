import { ID_SCREEN_2D, ID_SCREEN_3D, ID_SCREEN_IMAX } from "./constaints";
var md5 = require("md5");

export const checkIsEmptyAddress = (oldAddress, address) => {
  if (
    oldAddress.city.trim() === address.city.trim() &&
    oldAddress.district.trim() === address.district.trim() &&
    oldAddress.ward.trim() === address.ward.trim() &&
    oldAddress.street.trim() === address.street.trim()
  ) {
    return true;
  }
  return false;
};

const formatDate = (date) => {
  const newDate = new Date(date);
  const day = String(newDate.getDate()).padStart(2, "0");
  const month = newDate.getMonth();
  const year = newDate.getFullYear();
  return `${day}/${month + 1}/${year}`;
};

const pushDay = (res, date) => {
  const now = Date.now();
  var days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  if (days[date.getDay()] === "Thứ 2") {
    res.monday.days.push({
      date: formatDate(date),
      status: date < now ? false : true,
    });
  } else if (days[date.getDay()] === "Thứ 3") {
    res.tuesday.days.push({
      date: formatDate(date),
      status: date < now ? false : true,
    });
  } else if (days[date.getDay()] === "Thứ 4") {
    res.wednesday.days.push({
      date: formatDate(date),
      status: date < now ? false : true,
    });
  } else if (days[date.getDay()] === "Thứ 5") {
    res.thursday.days.push({
      date: formatDate(date),
      status: date < now ? false : true,
    });
  } else if (days[date.getDay()] === "Thứ 6") {
    res.friday.days.push({
      date: formatDate(date),
      status: date < now ? false : true,
    });
  } else if (days[date.getDay()] === "Thứ 7") {
    res.saturday.days.push({
      date: formatDate(date),
      status: date < now ? false : true,
    });
  } else if (days[date.getDay()] === "Chủ nhật") {
    res.sunday.days.push({
      date: formatDate(date),
      status: date < now ? false : true,
    });
  }
  return res;
};

export const getDaysInMonth = (year, month) => {
  var date = new Date(`${year}/${month}/1`);

  var res = {
    monday: {
      name: "Thứ 2",
      days: [],
    },
    tuesday: {
      name: "Thứ 3",
      days: [],
    },
    wednesday: {
      name: "Thứ 4",
      days: [],
    },
    thursday: {
      name: "Thứ 5",
      days: [],
    },
    friday: {
      name: "Thứ 6",
      days: [],
    },
    saturday: {
      name: "Thứ 7",
      days: [],
    },
    sunday: {
      name: "Chủ nhật",
      days: [],
    },
  };
  do {
    pushDay(res, date);
    date.setDate(date.getDate() + 1);
  } while (date.getMonth() !== month);

  return res;
};

const parseTime = (time) => {
  const flag = time.split(":");
  return parseFloat(flag[0], 10) + parseFloat(flag[1] / 60, 10);
};

const mergeTimes = (times) => {
  let res = [];
  times.forEach((item) => {
    const isTime = res.some((x) => x.time === item.time);
    if (isTime) {
      const index = res.findIndex((x) => x.time === item.time);
      res[index].movieRoom.push({ room: item.room, movie: item.movie });
    } else {
      res.push({
        time: item.time,
        movieRoom: [
          {
            room: item.room,
            movie: item.movie,
          },
        ],
      });
    }
  });
  return res;
};

const mergeDates = (times, obj, dateParent, dateChild) => {
  let res = times;
  if (dateParent === dateChild) {
    res.push(obj);
  }
  return res.sort((a, b) => parseTime(a.time) - parseTime(b.time));
  // return res
};

export const mergeShowTime = (showTimes) => {
  let res = [];
  showTimes.forEach((element) => {
    const isDate = res.some((x) => x.date === element.date);
    if (isDate) {
      const index = res.findIndex((x) => x.date === element.date);
      res[index] = {
        date: res[index].date,
        times: mergeDates(
          res[index].times,
          {
            time: element.timeSlot.time,
            room: element.room,
            movie: element.showTime.movie,
          },
          element.date,
          res[index].date
        ),
      };
    } else {
      res.push({
        date: element.date,
        times: [
          {
            time: element.timeSlot.time,
            room: element.room,
            movie: element.showTime.movie,
          },
        ],
      });
    }
  });

  res.forEach((item, index) => {
    res[index].times = mergeTimes(item.times);
  });
  return res;
};

export const addTimeSlotInRoom = (rooms, timeSlot) => {
  let res = [];
  const timeSort = timeSlot.sort(
    (a, b) => parseTime(a.time) - parseTime(b.time)
  );
  rooms.forEach((item) => {
    res.push({ ...item._doc, timeSlots: timeSort });
  });
  return res;
};

const sortTimeSlot = (data) => {
  data.sort((a, b) => parseTime(a.timeSlot.time) - parseTime(b.timeSlot.time));
  return data;
};

export const resShowTimeByDate = (data) => {
  const showTimes = [];
  sortTimeSlot(data).forEach((item) => {
    if (!showTimes.some((x) => x.movie._id === item.showTime.movie._id)) {
      showTimes.push({
        // _id: item.showTime._id,
        movie: item.showTime.movie,
        screen2D: {
          title: "2D",
          showTimesDetails:
            item.room.screen._id == ID_SCREEN_2D
              ? [
                  {
                    _id: item._id,
                    room: item.room,
                    timeSlot: item.timeSlot,
                  },
                ]
              : [],
        },
        screen3D: {
          title: "3D",
          showTimesDetails:
            item.room.screen._id == ID_SCREEN_3D
              ? [
                  {
                    _id: item._id,
                    room: item.room,
                    timeSlot: item.timeSlot,
                  },
                ]
              : [],
        },
        screenIMAX: {
          title: "IMAX",
          showTimesDetails:
            item.room.screen._id == ID_SCREEN_IMAX
              ? [
                  {
                    _id: item._id,
                    room: item.room,
                    timeSlot: item.timeSlot,
                  },
                ]
              : [],
        },
      });
    } else {
      const index = showTimes.findIndex(
        (x) => x.movie._id === item.showTime.movie._id
      );
      showTimes[index] = {
        ...showTimes[index],
        screen2D: {
          ...showTimes[index].screen2D,
          showTimesDetails:
            item.room.screen._id == ID_SCREEN_2D
              ? [
                  ...showTimes[index].screen2D.showTimesDetails,
                  {
                    _id: item._id,
                    room: item.room,
                    timeSlot: item.timeSlot,
                  },
                ]
              : showTimes[index].screen2D.showTimesDetails,
        },
        screen3D: {
          ...showTimes[index].screen3D,
          showTimesDetails:
            item.room.screen._id == ID_SCREEN_3D
              ? [
                  ...showTimes[index].screen3D.showTimesDetails,
                  {
                    _id: item._id,
                    room: item.room,
                    timeSlot: item.timeSlot,
                  },
                ]
              : showTimes[index].screen3D.showTimesDetails,
        },
        screenIMAX: {
          ...showTimes[index].screenIMAX,
          showTimesDetails:
            item.room.screen._id == ID_SCREEN_IMAX
              ? [
                  ...showTimes[index].screenIMAX.showTimesDetails,
                  {
                    _id: item._id,
                    room: item.room,
                    timeSlot: item.timeSlot,
                  },
                ]
              : showTimes[index].screenIMAX.showTimesDetails,
        },
      };
    }
  });
  return showTimes;
};

export const checkWeekend = (date) => {
  const dayOfWeek = new Date(date).getDay();
  return dayOfWeek === 6 || dayOfWeek === 0;
};

export const renderStringSeat = (values) => {
  let res = "";
  for (let i = 0; i < values.length; i++) {
    if (i < values.length - 1) {
      res += `${values[i]}, `;
    } else res += `${values[i]}.`;
  }
  return res;
};

export const getCinemaLocation = (cinemas) => {
  const locations = [];
  cinemas.map((item) => {
    if (!locations.some((x) => x === item.address.city)) {
      locations.push(item.address.city);
    }
  });
  return locations;
};

export const renderObjTicket = (tickets, room, id) => {
  const res = [];
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const ticketCount = room.rowNumber * room.seatsInRow;

  for (let i = 1; i <= ticketCount; i++) {
    const index = Math.floor((i % 10 === 0 ? i - 1 : i) / 10);
    if (!res.some((x) => x.nameRow === alphabet[index])) {
      res.push({
        nameRow: alphabet[index],
        nameSeats: [
          {
            idSeat: `${md5(i + alphabet[index] + id)}`,
            seatName: `${alphabet[index]}${i - index * 10}`,
            price: checkWeekend(new Date())
              ? room.screen.weekendPrice
              : room.screen.weekdayPrice,
            status: 0,
            showTimesDetails: id,
          },
        ],
      });
    } else {
      res[index].nameSeats = [
        ...res[index].nameSeats,
        {
          idSeat: `${md5(i + alphabet[index] + id)}`,
          seatName: `${alphabet[index]}${i - index * 10}`,
          price: checkWeekend(new Date())
            ? room.screen.weekendPrice
            : room.screen.weekdayPrice,
          status: 0,
          showTimesDetails: id,
        },
      ];
    }
    res.map((item, index) => {
      item.nameSeats.map((fakeTicket, fakeIndex) => {
        tickets.map((realTicket) => {
          if (fakeTicket.idSeat === realTicket.idSeat) {
            res[index].nameSeats[fakeIndex] = realTicket;
          }
        });
      });
    });
  }
  return res;
};

export const renderShowTime = (showTimes, movieId, cinemaId, screenId) => {
  let res = showTimes;
  if (movieId) {
    res = res.filter((x) => x.showTime.movie._id == movieId);
  }
  if (cinemaId) {
    res = res.filter((x) => x.showTime.cinema == cinemaId);
  }
  if (screenId) {
    res = res.filter((x) => x.room.screen._id == screenId);
  }
  return res;
};
