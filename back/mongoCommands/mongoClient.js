const MONGO_URL = "mongodb://localhost:27017/soup";
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
  doctors: Array,
  additionals: Array,
});

const CabinetShema = new Schema({
  all: Array,
  free: Array,
  busy: Array,
});

const QueueSchema = new mongoose.Schema({
  name: String,
  classic_queue: [Object],
  gold_queue: [Object],
  return_queue: [Object],
  patients_in_cabinets: { type: Map, of: Object },
  truant_queue: [Object],
  check: Boolean,
});

const WeightShema = new Schema({}, { strict: false });

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  }).then(() => { 

  })
  .catch((error) => {
    console.log(error);
  });



mongoose.connection.on("reconnectFailed", () => {
  console.error("Ошибка при попытке переподключения к MongoDB");
});

const DoctorsModel = mongoose.model("doctors", DoctorSchema);
const CabinetsModel = mongoose.model("cabinets", CabinetShema);
const QueueModel = mongoose.model("queues", QueueSchema);
const WeightModel = mongoose.model("weight", WeightShema);

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  mongoose,
  MONGO_URL, 
  isDatabaseConnected,
  DoctorsModel,
  CabinetsModel,
  QueueModel,
  WeightModel,
};
