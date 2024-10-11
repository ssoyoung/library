import { Router } from "express";
import { IAuditLog } from "./repository";
import { IController } from "../common/interfaces/IController";

export class AuditLogController implements IController {
  constructor(private router: Router, private auditLogRepository: IAuditLog) {}

  public registerRoutes(): void {}
}
