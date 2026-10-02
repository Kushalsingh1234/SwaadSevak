"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_js_1 = require("../db/index.js");
const jwt_js_1 = require("../auth/jwt.js");
const router = (0, express_1.Router)();
router.use(jwt_js_1.requireAuth);
router.get('/config', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const config = index_js_1.db.getPrinterConfig(restaurantId);
    return res.json({ success: true, config });
});
router.put('/config', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const { printerName, paperWidth, autoPrintKot, printerType, printerIp } = req.body;
    const validWidths = ['58mm', '80mm'];
    if (paperWidth && !validWidths.includes(paperWidth)) {
        return res.status(400).json({ success: false, message: 'Paper width must be either 58mm or 80mm' });
    }
    const updated = index_js_1.db.updatePrinterConfig(restaurantId, {
        ...(printerName && { printerName }),
        ...(paperWidth && { paperWidth }),
        ...(autoPrintKot !== undefined && { autoPrintKot: Boolean(autoPrintKot) }),
        ...(printerType && { printerType }),
        ...(printerIp !== undefined && { printerIp })
    });
    return res.json({
        success: true,
        message: 'Printer configuration saved successfully',
        config: updated
    });
});
exports.default = router;
