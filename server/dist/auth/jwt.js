"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signManagerToken = signManagerToken;
exports.verifyManagerToken = verifyManagerToken;
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'swaad_sevak_jwt_secret_key_super_secure_2026_india';
function signManagerToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
function verifyManagerToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
}
function requireAuth(req, res, next) {
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
