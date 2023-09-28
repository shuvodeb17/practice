const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const multer = require("multer");
const PDFParser = require("pdf-parse");
const fs = require("fs");
const { fromPath } = require("pdf2pic");


app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file || req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Invalid PDF file' });
    }

    const buffer = req.file.buffer;
    const data = await PDFParser(buffer);
    const text = data.text;

    // Save the extracted text to a JSON object
    const jsonOutput = { text };

    // Save the JSON object to a file (optional)
    fs.writeFileSync('output.json', JSON.stringify(jsonOutput, null, 2));

    return res.json(jsonOutput);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/* app.post("/api/upload", upload.single("pdf"), async (req, res) => {
    try {
      if (!req.file || req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Invalid PDF file" });
      }
  
      const buffer = req.file.buffer;
  
      // Extract text from the PDF
      const data = await PDFParser(buffer);
      const pdfText = data.text;
  
      // Create a temporary directory to save images
      const tempDir = "temp_images";
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
  
      const pdf2pic = fromPath(buffer, tempDir, { format: "png", width: 1200 });
  
      // Extract images from the PDF and save them
      const images = await pdf2pic(1, -1);
  
      // Send the extracted text and file paths of the images in the response
      res.json({ text: pdfText, images: images.map((image) => image.path) });
    } catch (error) {
      console.error("Error uploading and extracting PDF:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }); */
  
  
  

const users = [
  { id: 1, name: "Puja Roy", email: "puja@gmail.com" },
  { id: 2, name: "Pushpita Roy", email: "pushpita@gmail.com" },
  { id: 3, name: "Singhdda Roy", email: "singhdda@gmail.com" },
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  res.send(users);
});

app.post("/users", (req, res) => {
  console.log("Post api hitting");
  const newUser = req.body;
  newUser.id = users.length + 1;
  users.push(newUser);
  res.send(newUser);
});

app.listen(port, () => {
  console.log(`Server is running PORT: ${port}`);
});
