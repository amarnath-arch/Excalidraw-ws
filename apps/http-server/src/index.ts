import express from "express";
import cors from "cors";
import rootRouter from "./routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1", rootRouter);

app.get("/hellothere", (req, res) => {
  console.log("hello there");
  return res.status(200).json({
    message: "hello there",
  });
});

app.listen(3001, () => {
  console.log("listening on port 3001");
});
