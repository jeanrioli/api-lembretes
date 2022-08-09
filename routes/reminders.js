const userRoutes = (app, fs) => {
  const dataPath = "./data/reminders.json";

  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }
      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }
      callback();
    });
  };

  function generateId(data) {
    if (data.length === 0) {
      return 1;
    } else {
      const lastId = data.find((_, index) => index === data.length - 1).id;
      return lastId + 1;
    }
  }

  app.get("/reminders", (req, res) => {
    readFile((data) => {
      res.send(data);
    }, true);
  });

  app.post("/reminders", (req, res) => {
    readFile((data) => {
      const newReminder = { ...req.body, id: generateId(data) };
      data.push(newReminder);
      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(data);
      });
    }, true);
  });

  app.put("/reminders", (req, res) => {
    readFile((data) => {
      const reminderId = req.body.id;
      const newList = data.filter((reminder) => reminder.id !== +reminderId);
      newList.push(req.body);
      writeFile(JSON.stringify(newList, null, 2), () => {
        res.status(200).send(newList);
      });
    }, true);
  });

  app.delete("/reminders/:id", (req, res) => {
    readFile((data) => {
      const deleteId = req.params["id"];
      const newList = data.filter((reminder) => reminder.id !== +deleteId);
      console.log(deleteId);

      writeFile(JSON.stringify(newList, null, 2), () => {
        res.status(200).send(newList);
      });
    }, true);
  });
};

module.exports = userRoutes;
