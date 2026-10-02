"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_js_1 = require("../db/index.js");
const jwt_js_1 = require("../auth/jwt.js");
const router = (0, express_1.Router)();
router.use(jwt_js_1.requireAuth);
router.get('/today', (req, res) => {
    const restaurantId = req.manager.restaurantId;
    const stats = index_js_1.db.getTodayStats(restaurantId);
    return res.json({ success: true, stats });
});
exports.default = router;
