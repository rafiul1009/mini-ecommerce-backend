"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.get('/logout', auth_controller_1.logout);
router.use(auth_middleware_1.authMiddleware);
// Protected routes - apply auth middleware
router.get('/me', auth_controller_1.getUserDetails);
router.get('/me/orders', auth_controller_1.getUserOrders);
exports.default = router;
