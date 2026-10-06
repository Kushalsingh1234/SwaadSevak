import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  ConnectionState
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory for storing session credentials per restaurant
const SESSIONS_DIR = path.resolve(__dirname, '../../storage/whatsapp_sessions');

export interface WhatsAppSessionState {
  status: 'DISCONNECTED' | 'INITIALIZING' | 'QR_READY' | 'CONNECTED';
  qrCodeDataUrl?: string;
  phoneNumber?: string;
  connectedAt?: Date;
  lastError?: string;
}

interface ActiveSession {
  sock: WASocket | null;
  state: WhatsAppSessionState;
  reconnectAttempts: number;
}

export class WhatsAppService {
  private static sessions: Map<string, ActiveSession> = new Map();
  private static logger = pino({ level: 'silent' });

  /**
   * Ensure session storage directory exists
   */
  private static getSessionDir(restaurantId: string): string {
    const dir = path.join(SESSIONS_DIR, restaurantId);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  /**
   * Get current connection status for a restaurant
   */
  public static getStatus(restaurantId: string): WhatsAppSessionState {
    const session = this.sessions.get(restaurantId);
    if (!session) {
      // Check if session directory exists with existing credentials
      const sessionDir = path.join(SESSIONS_DIR, restaurantId);
      const hasCreds = fs.existsSync(path.join(sessionDir, 'creds.json'));
      if (hasCreds) {
        // Automatically wake up session
        this.initSession(restaurantId).catch(err => {
          console.warn(`[WhatsApp] Auto-init failed for ${restaurantId}:`, err);
        });
        return { status: 'INITIALIZING' };
      }
      return { status: 'DISCONNECTED' };
    }
    return session.state;
  }

  /**
   * Initialize or resume a WhatsApp session for a restaurant
   */
  public static async initSession(restaurantId: string): Promise<WhatsAppSessionState> {
    const existing = this.sessions.get(restaurantId);
    if (existing && existing.sock && existing.state.status === 'CONNECTED') {
      return existing.state;
    }

    const sessionDir = this.getSessionDir(restaurantId);
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const activeSession: ActiveSession = {
      sock: null,
      state: {
        status: 'INITIALIZING'
      },
      reconnectAttempts: 0
    };
    this.sessions.set(restaurantId, activeSession);

    try {
      const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: this.logger,
        browser: ['SwaadSevak CRM', 'Chrome', '1.0.0']
      });

      activeSession.sock = sock;

      sock.ev.on('creds.update', saveCreds);

      sock.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            const qrCodeDataUrl = await QRCode.toDataURL(qr, {
              margin: 2,
              scale: 8,
              color: { dark: '#1e293b', light: '#ffffff' }
            });
            activeSession.state = {
              status: 'QR_READY',
              qrCodeDataUrl
            };
          } catch (qrErr: any) {
            console.error('[WhatsApp] QR generation failed:', qrErr);
          }
        }

        if (connection === 'open') {
          const userJid = sock.user?.id || '';
          // JID format: 919876543210:1@s.whatsapp.net -> extract clean number
          const rawNum = userJid.split(':')[0] || userJid.split('@')[0];
          const formattedPhone = rawNum.startsWith('91') ? `+${rawNum}` : `+91 ${rawNum}`;

          activeSession.state = {
            status: 'CONNECTED',
            phoneNumber: formattedPhone,
            connectedAt: new Date()
          };
          activeSession.reconnectAttempts = 0;
          console.log(`[WhatsApp] Restaurant ${restaurantId} connected as ${formattedPhone}!`);
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          console.log(`[WhatsApp] Connection closed for ${restaurantId}. Status code: ${statusCode}, Reconnect: ${shouldReconnect}`);

          if (shouldReconnect && activeSession.reconnectAttempts < 5) {
            activeSession.reconnectAttempts++;
            activeSession.state = { status: 'INITIALIZING' };
            setTimeout(() => {
              this.initSession(restaurantId).catch(console.error);
            }, 3000);
          } else {
            activeSession.state = {
              status: 'DISCONNECTED',
              lastError: statusCode === DisconnectReason.loggedOut ? 'Logged out by user' : 'Connection failed'
            };
          }
        }
      });

      return activeSession.state;
    } catch (err: any) {
      console.error(`[WhatsApp] Init session error for ${restaurantId}:`, err);
      activeSession.state = {
        status: 'DISCONNECTED',
        lastError: err.message
      };
      return activeSession.state;
    }
  }

  /**
   * Format phone number to WhatsApp JID format
   * e.g. "9876543210" -> "919876543210@s.whatsapp.net"
   */
  public static formatPhoneToJid(phone: string): string {
    let clean = phone.replace(/\D/g, '');
    if (clean.length === 10) {
      clean = `91${clean}`;
    }
    return `${clean}@s.whatsapp.net`;
  }

  /**
   * Send a direct WhatsApp text message through the restaurant's connected session
   */
  public static async sendTextMessage(
    restaurantId: string,
    recipientPhone: string,
    messageText: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const session = this.sessions.get(restaurantId);

    if (!session || !session.sock || session.state.status !== 'CONNECTED') {
      return {
        success: false,
        error: 'WhatsApp is not connected for this restaurant. Please scan the QR code in CRM Settings.'
      };
    }

    try {
      const jid = this.formatPhoneToJid(recipientPhone);
      const res = await session.sock.sendMessage(jid, {
        text: messageText
      });

      return {
        success: true,
        messageId: res?.key?.id || undefined
      };
    } catch (err: any) {
      console.error(`[WhatsApp] Failed to send message to ${recipientPhone}:`, err);
      return {
        success: false,
        error: err.message || 'Failed to dispatch WhatsApp message.'
      };
    }
  }

  /**
   * Disconnect and clear session credentials for a restaurant
   */
  public static async disconnect(restaurantId: string): Promise<boolean> {
    const session = this.sessions.get(restaurantId);
    if (session && session.sock) {
      try {
        await session.sock.logout();
      } catch (err) {
        console.warn(`[WhatsApp] Logout error for ${restaurantId}:`, err);
      }
    }

    this.sessions.delete(restaurantId);

    // Remove saved session files from disk
    const sessionDir = path.join(SESSIONS_DIR, restaurantId);
    if (fs.existsSync(sessionDir)) {
      try {
        fs.rmSync(sessionDir, { recursive: true, force: true });
      } catch (rmErr) {
        console.warn(`[WhatsApp] Could not delete session folder:`, rmErr);
      }
    }

    return true;
  }

  /**
   * Send a batch of messages with human-like delays to prevent spam detection
   */
  public static async sendBatchWithDelay(
    restaurantId: string,
    messages: Array<{ phone: string; text: string }>,
    onProgress?: (index: number, total: number, success: boolean) => void
  ): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < messages.length; i++) {
      const item = messages[i];
      const result = await this.sendTextMessage(restaurantId, item.phone, item.text);

      if (result.success) {
        sent++;
      } else {
        failed++;
      }

      if (onProgress) {
        onProgress(i + 1, messages.length, result.success);
      }

      // Add random human-like delay (6 to 12 seconds) between recipients if more remain
      if (i < messages.length - 1) {
        const delayMs = Math.floor(Math.random() * (12000 - 6000) + 6000);
        await new Promise(r => setTimeout(r, delayMs));
      }
    }

    return { sent, failed };
  }
}
