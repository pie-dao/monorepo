"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const airdrop_stubs_1 = require("../test/stubs/airdrop.stubs");
let TESTING_BLOCK = 13352729;
exports.TasksService = jest.fn().mockReturnValue({
    getKpiAirdrop: jest.fn().mockImplementation((blockNumber) => {
        return new Promise((resolve, reject) => {
            let airdrop = airdrop_stubs_1.AirdropStub();
            if (blockNumber == TESTING_BLOCK) {
                resolve(airdrop);
            }
            else {
                reject(new Error());
            }
        });
    }),
});
//# sourceMappingURL=tasks.service.js.map