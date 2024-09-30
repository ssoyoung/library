import { LibraryAction } from "./types";

export interface IAuditLog {
  getAuditLogs(): Promise<LibraryAction[]>;
  loanBook(bookId: string, userEmail: string): Promise<void>;
  returnBook(bookId: string, userEmail: string): Promise<void>;
}

export class AuditLogRepository {
  private auditLogs: LibraryAction[] = [];

  async getAuditLogs(): Promise<LibraryAction[]> {
    return this.auditLogs;
  }

  async loanBook(bookId: string, userEmail: string): Promise<void> {
    this.auditLogs.push({ type: "loan", bookId, userEmail, date: new Date() });
  }

  async returnBook(bookId: string, userEmail: string): Promise<void> {
    this.auditLogs.push({
      type: "return",
      bookId,
      userEmail,
      date: new Date(),
    });
  }
}
