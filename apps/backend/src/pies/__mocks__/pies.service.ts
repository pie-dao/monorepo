import { PiesStub, PieStub } from "../test/stubs/pies.stubs";
import { PieHistoryStub } from "../test/stubs/pies-history.stubs";
import { NotFoundException } from "@nestjs/common";

export const PiesService = jest.fn().mockReturnValue({
  getPies: jest.fn().mockImplementation((name, address) => { 
    return new Promise((resolve, reject) => {
      let pies = PiesStub();

      if(name === undefined && address == undefined) {
        resolve(pies);
      } else {
        if(pies.find(pie => pie.name == name) || pies.find(pie => pie.address == address)) {
          resolve(pies);
        } else {
          reject(new NotFoundException());
        }
      }
    });
  }),
  getPieByAddress: jest.fn().mockImplementation((address) => { 
    return new Promise((resolve, reject) => {
      let pies = PiesStub();
      let pie = pies.find(pie => pie.address == address);

      if(pie) {
        resolve(pie);
      } else {
        reject(new NotFoundException());
      }
    });
  }),
  getPieByName: jest.fn().mockImplementation((name) => { 
    return new Promise((resolve, reject) => {
      let pies = PiesStub();
      let pie = pies.find(pie => pie.name == name);

      if(pie) {
        resolve(pie);
      } else {
        reject(new NotFoundException());
      }
    });
  }),
  getPieHistory: jest.fn().mockImplementation((name, address) => { 
    return new Promise((resolve, reject) => {
      let pies = PiesStub();
      let pie = pies.find(pie => pie.address == address);

      if(pie) {
        resolve(PieHistoryStub());
      } else {
        reject(new NotFoundException());
      }
    });
  })
});