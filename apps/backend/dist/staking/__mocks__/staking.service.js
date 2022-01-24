"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingService = void 0;
const stakers_stubs_1 = require("../test/stubs/stakers.stubs");
const locks_stubs_1 = require("../test/stubs/locks.stubs");
const epochs_stubs_1 = require("../test/stubs/epochs.stubs");
exports.StakingService = jest.fn().mockReturnValue({
    getStakers: jest.fn().mockImplementation((ids) => {
        return new Promise((resolve, reject) => {
            let stakers = stakers_stubs_1.StakersStub();
            let filteredStakers = [];
            if (ids == undefined) {
                resolve(stakers);
            }
            else {
                stakers.forEach(staker => {
                    if (ids.includes(staker.id)) {
                        filteredStakers.push(staker);
                    }
                });
                if (filteredStakers.length > 0) {
                    resolve(filteredStakers);
                }
                else {
                    reject(new Error());
                }
            }
        });
    }),
    getLocks: jest.fn().mockImplementation((locked_at, ids) => {
        return new Promise((resolve, reject) => {
            let locks = locks_stubs_1.LocksStub();
            let filteredLocks = [];
            if (ids == undefined) {
                resolve(locks);
            }
            else {
                locks.forEach(lock => {
                    if (ids.includes(lock.staker.id)) {
                        filteredLocks.push(lock);
                    }
                });
                if (filteredLocks.length > 0) {
                    resolve(filteredLocks);
                }
                else {
                    reject(new Error());
                }
            }
        });
    }),
    getEpochs: jest.fn().mockImplementation((startDate) => {
        return new Promise((resolve, reject) => {
            if (startDate) {
                let epochs = epochs_stubs_1.EpochsStub();
                resolve(epochs);
            }
            else {
                reject(new Error());
            }
        });
    }),
    getEpoch: jest.fn().mockImplementation((id) => {
        return new Promise((resolve, reject) => {
            if ((typeof id) == 'number') {
                let epochs = epochs_stubs_1.EpochsStub();
                resolve(epochs[epochs.length - 1]);
            }
            else {
                reject(new Error());
            }
        });
    }),
    getMerkleTree: jest.fn().mockImplementation((participations) => {
        return new Promise((resolve, reject) => {
            if (participations && participations.length > 0) {
                resolve({});
            }
            else {
                reject(new Error());
            }
        });
    }),
    getFreeRiders: jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
            let freeRiders = {};
            if (freeRiders) {
                resolve(freeRiders);
            }
            else {
                reject(new Error());
            }
        });
    }),
    generateEpoch: jest.fn().mockImplementation((month, distributedRewards, windowIndex, blockNumber, proposals) => {
        return new Promise((resolve, reject) => {
            if (proposals.length == 1 && proposals[0] == '"invalid_id"') {
                reject(new Error());
            }
            else {
                let epochs = epochs_stubs_1.EpochsStub();
                resolve(epochs[epochs.length - 1]);
            }
        });
    })
});
//# sourceMappingURL=staking.service.js.map