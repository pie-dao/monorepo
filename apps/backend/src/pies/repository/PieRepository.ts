import { Pie } from '../domain/pie';

export abstract class PieRepository {
  abstract create(pie: Pie): Promise<Pie>;
  abstract findOneByName(name: string): Promise<Pie | null>;
  abstract findOneBySymbol(symbol: string): Promise<Pie | null>;
  abstract findAll(): Promise<Pie[]>;
}

export class PieRepositoryStub extends PieRepository {
  constructor(private pies: Pie[]) {
    super();
  }

  create(pie: Pie): Promise<Pie> {
    this.pies.push(pie);
    return Promise.resolve(pie);
  }

  findOneByName(name: string): Promise<Pie> {
    const result = this.pies.find((p) => p.name === name);
    return result ? Promise.resolve(result) : Promise.resolve(null);
  }

  findOneBySymbol(symbol: string): Promise<Pie> {
    const result = this.pies.find((p) => p.symbol === symbol);
    return result ? Promise.resolve(result) : Promise.resolve(null);
  }

  findAll(): Promise<Pie[]> {
    return Promise.resolve(this.pies);
  }
}
