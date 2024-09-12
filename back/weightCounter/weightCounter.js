const {
  WeightModel,
  QueueModel,
  mongoose,
  isDatabaseConnected,
} = require("../mongoCommands/mongoClient");

async function weightCounterWorker() {
  if (isDatabaseConnected) {
    const session = await mongoose.startSession();
    session.startTransaction();
    if (isDatabaseConnected) {
      try {
        let resultWeight = {};
        const results = await QueueModel.aggregate([
          {
            $project: {
              name: 1,
              classic_queue: 1,
              gold_queue: 1,
              return_queue: 1,
            },
          },
        ]);

        results.forEach((element) => {
          const { classic_queue, gold_queue, return_queue, name } = element;
          resultWeight[name] = { 
            classic_queue: classic_queue.length || 0, 
            gold_queue: gold_queue.length || 0, 
            return_queue: return_queue.length || 0
          }
        });

        const result = await WeightModel.replaceOne(
          {}, 
          resultWeight, 
          { upsert: false } 
        );

        await session.commitTransaction();
        session.endSession();

        console.log("Данние пересчитаны!");
      } catch {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        // отправить при неисправности пересчитывателя на админку
      }
    } else {
      console.log("НЕ УСТАНОВЛЕНО СОЕДИНЕНИE С БД!!!");
      // отправить при неисправности пересчитывателя на админку
    }
  }
}

setInterval(() => weightCounterWorker(), 10000);
