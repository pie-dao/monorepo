"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiesService = void 0;
const pies_stubs_1 = require("../test/stubs/pies.stubs");
const pies_history_stubs_1 = require("../test/stubs/pies-history.stubs");
const common_1 = require("@nestjs/common");
exports.PiesService = jest.fn().mockReturnValue({
    getPies: jest.fn().mockImplementation((name, address) => {
        return new Promise((resolve, reject) => {
            let pies = pies_stubs_1.PiesStub();
            if (name === undefined && address == undefined) {
                resolve(pies);
            }
            else {
                if (pies.find(pie => pie.name == name) || pies.find(pie => pie.address == address)) {
                    resolve(pies);
                }
                else {
                    reject(new common_1.NotFoundException());
                }
            }
        });
    }),
    getPieByAddress: jest.fn().mockImplementation((address) => {
        return new Promise((resolve, reject) => {
            let pies = pies_stubs_1.PiesStub();
            let pie = pies.find(pie => pie.address == address);
            if (pie) {
                resolve(pie);
            }
            else {
                reject(new common_1.NotFoundException());
            }
        });
    }),
    getPieByName: jest.fn().mockImplementation((name) => {
        return new Promise((resolve, reject) => {
            let pies = pies_stubs_1.PiesStub();
            let pie = pies.find(pie => pie.name == name);
            if (pie) {
                resolve(pie);
            }
            else {
                reject(new common_1.NotFoundException());
            }
        });
    }),
    getPieHistory: jest.fn().mockImplementation((name, address) => {
        return new Promise((resolve, reject) => {
            let pies = pies_stubs_1.PiesStub();
            let pie = pies.find(pie => pie.address == address);
            if (pie) {
                resolve(pies_history_stubs_1.PieHistoryStub());
            }
            else {
                reject(new common_1.NotFoundException());
            }
        });
    })
});
//# sourceMappingURL=pies.service.js.map