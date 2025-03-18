const schedule = require("node-schedule");
const selectStateNow = require("../scripts/selectStateNow");

// Configurar o agendamento para 2:00 AM todos os dias

module.exports = {
 
  updateRouter() {
    try {
      const updateRouter = schedule.scheduleJob(
        '30 * * * * *',
        
        async function () {
          await selectStateNow.execute();
        }
      );
      return updateRouter;
    } catch (error) {
      logger.error("Error when running schedule 'update router' -" + error);
      if (!error.path) {
        error.path = "src/schedule/index";
      }
      //throw error;
    }
  },
};
