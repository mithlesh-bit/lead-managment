
// ...............................................FOR FUTURE USE  TO HANDLE LARGE DATASET EXPORT IMPORT USE...............................................

const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const Lead = require("../models/lead.model");

const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

const worker = new Worker(
  "lead-queue",
  async (job) => {
    if (job.name === "exportLeads") {
      console.log("Exporting leads...");
      const leads = await Lead.find({ isDeleted: false });
      // TODO: write to CSV/Excel or upload to S3
      console.log(`Exported ${leads.length} leads`);
    }

    if (job.name === "cleanupLeads") {
      console.log("Cleaning up soft deleted leads...");
      const result = await Lead.deleteMany({ isDeleted: true });
      console.log(`Deleted ${result.deletedCount} soft deleted leads`);
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});
