"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const database_config_1 = __importDefault(require("./config/database.config"));
const config_1 = require("./config");
const seeders_1 = require("./seeders");
const associations_1 = __importDefault(require("./models/associations"));
const error_middleware_1 = require("./middlewares/error.middleware");
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const checkout_routes_1 = __importDefault(require("./routes/checkout.routes"));
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: config_1.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((0, express_session_1.default)({
    secret: config_1.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: config_1.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
}));
// Middleware
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/auth', auth_routes_1.default);
app.use('/products', products_routes_1.default);
app.use('/categories', categories_routes_1.default);
app.use('/cart', cart_routes_1.default);
app.use('/checkout', checkout_routes_1.default);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// 404 not found handler
app.use(error_middleware_1.notFoundHandler);
// Common error handler
app.use(error_middleware_1.errorHandler);
async function startServer() {
    try {
        // Test database connection
        await database_config_1.default.authenticate();
        console.log('Database connection established successfully.');
        // Define model associations
        (0, associations_1.default)();
        console.log('Model associations defined.');
        // Sync database models
        await database_config_1.default.sync();
        console.log('Database models synchronized.');
        // Run database seeders
        await (0, seeders_1.runSeeders)();
        console.log('Database seeders completed.');
        // Start the server
        app.listen(config_1.PORT, () => {
            console.log(`Server is running on port ${config_1.PORT}`);
        });
    }
    catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}
startServer();
