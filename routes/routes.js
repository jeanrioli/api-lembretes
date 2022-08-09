const userRoutes = require("./reminders");

const appRouter = (app, fs) => {
  app.get("/", (req, res) => {
    res.send("api-server lembretes");
  });
  userRoutes(app, fs);
};

module.exports = appRouter;
