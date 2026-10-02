import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'swaad_sevak_jwt_secret_key_super_secure_2026_india';

export type AuthenticatedRequest = Request<any, any, any, any> & {
  manager?: JwtPayload;
  body: any;
  params: any;
  query: any;
};

export function signManagerToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyManagerToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authorization token required. Please log in.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyManagerToken(token);

  if (!payload) {
    res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
    return;
  }

  req.manager = payload;
  next();
}
