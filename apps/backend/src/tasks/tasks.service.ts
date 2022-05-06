import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ethers, BigNumber } from 'ethers';
import {
  AirdropAmount,
  AirdropResponse,
} from './types/tasks.types.AirdropResponse';
import { AccountVeBalance } from './types/tasks.types.AccountBalance';

@Injectable()
export class TasksService {
  // TODO: change this url into the subgraph mainnet one, once deployed...
  private graphUrl = process.env.GRAPH_URL;
  private GRAPH_MAX_PAGE_LENGTH = 1000;
  private KPI_AIRDROP_AMOUNT = '10000000';

  constructor(private httpService: HttpService) {}

  async getKpiAirdrop(blockNumber: number): Promise<AirdropResponse> {
    let veBalances: AccountVeBalance[] = [];
    let balances: AccountVeBalance[];

    balances = await this.fetchVeDoughBalances(
      this.GRAPH_MAX_PAGE_LENGTH,
      '',
      blockNumber,
    );

    while (balances.length > 0) {
      veBalances = veBalances.concat(balances);
      balances = await this.fetchVeDoughBalances(
        this.GRAPH_MAX_PAGE_LENGTH,
        veBalances[veBalances.length - 1].id,
        blockNumber,
      );
    }

    const response: AirdropResponse = this.getResponse(veBalances);

    return response;
  }

  private async fetchVeDoughBalances(
    first: number,
    lastID: string,
    blockNumber: number,
  ): Promise<AccountVeBalance[]> {
    const response = await this.httpService
      .post(this.graphUrl, {
        query: `{
              stakers(first: ${first}, block: { number: ${blockNumber} }, where: { id_gt: "${lastID}" }) {
                id
                accountVeTokenBalance
              }
            }`,
      })
      .toPromise();

    return response.data.data.stakers;
  }

  private getResponse(veBalances: AccountVeBalance[]): AirdropResponse {
    const AIRDROP_UNITS = ethers.utils.parseEther(this.KPI_AIRDROP_AMOUNT); // 10 millions KPIs
    const totalVeDoughs = veBalances.reduce(
      (sum, { accountVeTokenBalance }) =>
        sum.add(BigNumber.from(accountVeTokenBalance)),
      BigNumber.from(0),
    );
    const proRata = AIRDROP_UNITS.mul(BigNumber.from(1e15)).div(totalVeDoughs); // 24 decimals

    let airdropped = BigNumber.from(0);
    const airdropAmounts: AirdropAmount[] = [];

    veBalances.forEach(({ id, accountVeTokenBalance }): any => {
      const userBalance = BigNumber.from(accountVeTokenBalance);
      const proRataAmount = proRata.mul(userBalance).div(BigNumber.from(1e15));
      airdropped = airdropped.add(proRataAmount);
      airdropAmounts.push({
        id: id,
        amount: ethers.utils.formatEther(proRataAmount.toString()),
      } as AirdropAmount);
    });

    const airdroppedString = ethers.utils.formatEther(airdropped.toString());

    return <AirdropResponse>{
      amount: airdroppedString,
      airdropAmounts: airdropAmounts,
    };
  }
}
