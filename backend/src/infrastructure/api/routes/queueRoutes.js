const express = require("express");
const router = express.Router();
const { journeyActionQueue } = require("../../queue");

router.get("/queues", async (req, res) => {
  try {
    const queues = await journeyActionQueue.getQueues();
    res.json(queues);
  } catch (error) {
    console.error("Error fetching queues:", error);
    res.status(500).json({ error: "Erro ao buscar filas" });
  }
});

module.exports = router;
