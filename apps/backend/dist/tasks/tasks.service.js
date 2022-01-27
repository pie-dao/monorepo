"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const ethers_1 = require("ethers");
let TasksService = class TasksService {
    constructor(httpService) {
        this.httpService = httpService;
        this.graphUrl = process.env.GRAPH_URL;
        this.GRAPH_MAX_PAGE_LENGTH = 1000;
        this.KPI_AIRDROP_AMOUNT = "10000000";
    }
    getKpiAirdrop(blockNumber) {
        return new Promise(async (resolve, reject) => {
            try {
                let veBalances = [];
                let balances;
                balances = await this.fetchVeDoughBalances(this.GRAPH_MAX_PAGE_LENGTH, "", blockNumber);
                while (balances.length > 0) {
                    veBalances = veBalances.concat(balances);
                    balances = await this.fetchVeDoughBalances(this.GRAPH_MAX_PAGE_LENGTH, veBalances[veBalances.length - 1].id, blockNumber);
                }
                let response = this.getResponse(veBalances);
                resolve(response);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    fetchVeDoughBalances(first, lastID, blockNumber) {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.httpService.post(this.graphUrl, {
                    query: `{
              stakers(first: ${first}, block: { number: ${blockNumber} }, where: { id_gt: "${lastID}" }) {
                id
                accountVeTokenBalance
              }
            }`
                }).toPromise();
                resolve(response.data.data.stakers);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getResponse(veBalances) {
        const AIRDROP_UNITS = ethers_1.ethers.utils.parseEther(this.KPI_AIRDROP_AMOUNT);
        let totalVeDoughs = veBalances.reduce((sum, { accountVeTokenBalance }) => sum.add(ethers_1.BigNumber.from(accountVeTokenBalance)), ethers_1.BigNumber.from(0));
        let proRata = AIRDROP_UNITS.mul(ethers_1.BigNumber.from(1e15)).div(totalVeDoughs);
        let airdropped = ethers_1.BigNumber.from(0);
        let airdropAmounts = [];
        veBalances.forEach(({ id, accountVeTokenBalance }) => {
            let userBalance = ethers_1.BigNumber.from(accountVeTokenBalance);
            let proRataAmount = proRata.mul(userBalance).div(ethers_1.BigNumber.from(1e15));
            airdropped = airdropped.add(proRataAmount);
            airdropAmounts.push({ id: id, amount: ethers_1.ethers.utils.formatEther(proRataAmount.toString()) });
        });
        let airdroppedString = ethers_1.ethers.utils.formatEther(airdropped.toString());
        return { amount: airdroppedString, airdropAmounts: airdropAmounts };
    }
};
TasksService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], TasksService);
exports.TasksService = TasksService;
//# sourceMappingURL=tasks.service.js.map