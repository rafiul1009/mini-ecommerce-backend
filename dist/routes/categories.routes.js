"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_controller_1 = require("../controllers/categories.controller");
const admin_middleware_1 = require("../middlewares/admin.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', categories_controller_1.getCategories);
router.use(auth_middleware_1.authMiddleware);
router.use(admin_middleware_1.adminMiddleware);
// Protected routes - apply admin middleware
router.post('/', categories_controller_1.createCategory);
router.put('/:id', categories_controller_1.updateCategory);
router.delete('/:id', categories_controller_1.deleteCategory);
exports.default = router;
