const multer = require('multer');
const path = require('path');

// Define the storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the 'Upload' folder exists
    cb(null, 'upload');
  },
  // filename: function (req, file, cb) {
  //   // Generate a unique file name based on the current timestamp and random number
  //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  //   cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  // }
  filename: function (req, file, cb) {
    // Use the original name of the file
    cb(null, file.originalname); // Save the file with its original name
  }

});

// Update fileFilter to accept both images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg' , 'image/png', 'image/gif','image/webp', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type! Please upload an image or a PDF.'), false);
  }
};

// Define the multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 *10 //Limit file size to 5MB
  }
});

module.exports = upload;
