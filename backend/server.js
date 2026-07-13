require("dotenv").config();

const express = require("express");
const cors = require("cors");

const podcastRoute = require("./routes/podcastRoute");
const audioRoute = require("./routes/audioRoute");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));

app.use("/api", podcastRoute);
app.use("/api", audioRoute);

app.listen(8000, () => {
  console.log("Server Running On 8000");
});
