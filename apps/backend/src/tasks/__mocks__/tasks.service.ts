import { AirdropStub } from "../test/stubs/airdrop.stubs";

let TESTING_BLOCK = 13352729;

export const TasksService = jest.fn().mockReturnValue({
  getKpiAirdrop: jest.fn().mockImplementation((blockNumber) => {
    return new Promise((resolve, reject) => {
      let airdrop = AirdropStub();
      
      if(blockNumber == TESTING_BLOCK) {
        resolve(airdrop);
      } else {
        reject(new Error());
      }
    });
  }),
});