import { cronManager } from "./cron.manager.js";
import { automationLogger } from "../logger/index.js";

export class SchedulerEngine {
  private static instance: SchedulerEngine;
  private isRunning = false;

  static getInstance(): SchedulerEngine {
    if (!SchedulerEngine.instance) {
      SchedulerEngine.instance = new SchedulerEngine();
    }
    return SchedulerEngine.instance;
  }

  start(): void {
    if (this.isRunning) {
      automationLogger.warn("SchedulerEngine", "SchedulerEngine is already running");
      return;
    }
    cronManager.startAll();
    this.isRunning = true;
    automationLogger.info("SchedulerEngine", "SchedulerEngine started successfully");
  }

  stop(): void {
    if (!this.isRunning) {
      return;
    }
    cronManager.stopAll();
    this.isRunning = false;
    automationLogger.info("SchedulerEngine", "SchedulerEngine stopped");
  }
}

export const schedulerEngine = SchedulerEngine.getInstance();
