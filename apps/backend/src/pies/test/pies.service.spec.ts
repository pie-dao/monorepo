import { HttpModule } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { PieDto } from '../dto/pies.dto';
import { PieHistoryEntity, PieHistorySchema } from '../entities/pie-history.entity';
import { PieEntity, PieSchema } from '../entities/pie.entity';
import { PiesService } from '../pies.service';
import { PiesStub, PieStub } from './stubs/pies.stubs';

describe('PiesService', () => {
  let service: PiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot(),
        ScheduleModule.forRoot(),        
        MongooseModule.forRoot(process.env.MONGO_DB_TEST),
        MongooseModule.forFeature([{ name: PieEntity.name, schema: PieSchema }]),
        MongooseModule.forFeature([{ name: PieHistoryEntity.name, schema: PieHistorySchema }])        
      ],
      providers: [PiesService],
    }).compile();

    service = module.get<PiesService>(PiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reset DB and re-initiate it', () => {
    describe('When DB is empty, all pies should be initiated', () => {
      jest.setTimeout(50000);
      let piesDB: PieEntity[];

      beforeAll(async () => {
        jest.spyOn(service, "getPies");
        
        let pies = PiesStub();

        for(let i = 0; i < pies.length; i++) {
          await service.deletePie(pies[i]);
        };

        piesDB = await service.getPies();
      }); 
      
      test('then it return an array of 9 PieEntity', () => {
        expect(piesDB).toHaveLength(9);
      });
    });
  });    

  describe('getPies', () => {
    describe('When getPies is called', () => {
      jest.setTimeout(50000);
      let pies: PieEntity[];

      beforeEach(async () => {
        jest.spyOn(service, "getPies");
        pies = await service.getPies();
      });

      test('then it should call pieService.getPies', () => {
        expect(service.getPies).toHaveBeenCalled();
      });

      test('then it should return an Array of PieEntity', () => {
        let piesMock = PiesStub();

        expect(pies).toEqual(
          expect.arrayContaining([
            expect.objectContaining({name: piesMock[0].name, address: piesMock[0].address.toLowerCase()}),
            expect.objectContaining({name: piesMock[1].name, address: piesMock[1].address.toLowerCase()}),
            expect.objectContaining({name: piesMock[2].name, address: piesMock[2].address.toLowerCase()}),
            expect.objectContaining({name: piesMock[3].name, address: piesMock[3].address.toLowerCase()}),
            expect.objectContaining({name: piesMock[4].name, address: piesMock[4].address.toLowerCase()}),
            expect.objectContaining({name: piesMock[5].name, address: piesMock[5].address.toLowerCase()}),
            expect.objectContaining({name: piesMock[6].name, address: piesMock[6].address.toLowerCase()}),
            expect.objectContaining({name: piesMock[7].name, address: piesMock[7].address.toLowerCase()})
          ])
        );
      });

      test('it should throw an error if no records are found by name', async() => {
        await expect(service.getPies("not_existing_token", undefined))
        .rejects
        .toEqual("Sorry, can't find any Pie in our database which matches your query.")
      });

      test('it should throw an error if no records are found by address', async() => {
        await expect(service.getPies(undefined, "not_existing_token"))
        .rejects
        .toEqual("Sorry, can't find any Pie in our database which matches your query.")
      });          
    });
  });

  describe('getPies by Name', () => {
    describe('When getPies is called with a name param', () => {
      jest.setTimeout(50000);
      let pies: PieEntity[];

      beforeEach(async () => {
        jest.spyOn(service, "getPies");
        pies = await service.getPies(PieStub().name, undefined);
      });

      test('then it should call pieService.getPies', () => {
        expect(service.getPies).toHaveBeenCalledWith(PieStub().name, undefined);
      });

      test('then it should return an Array of PieEntity', () => {
        expect(pies).toEqual(
          expect.arrayContaining([
            expect.objectContaining({name: PieStub().name, address: PieStub().address.toLowerCase()})
          ])
        );
      });
    });
  });  

  describe('getPies by Address', () => {
    describe('When getPies is called with an address param', () => {
      jest.setTimeout(50000);
      let pies: PieEntity[];

      beforeEach(async () => {
        jest.spyOn(service, "getPies");
        pies = await service.getPies(undefined, PieStub().address);
      });

      test('then it should call pieService.getPies', () => {
        expect(service.getPies).toHaveBeenCalledWith(undefined, PieStub().address);
      });

      test('then it should return an Array of PieEntity', () => {
        expect(pies).toEqual(
          expect.arrayContaining([
            expect.objectContaining({name: PieStub().name, address: PieStub().address.toLowerCase()})
          ])
        );
      });
    });
  });   

  describe('getPieByAddress', () => {
    describe('When getPieByAddress is called', () => {
      jest.setTimeout(50000);
      let pie: PieEntity;

      beforeEach(async () => {
        jest.spyOn(service, "getPieByAddress");
        pie = await service.getPieByAddress(PieStub().address);
      });

      test('then it should call pieService.getPieByAddress', () => {
        expect(service.getPieByAddress).toHaveBeenCalledWith(PieStub().address);
      });

      test('then it should return a PieEntity', () => {
        expect(pie.address).toEqual(PieStub().address.toLowerCase());
      });
    });
  }); 

  describe('getPieByName', () => {
    describe('When getPieByName is called', () => {
      jest.setTimeout(50000);
      let pie: PieEntity;

      beforeEach(async () => {
        jest.spyOn(service, "getPieByName");
        pie = await service.getPieByName(PieStub().name);
      });

      test('then it should call pieService.getPieByName', () => {
        expect(service.getPieByName).toHaveBeenCalledWith(PieStub().name);
      });

      test('then it should return a PieEntity', () => {
        expect(pie.name).toEqual(PieStub().name);
      });
    });
  });   

  describe('getPieHistory', () => {
    describe('When getPieHistory is called with an address param', () => {
      jest.setTimeout(50000);
      let pieHistory: PieHistoryEntity[];

      beforeEach(async () => {
        jest.spyOn(service, "getPieHistory");
        pieHistory = await service.getPieHistory(undefined, PieStub().address.toLowerCase());
      });

      test('then it should call pieService.getPieHistory', () => {
        expect(service.getPieHistory).toHaveBeenCalledWith(undefined, PieStub().address.toLowerCase());
      });

      test('then it should return a PieHistoryEntity', () => {
        expect(typeof pieHistory).toBe("object");
      });

      test('it should throw an error if no records are found by address', async() => {
        await expect(service.getPieHistory(undefined, "not_existing_token"))
        .rejects
        .toEqual("Sorry, can't find any Pie in our database which matches your query.")
      });       
    });

    describe('When getPieHistory is called with a name param', () => {
      let pieHistory: PieHistoryEntity[];

      beforeEach(async () => {
        jest.setTimeout(50000);
        jest.spyOn(service, "getPieHistory");
        pieHistory = await service.getPieHistory(PieStub().name, undefined);
      });

      test('then it should call pieService.getPieHistory', () => {
        expect(service.getPieHistory).toHaveBeenCalledWith(PieStub().name, undefined);
      });

      test('then it should return a PieHistoryEntity', () => {
        expect(typeof pieHistory).toBe("object");
      });

      test('it should throw an error if no records are found by name', async() => {
        await expect(service.getPieHistory("not_existing_token", undefined))
        .rejects
        .toEqual("Sorry, can't find any Pie in our database which matches your query.")
      });       
    });  
    
    describe('When getPieHistory is called with NO param', () => {
      let pieHistory: PieHistoryEntity[];

      beforeEach(async () => {
        jest.setTimeout(50000);
        jest.spyOn(service, "getPieHistory");
      });

      test('it should throw an error', async() => {
        await expect(service.getPieHistory(undefined, undefined))
        .rejects
        .toEqual("either a Pie-Name or a Pie-Anddress must be provided")
      });       
    });   
    
    describe('When getPieHistory is called on a token without history', () => {

      beforeEach(async () => {
        jest.setTimeout(50000);
        jest.spyOn(service, "getPieHistoryDetails");
      });

      test('it should throw an error', async() => {
        await expect(service.getPieHistoryDetails(undefined))
        .rejects
        .toThrow(Error);
      });
    });    
  }); 
  
  describe('createPie', () => {
    describe('When createPie is called', () => {
      jest.setTimeout(50000);
      let pie: PieDto = {name: "foobar", address: "foobar", history: []};
      let pieDB: PieEntity;

      beforeEach(async () => {
        jest.spyOn(service, "createPie");
        pieDB = await service.createPie(pie);
      });

      test('then it should call pieService.createPie', () => {
        expect(service.createPie).toHaveBeenCalledWith(pie);
      });

      test('then it should return a PieEntity', () => {
        expect(pieDB.name).toEqual(pie.name);
        expect(typeof pieDB).toBe("object");
      });

      test('it should throw an error if a non valid pieEntity is passed', async() => {
        await expect(service.createPie(undefined))
        .rejects
        .toThrow(Error);
      });      
    });
  }); 
  
  describe('deletePie', () => {
    describe('When deletePie is called', () => {
      jest.setTimeout(50000);
      let pieDB: PieEntity;
      let response: PieEntity;

      beforeEach(async () => {
        jest.spyOn(service, "deletePie");
        pieDB = await service.getPieByName("foobar");
        response = await service.deletePie(pieDB);
      });

      test('then it should call pieService.deletePie', () => {
        expect(service.deletePie).toHaveBeenCalledWith(pieDB);
      });

      test('then it should detele a PieEntity', () => {
        expect(typeof pieDB).toBe("object");
      });

      test('it should throw an error if a non valid pieEntity is passed', async() => {
        await expect(service.deletePie(undefined))
        .rejects
        .toThrow(Error);
      });       
    });
  }); 

  describe('updateNAVs', () => {
    describe('When calling updateNAVs', () => {
      jest.setTimeout(500000);

      beforeEach(async() => {
        jest.spyOn(service, "updateNAVs");
        await service.updateNAVs(true);
      });

      test('then it should call pieService.updateNAVs', () => {
        expect(service.updateNAVs).toHaveBeenCalled();
      });     
    });    
  });   
});
