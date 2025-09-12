// ...................QUEUE FOR ACTUAL FAST PROCESSING TASKS LIKE EXPORTING LARGE DATASETS, CLEANUP, ETC..................

const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

const leadQueue = new Queue("lead-queue", { connection });

module.exports = leadQueue;
