const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const {
  mongoose,
  isDatabaseConnected,
  DoctorsModel,
  CabinetsModel,
  WeightModel,
  QueueModel,
} = require("../mongoCommands/mongoClient");

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

const bodyParser = require("body-parser");
const port = 3000;

io.on("connection", (socket) => {
  console.log(`Client with id ${socket.id} connected`);

  socket.on("joinGroup", async (message) => {
    if ("cabinet" in message && "clientType" in message) {
      console.log(socket.id, "joinGroup");
      const { cabinet, clientType } = message;
      if (clientType == "controller") {
        if (isDatabaseConnected) {
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            const session = await mongoose.startSession();
            session.startTransaction();
            const cab = await CabinetsModel.findOne().exec();
            if (cab.free.includes(cabinet)) {
              const index = cab.free.indexOf(cabinet);
              cab.free.splice(index, 1);
              cab.busy.push(cabinet);
              cab.markModified("free");
              cab.markModified("busy");
            }
            await cab.save();
            await session.commitTransaction();
            session.endSession();
            socket.join(cabinet);
            console.log(message, "aboutController");
            socket.to(cabinet).emit("aboutController", { ...message });
          } catch (err) {
            await session.abortTransaction();
            session.endSession();
          }
        } else {
          console.log("DB not connected");
        }
      } else {
        socket.join(cabinet);
        socket.to(cabinet).emit("getController");
      }
    }
  });

  socket.on("leaveGroup", async (message) => {
    if ("cabinet" in message && "clientType" in message) {
      console.log(socket.id, "leaveGroup");
      const { cabinet, clientType } = message;
      if (clientType == "controller") {
        if (isDatabaseConnected) {
          const session = await mongoose.startSession();
          session.startTransaction();
          try {
            const session = await mongoose.startSession();
            session.startTransaction();
            const cab = await CabinetsModel.findOne().exec();
            if (cab.busy.includes(cabinet)) {
              const index = cab.busy.indexOf(cabinet);
              cab.busy.splice(index, 1);
              cab.free.push(cabinet);
              cab.markModified("free");
              cab.markModified("busy");
            }
            await cab.save();
            await session.commitTransaction();
            session.endSession();
            socket.join(cabinet);
            socket.to(cabinet).emit("controllerLeave");
          } catch (err) {
            await session.abortTransaction();
            session.endSession();
          }
        } else {
          console.log("DB not connected");
        }
      }
    }
  });

  socket.on("aboutController", (message) => {
    console.log("есть");
    console.log(message);
    if ("cabinet" in message && "doctor" in message && "patient" in message) {
      const { cabinet } = message;
      socket.to(cabinet).emit("aboutController", { ...message });
    }
  });

  socket.on("setBreak", (message) => {
    if ("cabinet" in message) {
      const { cabinet } = message;
      socket.to(cabinet).emit("setBreak");
    }
  });

  socket.on("finishBreak", (message) => {
    if ("cabinet" in message) {
      console.log("finish");
      const { cabinet } = message;
      socket.to(cabinet).emit("finishBreak");
    }
  });

  socket.on("getPatient", async (message) => {
    if ("cabinet" in message && "queueName" in message) {
      const { cabinet, queueName } = message;
      if (isDatabaseConnected) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          const queue = await QueueModel.findOne({ name: queueName }).exec();
          if (queue) {
            let item;

            if (queue.patients_in_cabinets.has(cabinet)) {
              io.to(cabinet).emit("newPatient", {
                newPatient: queue.patients_in_cabinets.get(cabinet),
              });
              session.endSession();
              return;
            }

            if (
              queue.gold_queue.length == 0 &&
              queue.classic_queue.length == 0 &&
              queue.return_queue.length == 0
            ) {
              io.to(cabinet).emit("newPatient",  {newPatient: {id: "-1", isGold: false, doctors: [], returnTo: [] }});
              session.endSession();
              return;
            }

            if (queue.gold_queue.length > 0) {
              item = queue.gold_queue.shift();
              queue.markModified("gold_queue");
            } else {
              if (queue.check) {
                if (queue.classic_queue.length > 0) {
                  item = queue.classic_queue.shift();
                  queue.markModified("classic_queue");
                  queue.check = !queue.check;
                  queue.markModified("check");
                } else {
                  item = queue.return_queue.shift();
                  queue.markModified("return_queue");
                }
              } else {
                if (queue.return_queue.length > 0) {
                  item = queue.return_queue.shift();
                  queue.markModified("return_queue");
                  queue.check = !queue.check;
                  queue.markModified("check");
                } else {
                  item = queue.classic_queue.shift();
                  queue.markModified("classic_queue");
                }
              }
            }

            if (item) {
              queue.patients_in_cabinets.set(cabinet, item);
              queue.markModified("patients_in_cabinets");
              console.log(queue, 100);
              await queue.save();
              await session.commitTransaction();
              session.endSession();
              io.to(cabinet).emit("newPatient", { newPatient: item });
            }
          }
        } catch (err) {
          console.log(err);
          await session.abortTransaction();
          session.endSession();
        }
      }
    }
  });

  socket.on("finishPatient", async (message) => {
    if (
      "cabinet" in message &&
      "queueName" in message &&
      "nextDoctors" in message &&
      "returnTo" in message
    ) {
      const { cabinet, queueName, nextDoctors, returnTo } = message;
      if (isDatabaseConnected) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          console.log("start");
          const queue = await QueueModel.findOne({ name: [queueName] }).exec();
          if (queue) {
            const patient = queue.patients_in_cabinets.get(cabinet);
            console.log(patient, 131231);
            if (patient) {
              queue.patients_in_cabinets.delete(cabinet);
              queue.markModified("patients_in_cabinets");
              if (patient.doctors.length == 0) {
                patient.returnTo = patient.returnTo.filter(
                  (element) => element !== queueName
                );
              } else {
                patient.doctors = patient.doctors.filter(
                  (element) => element !== queueName
                );
              }

              if (nextDoctors.length > 0) {
                patient.doctors = [...patient.doctors, ...nextDoctors];
              }

              console.log(returnTo, 24321);

              if (returnTo) {
                patient.returnTo = [...patient.returnTo, queueName];
              }

              if (patient.doctors.length == 0 && patient.returnTo.length == 0) {
                await queue.save();
                await session.commitTransaction();
                session.endSession();
                return;
              }

              const { doctors, isGold } = patient;

              let needQueue;

              if (isGold) {
                needQueue = "gold_queue";
              } else if (patient.doctors.length > 0) {
                needQueue = "classic_queue";
              } else if (patient.returnTo.length > 0) {
                needQueue = "return_queue";
              }


              let resultDoctor = { doctor: 0, weight: 1000 };

              const weight = await WeightModel.findOne();

              if (patient.doctors.length > 0) {
                patient.doctors.forEach((element) => {
                  const checker = weight[element];
                  if (checker) {
                    if (checker[needQueue] < resultDoctor.weight) {
                      console.log(element, checker[needQueue]);
                      resultDoctor.doctor = element;
                      resultDoctor.weight = checker[needQueue];
                    }
                  }
                });
              } else {
                patient.returnTo.forEach((element) => {
                  const checker = weight[element];
                  if (checker) {
                    if (checker[needQueue] < resultDoctor.weight) {
                      console.log(element, checker[needQueue]);
                      resultDoctor.doctor = element;
                      resultDoctor.weight = checker[needQueue];
                    }
                  }
                });
              }

              if (resultDoctor.doctor) {
                const doctorName = resultDoctor.doctor;
                const queueNext = await QueueModel.findOne({
                  name: doctorName,
                }).exec();
                console.log(queue, 1213);
                if (queueNext) {
                  if (isGold) {
                    queueNext.gold_queue.push(patient);
                    queueNext.markModified("gold_queue");
                  } else if (needQueue == "classic_queue") {
                    queueNext.classic_queue.push(patient);
                    queueNext.markModified("classic_queue");
                  } else if (needQueue == "return_queue") {
                    queueNext.return_queue.push(patient);
                    queueNext.markModified("return_queue");
                  }
                  await queueNext.save();
                  await queue.save();
                  console.log("СЮДЫЫЫЫ");
                  await session.commitTransaction();
                  session.endSession();
                  socket.emit("nextPatientDoctor", {
                    nextPatientDoctor: resultDoctor.doctor,
                  });
                }
              }
            }
          }
        } catch (err) {
          console.log(err);
          await session.abortTransaction();
          session.endSession();
          return;
        }
      }
    }
  });
  socket.on("message", (message) => console.log("Message: ", message));
});

