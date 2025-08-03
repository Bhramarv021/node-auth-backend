import express from "express";
import appRouter from "./src/routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5002;

// app.get('/', (req, res) => {
//     console.log("Server started")
//     res.send({message: "OK"});
// });

app.use(express.json());
app.use('/api',appRouter);

console.log("dotenv var : ",process.env.GMAIL_EMAIL, process.env.GMAIL_PASSWORD);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});