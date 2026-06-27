const express = require("express");
const client = require("prom-client");

const app = express();
const port = 5000;

// Create a Registry
const register = new client.Registry();

// Collect default metrics
client.collectDefaultMetrics({ register });

// Create custom counter
const paymentCounter = new client.Counter({
  name: "payment_requests_total",
  help: "Total number of payment requests",
});

register.registerMetric(paymentCounter);

// Home
app.get("/", (req, res) => {
  res.send("Welcome to Payment Service");
});

// Payment
app.get("/payment", (req, res) => {
  paymentCounter.inc();

  res.json({
    status: "success",
    message: "Payment Processed Successfully",
  });
});

// Health
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
  });
});

// Metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Payment Service running on port ${port}`);
});