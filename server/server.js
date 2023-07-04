const express = require("express");
const app = express();
const UserRouter = require("./routes/user");
const ReportRouter = require("./routes/report");
const SecurityRouter = require("./routes/security");
const RoleRouter = require("./routes/role");
const ValidationError = require("./errors/ValidationError");
const cors = require("cors");
const checkFormat = require("./middlewares/check-format");
const errorHandler = require("./middlewares/error-handler");
const checkAuth = require("./middlewares/check-auth");
const checkAdmin  = require("./middlewares/check-role");

app.use(cors());

app.use(checkFormat);

app.use(express.json());
app.use("/", SecurityRouter);
//app.use(checkAuth); protect all routes below
app.use("/users", checkAuth, checkAdmin, UserRouter); // protect only this route
app.use("/reports", checkAuth, ReportRouter); // protect only this route
app.use("/roles", checkAuth, checkAdmin, RoleRouter); // protect only this route

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
