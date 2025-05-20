"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("../config");
// 404 not found handler
const notFoundHandler = (_req, _res, next) => {
    next((0, http_errors_1.default)(404, "Your requested content was not found!"));
};
exports.notFoundHandler = notFoundHandler;
// default error handler
const errorHandler = (err, _req, res, _next) => {
    res.locals.error = config_1.NODE_ENV === "development" ? err : { message: err.message };
    res.status(err.status || 500);
    if (err.status === 404) {
        // Serve static 404.html for 404 errors
        res.sendFile('404.html', { root: './public' });
    }
    else {
        // json response
        res.json(res.locals.error);
    }
};
exports.errorHandler = errorHandler;
