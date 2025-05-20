"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class Order extends sequelize_1.Model {
    // Override toJSON to return only dataValues
    toJSON() {
        return this.get({ plain: true });
    }
}
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    total: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        get() {
            const value = this.getDataValue('total');
            if (typeof value === 'number') {
                return value;
            }
            return value ? parseFloat(value) : null;
        }
    },
}, {
    sequelize: database_config_1.default,
    modelName: 'Order',
});
exports.default = Order;
