export interface IEmailRepository {
  sendWelcomeEmail(email: string, username: string): Promise<void>;
}