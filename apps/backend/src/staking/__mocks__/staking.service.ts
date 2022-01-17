import { StakersStub } from "../test/stubs/stakers.stubs";
import { LocksStub } from "../test/stubs/locks.stubs";
import { EpochsStub } from "../test/stubs/epochs.stubs";

export const StakingService = jest.fn().mockReturnValue({
  getStakers: jest.fn().mockImplementation((ids) => {
    return new Promise((resolve, reject) => {
      let stakers = StakersStub();
      let filteredStakers = [];

      if(ids == undefined) {
        resolve(stakers);
      } else {
        stakers.forEach(staker => {
          if(ids.includes(staker.id)) {
            filteredStakers.push(staker);
          }
        });

        if(filteredStakers.length > 0) {
          resolve(filteredStakers);
        } else {
          reject(new Error());
        }
      }
    });
  }),
  getLocks: jest.fn().mockImplementation((locked_at, ids) => {
    return new Promise((resolve, reject) => {
      let locks = LocksStub();
      let filteredLocks = [];

      if(ids == undefined) {
        resolve(locks);
      } else {
        locks.forEach(lock => {
          if(ids.includes(lock.staker.id)) {
            filteredLocks.push(lock);
          }
        });

        if(filteredLocks.length > 0) {
          resolve(filteredLocks);
        } else {
          reject(new Error());
        }
      }
    });
  }),
  getEpochs: jest.fn().mockImplementation((startDate: number) => {
    return new Promise((resolve, reject) => {
      if(startDate) {
        let epochs = EpochsStub();
        resolve(epochs);
      } else {
        reject(new Error());
      }
    });
  }),
  getEpoch: jest.fn().mockImplementation((id) => {
    return new Promise((resolve, reject) => {
      if((typeof id) == 'number') {
        let epochs = EpochsStub();
        resolve(epochs[epochs.length - 1]);
      } else {
        reject(new Error());        
      }
    });
  }),
  getMerkleTree: jest.fn().mockImplementation((participations: any[]) => {
    return new Promise((resolve, reject) => {
      if(participations && participations.length > 0) {
        resolve({});
      } else {
        reject(new Error());
      }
    });
  }),
  getFreeRiders: jest.fn().mockImplementation(() => {
    return new Promise((resolve, reject) => {
      let freeRiders = {};

      if(freeRiders) {
        resolve(freeRiders)
      } else {
        reject(new Error());
      }
    });
  }),
  generateEpoch: jest.fn().mockImplementation((
    month: number, 
    distributedRewards: string, 
    windowIndex: number, 
    blockNumber: number, 
    proposals: string) => {
    return new Promise((resolve, reject) => {
      if(proposals.length == 1 && proposals[0] == '"invalid_id"') {
        reject(new Error());
      } else {
        let epochs = EpochsStub();
        resolve(epochs[epochs.length - 1]);
      }
    });
  })  
});