app.get("/api/doctor", async (req, res) => {
  const search = req.query.search;
  console.log(search);
  if (isDatabaseConnected) {
    try {
      let doctorsData = await DoctorsModel.findOne({}, { _id: 0 });
      if (search) {
        let { doctors, additionals } = doctorsData;
        doctorsData = {
          doctors: doctors.filter((element) => {
            console.log(element);
            return !!element.toLowerCase().includes(search.toLowerCase());
          }),
          additionals: additionals.filter((element) => {
            console.log(element);
            return element.toLowerCase().includes(search.toLowerCase());
          }),
        };
      }
      return res.status(200).json(doctorsData);
    } catch {
      return res.json({ error: "Problem with DataBase" });
    }
  }
  return res.json({ error: "Problem with DataBase" });
});

app.get("/api/cabinet", bodyParser.json(), async (req, res) => {
  const search = req.query.search;
  if (isDatabaseConnected) {
    try {
      let cabinetsData = await CabinetsModel.findOne({}, { _id: 0 });
      if (search) {
        let { free, all, busy } = cabinetsData;
        cabinetsData = {
          free: free.filter((element) => {
            return element.toLowerCase().includes(search.toLowerCase());
          }),
          all: all.filter((element) => {
            return element.toLowerCase().includes(search.toLowerCase());
          }),
          busy: busy.filter((element) => {
            return element.toLowerCase().includes(search.toLowerCase());
          }),
        };
      }
      return res.status(200).json(cabinetsData);
    } catch {
      return res.json({ error: "Problem with DataBase" });
    }
  }
  return res.json({ error: "Problem with DataBase" });
});

