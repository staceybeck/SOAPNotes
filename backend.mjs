/* eslint-disable import/first */
/** An express server with a single GET endpoint /analyze */
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.secret" });
import cors from "cors";
import express from "express";
import fetch from "node-fetch";
import twilio from "twilio";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // TODO limit CORS to specific domains
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { q } = req.body;

  const data = {
    input: q,
  };

  const resp = await fetch(process.env.SPELLBOOK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${process.env.SPELLBOOK_AUTH}`,
    },
    body: JSON.stringify(data),
  });
  const json = await resp.json();

  res.send(json);
});

app.post("/text", async (req, res) => {
  const { q } = req.body;

  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_ID,
    process.env.TWILIO_AUTH
  );

  await twilioClient.messages.create({
    body: q,
    from: "+18776382358",
    to: process.env.PHONE_NUMBER,
  });
  res.send({ message: "sent" });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
