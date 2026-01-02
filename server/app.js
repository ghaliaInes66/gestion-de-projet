const express = require("express");
const mongoose = require("mongoose");
const UserRouter = require("./router/UserRouter");
const ProjectRouter = require("./router/ProjectRouter");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  require("cors")({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const dbURL =
  "mongodb+srv://aya:12345@smiling.pgesm.mongodb.net/gestion_de_projet?retryWrites=true&w=majority";

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:"), err;
  });
app.use("/api/users", UserRouter);
app.use("/api/projects", ProjectRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
