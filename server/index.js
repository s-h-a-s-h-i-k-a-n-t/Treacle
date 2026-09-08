import express from "express";
import { createApp } from "./app.js";
const { app } = createApp();
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
  app.get("/{*path}", (req, res) =>
    res.sendFile("index.html", { root: "dist" }),
  );
}
app.listen(process.env.PORT || 3001, "127.0.0.1", () =>
  console.log("Sentry backend running on http://127.0.0.1:3001"),
);
