const express = require("express");
const router = express.Router();
const multer = require("multer");
const fileController = require("../upload_download_excel and csv file/controllers/file.controller");

const upload = multer({ storage: multer.memoryStorage() });

let routes = (app) => {
  router.post("/upload", upload.single("file"), fileController.uploadFile);
  router.get("/download/:id", fileController.downloadFile);
  router.get("/download/filename/:filename", fileController.downloadByFilename);


  app.use("/api/files", router);
};

module.exports = routes;
