"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeeders = void 0;
const adminSeeder_1 = require("./adminSeeder");
const runSeeders = async () => {
    try {
        await (0, adminSeeder_1.seedAdmin)();
        console.log('All seeders completed successfully');
    }
    catch (error) {
        console.error('Error running seeders:', error);
        throw error;
    }
};
exports.runSeeders = runSeeders;