app.get("/api/checkController/:name/:cabinet", async (req, res) => {
  const name = req.params.name;
  const cabinet = req.params.cabinet;

  console.log(name, cabinet)

  if (isDatabaseConnected) {
    const doc = await DoctorsModel.findOne();
    const cab = await CabinetsModel.findOne();
    console.log(doc);
    console.log(cab);
    if (doc.additionals.includes(name) && cab.free.includes(cabinet)) {
      return res.status(200).json({ check: true, isAdditional: true });
    }

    if (doc.doctors.includes(name) && cab.free.includes(cabinet)) {
      return res.status(200).json({ check: true, isAdditional: false });
    }

    return res.status(400).json({ check: false, isAdditional: false });
  } else {
    return res
      .status(500)
      .json({ message: "Не установлено соединение с БД", error });
  }
});

app.get("/api/checkScreen/:cabinet", bodyParser.json(), async (req, res) => {
  const cabinet = req.params.cabinet;
  console.log(cabinet);
  if (isDatabaseConnected) {
    const cab = await CabinetsModel.findOne();
    if (cab.all.includes(cabinet)) {
      return res.status(200).json(true);
    }

    return res.status(400).json(false);
  } else {
    return res
      .status(500)
      .json({ message: "Не установлено соединение с БД", error });
  }
});

app.get("/api/queue", bodyParser.json(), async (req, res) => {
  const search = req.query.search;
  console.log(search);
  if (isDatabaseConnected) {
    try {
      let queueData = await QueueModel.find({}, "name").exec();
      if (search) {
        return res.status(200).json({
          queues: queueData
            .map((element) => element.name)
            .filter((element) =>
              element.toLowerCase().includes(search.toLowerCase())
            ),
        });
      } else {
        return res
          .status(200)
          .json({ queues: queueData.map((element) => element.name) });
      }
    } catch {
      return res.json({ error: "Problem with DataBase" });
    }
  }
  return res.json({ error: "Problem with DataBase" });
});

