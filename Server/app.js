const express = require("express");
const app = express();
const db = require("./config/db");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();

// ================= VARIABLES =================
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ================= SECURITY =================
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.disable("x-powered-by");
app.set("trust proxy", 1);

// ================= CORS =================
const allowedOrigins = [...new Set([
  "http://localhost:3000", CLIENT_URL,
])];

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://rmsb-mission-school.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// ================= MIDDLEWARE =================
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

// ================= DATABASE =================
db();

// ================= ROUTES =================
app.use("/api/admin", require("./routes/adminRoutes"));

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Server is running..");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
