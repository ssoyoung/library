import { Router } from "express";
import { IAuditLog } from "./repository";

export class AuditLogController {
  constructor(private router: Router, private auditLogRepository: IAuditLog) {}

  public registerRoutes(): void {}
}
