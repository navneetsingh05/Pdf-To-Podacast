const fs = require("fs");

const pdfParse = require("pdf-parse");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const pdfText = pdfData.text;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(
      `Convert these study notes into an engaging podcast conversation:

${pdfText.substring(0, 12000)}`,
    );

    const podcastScript = result.response.text();

    res.json({
      success: true,

      script: podcastScript,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
