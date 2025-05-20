"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
// Protected routes - apply auth middleware
router.get('/', cart_controller_1.getCart);
router.post('/add', cart_controller_1.addToCart);
router.delete('/clear', cart_controller_1.clearCart);
exports.default = router;
