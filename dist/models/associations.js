"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
const Product_1 = __importDefault(require("./Product"));
const Category_1 = __importDefault(require("./Category"));
const Order_1 = __importDefault(require("./Order"));
const OrderItem_1 = __importDefault(require("./OrderItem"));
const defineAssociations = () => {
    // User associations
    User_1.default.hasMany(Product_1.default, { foreignKey: 'userId' });
    User_1.default.hasMany(Category_1.default, { foreignKey: 'userId' });
    User_1.default.hasMany(Order_1.default, { foreignKey: 'userId' });
    // Category associations
    Category_1.default.hasMany(Product_1.default, { foreignKey: 'categoryId' });
    Category_1.default.belongsTo(User_1.default, { foreignKey: 'userId' });
    // Product associations
    Product_1.default.belongsTo(Category_1.default, { foreignKey: 'categoryId', as: 'category' });
    Product_1.default.belongsTo(User_1.default, { foreignKey: 'userId' });
    // Order associations
    Order_1.default.belongsTo(User_1.default, { foreignKey: 'userId' });
    Order_1.default.hasMany(OrderItem_1.default, { foreignKey: 'orderId', as: 'orderItems' });
    // OrderItem associations
    OrderItem_1.default.belongsTo(Order_1.default, { foreignKey: 'orderId' });
    OrderItem_1.default.belongsTo(Product_1.default, { foreignKey: 'productId' });
};
exports.default = defineAssociations;
