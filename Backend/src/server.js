const dotenv = require("dotenv");
dotenv.config();    
const express = require("express");
const cors = require("cors");
const assignmentRoutes = require("./routes/assignment.routes");
const { cleanupMiddleware } = require("./middleware/cleanup.middleware");

const app = express();

const PORT = process.env.PORT || 5000;



// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/assignment", assignmentRoutes);

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("[Server Error]", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