app.put("/api/cabinet", async (req, res) => {
  const { newCabinet } = req.body;

  if (!newCabinet) {
    return res.status(400).json({ message: "bad data" });
  }

  if (isDatabaseConnected) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await CabinetsModel.findOneAndUpdate(
        {},
        { $push: { all: newCabinet, free: newCabinet } },
        { new: true, upsert: true }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json(newCabinet);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении данных", error });
    }
  } else {
    return res
      .status(500)
      .json({ message: "Не установлено соединение с БД", error });
  }
});

app.get("/api/login", async (req, res) => {});

app.put("/api/freeCabinet", async (req, res) => {
  const { freeCabinet } = req.body;

  if (isDatabaseConnected) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const cab = await CabinetsModel.findOne();
      if (cab.busy.includes(freeCabinet)) {
        const cabinetIndex = cab.busy.indexOf(freeCabinet);
        cab.busy.splice(cabinetIndex, 1);
        await cab.save();
        const result = await CabinetsModel.findOneAndUpdate(
          {},
          { $push: { free: freeCabinet } },
          { new: true, upsert: true }
        );

        await session.commitTransaction();
        session.endSession();
      }

      return res.status(200).json(freeCabinet);
    } catch (err) {
      console.log(err);
      return res.json({ error: "Problem with DataBase" });
    }
  }
  return res.json({ error: "Problem with DataBase" });
});

app.put("/api/doctor", async (req, res) => {
  const { newDoctor, direction } = req.body;

  if (!("newDoctor" in req.body) || !("direction" in req.body)) {
    console.log("жжж");
    return res.status(400).json({ message: "bad data" });
  }

  let result = "";
  let resultCabinet = "";

  if (isDatabaseConnected) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (direction == "additional") {
        result = await DoctorsModel.findOneAndUpdate(
          {},
          { $push: { additionals: newDoctor } },
          { new: true, upsert: true }
        );

        const queue = new QueueModel({
          name: newDoctor,
          classic_queue: [],
          gold_queue: [],
          return_queue: [],
          patients_in_cabinets: {},
          truant_queue: [],
          check: false,
        });
  
        const resultQueue = await queue.save();
  
        const resultWeigth = await WeightModel.findOneAndUpdate(
          {},
          {
            $set: {
              [newDoctor]: { classic_queue: 0, gold_queue: 0, return_queue: 0 },
            },
          },
          { new: true, upsert: true }
        );

        
        resultCabinet = await CabinetsModel.findOneAndUpdate(
          {},
          { $push: { all: newDoctor, free: newDoctor } },
          { new: true, upsert: true }
        );

      } else {
        result = await DoctorsModel.findOneAndUpdate(
          {},
          { $push: { doctors: `${newDoctor} - ${direction}` } },
          { new: true, upsert: true }
        );
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json(newDoctor);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении данных", error });
    }
  } else {
    return res
      .status(500)
      .json({ message: "Не установлено соединение с БД", error });
  }
});

app.put("/api/queue", async (req, res) => {
  const { newQueue } = req.body;

  if (!newQueue) {
    return res.status(400).json({ message: "bad data" });
  }

  if (isDatabaseConnected) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const queue = new QueueModel({
        name: newQueue,
        classic_queue: [],
        gold_queue: [],
        return_queue: [],
        patients_in_cabinets: {},
        truant_queue: [],
        check: false,
      });

      const resultQueue = await queue.save();

      const resultWeigth = await WeightModel.findOneAndUpdate(
        {},
        {
          $set: {
            [newQueue]: { classic_queue: 0, gold_queue: 0, return_queue: 0 },
          },
        },
        { new: true, upsert: true }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json(newQueue);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении данных", error });
    }
  } else {
    return res
      .status(500)
      .json({ message: "Не установлено соединение с БД", error });
  }
});

