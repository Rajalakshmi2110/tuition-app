// export const uploadDocument = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   res.json({
//     message: "File uploaded successfully",
//     file: req.file
//   });
// };

// export const getFilesByClass = (req, res) => {
//   res.json({ message: `Files for class ${req.params.classId}` });
// };



const uploadDocument = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ message: "File uploaded successfully", file: req.file });
};

module.exports = { uploadDocument };

