import express from "express";
import { createApp } from "./app.js";
const { app } = createApp();
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
  app.get("/{*path}", (req, res) =>
    res.sendFile("index.html", { root: "dist" }),
  );
}
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Sentry backend running on port ${PORT}`),
);
