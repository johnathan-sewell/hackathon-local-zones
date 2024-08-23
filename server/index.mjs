import express from "express";

const PORT = 80;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Hackathon!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
