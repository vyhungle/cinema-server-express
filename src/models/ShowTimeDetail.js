import { model, Schema } from "mongoose";

const showTimeDetailSchema = new Schema({
  date: String,
  room: {
    type: Schema.Types.ObjectId,
    ref: "rooms",
  },
  showTime: {
    type: Schema.Types.ObjectId,
    ref: "showtimes",
  },
  timeSlot: {
    type: Schema.Types.ObjectId,
    ref: "timeslots",
  },

  // field thống kê
  ticket: {
    adult: {
      name: {
        type: String,
        default: "Vé người lớn",
      },
      count: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    child: {
      name: {
        type: String,
        default: "Vé trẻ em",
      },
      count: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    student: {
      name: {
        type: String,
        default: "Vé sinh viên",
      },
      count: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    totalPromotion: {
      type: Number,
      default: 0,
    },
  },
  food: {
    combo: {
      type: Array,
      default: [],
    },
    total: {
      type: Number,
      default: 0,
    },
    totalPromotion: {
      type: Number,
      default: 0,
    },
  },
  totalPrice: {
    type: Number,
    default: 0,
  },

  // field thống kê
  ticket: {
    adult: {
      name: {
        type: String,
        default: "Vé người lớn",
      },
      count: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    child: {
      name: {
        type: String,
        default: "Vé trẻ em",
      },
      count: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    student: {
      name: {
        type: String,
        default: "Vé sinh viên",
      },
      count: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    totalPromotion: {
      type: Number,
      default: 0,
    },
  },
  food: {
    combo: {
      type: Array,
      default: [],
    },
    total: {
      type: Number,
      default: 0,
    },
    totalPromotion: {
      type: Number,
      default: 0,
    },
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

module.exports = model("showtimedetails", showTimeDetailSchema);
