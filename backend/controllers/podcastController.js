const fs = require("fs");
const pdfParse = require("pdf-parse");

exports.generatePodcast = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "PDF Required",
      });
    }

    console.log("API HIT");

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text.trim();

    // Clean up the uploaded file once we've read it
    fs.unlink(req.file.path, () => {});

    if (!pdfText) {
      return res.status(422).json({
        message:
          "No readable text found in this PDF. It may be scanned/image-based.",
      });
    }

    res.json({
      success: true,
      script: pdfText,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
