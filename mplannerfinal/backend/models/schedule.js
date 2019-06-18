const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const scheduleSchema = mongoose.Schema({
  id: {type: String, required: true},
  start:{type: Date, required: true},
  end:{type:Date},
  title: {type: String, required: true},
  color: {type: Object, required: true},
  allDay: {type: Boolean},
  draggable: {type: Boolean},
  resizable: {
    beforeStart: {type: Boolean},
    afterEnd: {type: Boolean}
  },
});

module.exports = mongoose.model("Event", scheduleSchema);
