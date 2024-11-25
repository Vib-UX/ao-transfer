import express from "express";
import bodyParser from "body-parser";
import { transferTokensNode } from "./transfer.js";
import cors from "cors";
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Transfer Tokens Endpoint
app.post("/transfer", async (req, res) => {
  const { processId, recipient, quantity } = req.body;

  if (!processId || !recipient || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { rawResponse, result } = await transferTokensNode(
      processId,
      recipient,
      quantity,
      "./jwk.json"
    );

    res.status(200).json({
      message: "Transfer successful",
      rawResponse,
      result,
    });
  } catch (error) {
    console.error("Error during transfer:", error);
    res.status(500).json({ error: "Transfer failed", details: error.message });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
