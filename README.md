Excel and CSV File Upload/Download App

  A simple web application that allows users to upload and download Excel and CSV files.

Description

This application enables users to upload Excel and CSV files, store them in a MySQL database, and download them by either ID or filename. The app is built using Node.js, Express, and MySQL.

Features:

Only Excel and csv file is allowed to upload and download
Upload Excel and CSV files.
Download files by ID or filename.
File data is stored in a MySQL database.
The app validate the file type and review the file before uploading


Installation

Clone the repository:
    git clone https://github.com/tsionguesh/upload_download_excel-and-csv-file.git
Install dependencies:
    cd upload_download_excel-and-csv-file
    npm install
Set up environment variables:
Create a .env file and add your MySQL credentials:
    DB_HOST=localhost
    DB_USER=your-db-user
    DB_PASSWORD=your-db-password
    DB_NAME=your-db-name
    
Usage

Start and run the server:
    node server.js
on browser
    http://localhost:8080
    
Upload a file:

    POST to /upload with the file using a form or API.

Download a file by ID:

   GET /download/:id where id is the file's ID.

Download a file by filename:

    GET /download/filename/:filename where filename is the name of the file you want to download.
