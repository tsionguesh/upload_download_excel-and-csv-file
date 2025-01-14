const db = require("../models");
const File = db.files;
const path = require('path');

// Upload file to MySQL
const uploadFile = async (req, res) => {
  try {
    const { originalname, mimetype, buffer } = req.file;

    await File.create({
      fileName: originalname,
      fileType: mimetype,
      fileData: buffer,
    });

    res.status(200).send("File uploaded successfully.");
  } catch (err) {
    res.status(500).send({
      message: "Could not upload the file: " + err.message,
    });
  }
};

// 

// Download file by id from MySQL
const downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);

    if (!file) {
      return res.status(404).send({
        message: "File not found."
      });
    }

    // Set Content-Disposition header with properly quoted filename
    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
    res.setHeader('Content-Type', file.fileType);
    res.send(file.fileData);
    
  } catch (err) {
    res.status(500).send({
      message: "Could not download the file: " + err.message,
    });
  }
};

// Download file by filename from MySQL
const downloadByFilename = async (req, res) => {
  try {
    const { filename } = req.params;
    const decodedFilename = decodeURIComponent(filename); // Decode the filename

    console.log("Decoded Filename:", decodedFilename); // Check the decoded filename

    const file = await File.findOne({ where: { fileName: decodedFilename } });

    if (!file) {
      return res.status(404).send({ message: "File not found." });
    }

    // Set headers for downloading the file
    res.setHeader("Content-Disposition", `attachment; filename="${file.fileName}"`);
    res.setHeader("Content-Type", file.fileType);
    res.send(file.fileData);
  } catch (err) {
    res.status(500).send({ message: `Could not download the file: ${err.message}` });
  }
};


module.exports = {
  uploadFile,
  downloadFile,
  downloadByFilename,
};


