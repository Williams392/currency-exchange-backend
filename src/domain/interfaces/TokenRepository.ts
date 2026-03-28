export interface GeneratedToken {
  token: string;
  expiresIn: number;
}

export interface ITokenRepository {
  generateToken<T>(payload: T): Promise<GeneratedToken>;
  verifyToken(token: string): Promise<any>;
}