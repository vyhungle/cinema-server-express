import { model, Schema } from "mongoose";

const permissionSchema = new Schema({
  name: String,
  type: String,
});

module.exports = model("permissions", permissionSchema);
