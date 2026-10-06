import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../auth/jwt.js';
import { WhatsAppService } from '../services/whatsappService.js';
import { db } from '../db/index.js';

const router = Router();

// Require manager authentication for all WhatsApp device routes
router.use(requireAuth);

/**
 * GET /api/whatsapp/status
 * Get the current WhatsApp connection state and pairing QR code for the restaurant
 */
router.get('/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const state = WhatsAppService.getStatus(restaurantId);

    return res.json({
      success: true,
      data: state
    });
  } catch (error: any) {
    console.error('WhatsApp status error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/whatsapp/connect
 * Initiate WhatsApp Web pairing session and generate a new QR code
 */
router.post('/connect', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const state = await WhatsAppService.initSession(restaurantId);

    return res.json({
      success: true,
      message: 'WhatsApp pairing session initiated.',
      data: state
    });
  } catch (error: any) {
    console.error('WhatsApp connect error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/whatsapp/disconnect
 * Unlink the device and remove saved session credentials
 */
router.post('/disconnect', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    await WhatsAppService.disconnect(restaurantId);

    return res.json({
      success: true,
      message: 'WhatsApp session disconnected successfully.'
    });
  } catch (error: any) {
    console.error('WhatsApp disconnect error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/whatsapp/test-send
 * Send a verification test message to ensure the session works
 */
router.post('/test-send', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const restaurantId = req.manager!.restaurantId;
    const { targetPhone } = req.body;

    const restaurant = db.getRestaurant(restaurantId);
    const destPhone = targetPhone || restaurant?.phone || '';

    if (!destPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a recipient phone number for the test message.'
      });
    }

    const testMessage = `👋 *Test message from ${restaurant?.name || 'SwaadSevak'}!*\n\n✅ Your WhatsApp is successfully connected to SwaadSevak AI CRM. Automated campaign messages will now be sent safely from this number.`;

    const result = await WhatsAppService.sendTextMessage(restaurantId, destPhone, testMessage);

    if (result.success) {
      return res.json({
        success: true,
        message: `Test message sent to ${destPhone} successfully!`,
        messageId: result.messageId
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to send test message.'
      });
    }
  } catch (error: any) {
    console.error('WhatsApp test-send error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