app.delete("/api/doctor", async (req, res) => {
  const { deleteDoctor } = req.body;
  if (!deleteDoctor) {
    return res.status(400).json({ message: "bad data" });
  }

  if (isDatabaseConnected) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const doc = await DoctorsModel.findOne();

      if (doc) {
        const doctorIndex = doc.doctors.indexOf(deleteDoctor);
        if (doctorIndex > -1) {
          doc.doctors.splice(doctorIndex, 1);
        }

        const additionalIndex = doc.additionals.indexOf(deleteDoctor);
        if (additionalIndex > -1) {
          doc.additionals.splice(additionalIndex, 1);
        }
        await doc.save();
      }
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(deleteDoctor);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении данных", error });
    }
  } else {
    return res
      .status(500)
      .json({ message: "Не установлено соединение с БД", error });
  }
});

app.delete("/api/cabinet", async (req, res) => {
  const { deleteCabinet } = req.body;
  console.log(req.body);
  if (!deleteCabinet) {
    return res.status(400).json({ message: "bad data" });
  }

  if (isDatabaseConnected) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const cab = await CabinetsModel.findOne();
      const foundInBusy = await CabinetsModel.findOne({ busy: deleteCabinet });

      if (foundInBusy) {
        const cabinetIndex = cab.busy.indexOf(deleteCabinet);
        if (cabinetIndex > -1) {
          cab.busy.splice(cabinetIndex, 1);
        }
      } else {
        const cabinetIndex = cab.free.indexOf(deleteCabinet);
        if (cabinetIndex > -1) {
          cab.free.splice(cabinetIndex, 1);
        }
      }

      const allIndex = cab.all.indexOf(deleteCabinet);

      if (allIndex > -1) {
        cab.all.splice(allIndex, 1);
      }

      await cab.save();
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(deleteCabinet);
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении данных", error });
    }
  } else {
    return res
      .status(500)
      .json({ message: "Не установлено соединение с БД", error });
  }
});

app.delete("/api/queue", async (req, res) => {
  const { deleteQueue } = req.body;
  if (!deleteQueue) {
    return res.status(400).json({ message: "bad data" });
  }

  if (isDatabaseConnected) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const result = await QueueModel.deleteOne({ name: deleteQueue });
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json(deleteQueue);
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении данных", error });
    }
  } else {
    return res
      .status(500)
      .json({ message: "Не установлено соединение с БД", error });
  }
});

app.post("/api/patient", async (req, res) => {
  const { patient } = req.body;

  if (!patient) {
    return res.status(400).json({ message: "bad data" });
  }

  if (
    !(
      "id" in patient &&
      "isGold" in patient &&
      "returnTo" in patient &&
      "doctors" in patient
    )
  ) {
    console.log("12321");
    return res.status(400).json({ message: "bad data" });
  }

  const { doctors, isGold } = patient;
  let goldOrClassic = isGold ? "gold_queue" : "classic_queue";

  if (isDatabaseConnected) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

      let resultDoctor = { doctor: 0, weight: 1000 };
      const weight = await WeightModel.findOne();

      doctors.forEach((element) => {
        const checker = weight[element];
        if (checker) {
          if (checker[goldOrClassic] < resultDoctor.weight) {
            console.log(element, checker[goldOrClassic]);
            resultDoctor.doctor = element;
            resultDoctor.weight = checker[goldOrClassic];
          }
        }
      });

      console.log(resultDoctor)

      if (resultDoctor.doctor) {
        const doctorName = resultDoctor.doctor;
        const queue = await QueueModel.findOne({ name: doctorName }).exec();
        console.log(queue, 1213);
        if (queue) {
          if (isGold) {
            queue.gold_queue.push(patient);
            queue.markModified("gold_queue");
          } else {
            queue.classic_queue.push(patient);
            queue.markModified("classic_queue");
          }
          await queue.save();
          await session.commitTransaction();
          session.endSession();
          return res.status(200).json(patient);
        }
      }

      return res
        .status(500)
        .json({ message: "Ошибка при обновлении данных"});

      // return res.json(deleteQueue);
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении данных", error });
    }
  } else {
    return res
      .status(500)
      .json({ message: "Не установлено соединение с БД", error });
  }
});

server.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
