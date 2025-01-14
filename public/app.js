const fileInput = document.getElementById('fileInput');
const validateButton = document.getElementById('validateButton');
const uploadButton = document.getElementById('uploadButton');
const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');
const filePreview = document.getElementById('filePreview');
const hidePreviewButton = document.getElementById('hidePreviewButton');
// const filePreviewContainer = document.getElementById('filePreviewContainer');

let isFileValid = false;

validateButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    
    if (!file) {
        uploadStatus.textContent = "Please select a file.";
        isFileValid = false;
        return;
    }

    const allowedExtensions = ['csv', 'xlsx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
        uploadStatus.textContent = "Invalid file type. Only Excel and CSV files are allowed.";
        isFileValid = false;
        return;
    }

    if (file.size > 2 * 1024 * 1024) { // File size limit of 2MB
        uploadStatus.textContent = "File is too large. Maximum allowed size is 2MB.";
        isFileValid = false;
        return;
    }

    // If file is valid and is Excel, attempt to preview it
    if (fileExtension === 'xlsx') {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert sheet to HTML table and display it in the filePreview area
                const htmlString = XLSX.utils.sheet_to_html(worksheet);
                filePreview.innerHTML = htmlString;
                uploadStatus.textContent = "File is valid and previewed successfully.";
                isFileValid = true;
                uploadButton.disabled = false;  // Enable upload button
            } catch (error) {
                uploadStatus.textContent = "Error reading the Excel file: " + error.message;
                isFileValid = false;
            }
        };
        reader.readAsArrayBuffer(file);
    } else if (fileExtension === 'csv') {
        // For CSV files, read and preview the content
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            const rows = content.split('\n').map(row => row.split(','));

            // Create a table to display the CSV data
            let html = '<table>';
            rows.forEach((row) => {
                html += '<tr>';
                row.forEach(cell => {
                    html += `<td>${cell.trim()}</td>`;
                });
                html += '</tr>';
            });
            html += '</table>';
            filePreview.innerHTML = html;

            uploadStatus.textContent = "CSV file is valid and previewed successfully.";
            isFileValid = true;
            uploadButton.disabled = false;  // Enable upload button
        };
        reader.readAsText(file);  // Read CSV as text
    }
});

// Hide the preview manually
hidePreviewButton.addEventListener('click', () => {
    filePreview.innerHTML = ''; // Clear the preview
    hidePreviewButton.style.display = 'none'; // Hide the button
});

// hidePreviewButton.addEventListener('click', () => {
//     if (filePreviewContainer.style.display === 'none') {
//         filePreviewContainer.style.display = 'block'; // Show the preview
//         hidePreviewButton.innerHTML = '<i class="fas fa-eye"></i> Show Preview'; // Change button text/icon
//     } else {
//         filePreviewContainer.style.display = 'none'; // Hide the preview
//         hidePreviewButton.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Preview'; // Change button text/icon
//     }
// });

uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!isFileValid) {
        uploadStatus.textContent = "Please validate the file before uploading.";
        return;
    }

    const formData = new FormData();
    const file = fileInput.files[0];

    formData.append("file", file);

    try {
        const response = await fetch('http://10.20.220.187:8080/api/files/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            uploadStatus.textContent = "File uploaded successfully!";
            uploadButton.disabled = true;  // Disable upload button after successful upload
            filePreview.innerHTML = ''; // Clear the preview
            hidePreviewButton.style.display = 'none'; // Hide the button
        } else {
            const result = await response.text();
            uploadStatus.textContent = `Error: ${result}`;
        }
    } catch (error) {
        uploadStatus.textContent = `Error: ${error.message}`;
        
    }
});

// Handle File Download
// const downloadForm = document.getElementById('downloadForm');
// downloadForm.addEventListener('submit', async (event) => {
//     event.preventDefault();
  
//     const fileId = document.getElementById('fileId').value;
  
//     try {
//         const response = await fetch(`http://10.20.220.44:8080/api/files/download/${fileId}`);
//         if (response.ok) {
//             const blob = await response.blob();
//             const downloadUrl = URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = downloadUrl;

//             const contentDisposition = response.headers.get('Content-Disposition');
//             const fileName = contentDisposition
//                 ? contentDisposition.split('filename=')[1].trim()
//                 : `file_${fileId}`;

//             link.download = fileName;
//             link.click();
//             URL.revokeObjectURL(downloadUrl);  // Clean up the object URL
//         } else {
//             const result = await response.text();
//             alert(`Error: ${result}`);
//         }
//     } catch (error) {
//         alert(`Error: ${error.message}`);
//     }
// });


// Handle File Download
downloadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileId = document.getElementById('fileId').value.trim();
    const fileName = document.getElementById('fileName').value.trim();

    let downloadUrl = '';
  
    if (fileId) {
        // If fileId is provided, use it to construct the URL
        downloadUrl = `http://10.20.220.187:8080/api/files/download/${fileId}`;
    } else if (fileName) {
        // If fileName is provided, add logic to download by filename
        // You need to implement this logic in your backend
        downloadUrl = `http://10.20.220.187:8080/api/files/download/filename/${fileName}`;
    } else {
        alert("Please enter either a File ID or a Filename to download.");
        return;
    }

    try {
        const response = await fetch(downloadUrl);
        if (response.ok) {
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            const contentDisposition = response.headers.get('Content-Disposition');
            const fileDownloadName = contentDisposition
                ? contentDisposition.split('filename=')[1].trim()
                : fileName || `file_${fileId}`; // Default to ID if no filename is available

            link.download = fileDownloadName;
            link.click();
            URL.revokeObjectURL(downloadUrl);  // Clean up the object URL
        } else {
            const result = await response.text();
            alert(`Error: ${result}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});


