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
