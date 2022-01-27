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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PiesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const mongoose_2 = require("mongoose");
const pie_entity_1 = require("./entities/pie.entity");
const ethers_1 = require("ethers");
const pieGetterABI = require("./abis/pieGetterABI.json");
const erc20 = require("./abis/erc20.json");
const erc20byte32 = require("./abis/erc20byte32.json");
const pie_history_entity_1 = require("./entities/pie-history.entity");
const bignumber_js_1 = require("bignumber.js");
const axios_1 = require("@nestjs/axios");
let PiesService = PiesService_1 = class PiesService {
    constructor(httpService, pieModel, pieHistoryModel) {
        this.httpService = httpService;
        this.pieModel = pieModel;
        this.pieHistoryModel = pieHistoryModel;
        this.pies = [
            { name: "BTC++", address: "0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd", history: [] },
            { name: "DEFI+S", address: "0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c", history: [] },
            { name: "DEFI++", address: "0x8d1ce361eb68e9e05573443c407d4a3bed23b033", history: [] },
            { name: "BCP", address: "0xe4f726adc8e89c6a6017f01eada77865db22da14", history: [] },
            { name: "YPIE", address: "0x17525E4f4Af59fbc29551bC4eCe6AB60Ed49CE31", history: [] },
            { name: "PLAY", address: "0x33e18a092a93ff21ad04746c7da12e35d34dc7c4", history: [] },
            { name: "DEFI+L", address: "0x78f225869c08d478c34e5f645d07a87d3fe8eb78", history: [] },
            { name: "USD++", address: "0x9a48bd0ec040ea4f1d3147c025cd4076a2e71e3e", history: [] },
            { name: "NOT_EXISTING_PIE", address: "0x0000000000000000000000000000000000000000", history: [] }
        ];
        this.logger = new common_1.Logger(PiesService_1.name);
    }
    async updateNAVs(test) {
        this.logger.debug("updateNAVs is running");
        const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.INFURA_RPC);
        const contract = new ethers_1.ethers.Contract(process.env.PIE_GETTER_CONTRACT, pieGetterABI, provider);
        let pies = await this.getPies(undefined, undefined, test);
        for (let k = 0; k < pies.length; k++) {
            const pie = new this.pieModel(pies[k]);
            try {
                let pieContract = new ethers_1.ethers.Contract(pie.address, erc20, provider);
                let pieSupply = await pieContract.totalSupply();
                let pieDecimals = await pieContract.decimals();
                let piePrecision = new bignumber_js_1.BigNumber(10).pow(pieDecimals);
                let totalSupply = new bignumber_js_1.BigNumber(pieSupply.toString()).div(piePrecision);
                let result = await contract.callStatic.getAssetsAndAmountsForAmount(pie.address, pieSupply);
                let underlyingAssets = result[0];
                let underylingTotals = result[1];
                let url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${underlyingAssets.join(',')}&vs_currencies=usd`;
                let response = await this.httpService.get(url).toPromise();
                let prices = response.data;
                const history = new this.pieHistoryModel({ timestamp: Date.now(), amount: 0, underlyingAssets: [] });
                let pieMarketCapUSD = new bignumber_js_1.BigNumber(0);
                for (let i = 0; i < underlyingAssets.length; i++) {
                    let underlyingContract = null;
                    if (underlyingAssets[i].toLowerCase() !== '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2'.toLowerCase()) {
                        underlyingContract = new ethers_1.ethers.Contract(underlyingAssets[i], erc20, provider);
                    }
                    else {
                        underlyingContract = new ethers_1.ethers.Contract(underlyingAssets[i], erc20byte32, provider);
                    }
                    let decimals = await underlyingContract.decimals();
                    let symbol = await underlyingContract.symbol();
                    let precision = new bignumber_js_1.BigNumber(10).pow(decimals);
                    let usdPrice = prices[underlyingAssets[i].toLowerCase()].usd;
                    let marketCapUSD = new bignumber_js_1.BigNumber(underylingTotals[i].toString()).times(usdPrice).div(precision);
                    history.underlyingAssets.push({
                        address: underlyingAssets[i],
                        symbol: symbol,
                        decimals: decimals,
                        amount: underylingTotals[i].toString(),
                        usdPrice: usdPrice.toString(),
                        marketCapUSD: marketCapUSD.toString()
                    });
                    pieMarketCapUSD = pieMarketCapUSD.plus(marketCapUSD);
                }
                ;
                history.marketCapUSD = pieMarketCapUSD;
                history.totalSupply = pieSupply;
                history.decimals = pieDecimals;
                history.nav = (pieMarketCapUSD.toNumber() / totalSupply.toNumber());
                let historyDB = await history.save();
                pie.history.push(historyDB);
                let pieDB = await pie.save();
                this.logger.debug(pie.name, "nav updated");
            }
            catch (error) {
                this.logger.error(pie.name, error.message);
            }
        }
        ;
        return true;
    }
    getPies(name, address, test) {
        return new Promise(async (resolve, reject) => {
            let pies = [];
            let error = null;
            switch (true) {
                case name !== undefined:
                    try {
                        pies.push(await this.getPieByName(name));
                    }
                    catch (catchedError) {
                        error = catchedError;
                    }
                    break;
                case address !== undefined:
                    try {
                        pies.push(await this.getPieByAddress(address));
                    }
                    catch (catchedError) {
                        error = catchedError;
                    }
                    break;
                default:
                    pies = await this.pieModel.find().exec();
                    if (pies.length === 0) {
                        for (let i = 0; i < this.pies.length; i++) {
                            pies.push(await this.createPie(this.pies[i]));
                        }
                        ;
                    }
                    else {
                        if (!test) {
                            pies = pies.filter(pie => pie.name != "NOT_EXISTING_PIE");
                        }
                    }
            }
            if (error) {
                reject(error);
            }
            else {
                resolve(pies);
            }
        });
    }
    getPieHistory(name, address) {
        return new Promise(async (resolve, reject) => {
            let pie = null;
            let error = null;
            switch (true) {
                case name !== undefined:
                    try {
                        pie = await this.getPieByName(name);
                    }
                    catch (catchedError) {
                        error = catchedError;
                    }
                    break;
                case address !== undefined:
                    try {
                        pie = await this.getPieByAddress(address);
                    }
                    catch (catchedError) {
                        error = catchedError;
                    }
                    break;
                default:
                    error = "either a Pie-Name or a Pie-Anddress must be provided";
            }
            if (pie) {
                resolve(await this.getPieHistoryDetails(pie));
            }
            else {
                reject(error);
            }
        });
    }
    getPieHistoryDetails(pie) {
        return new Promise(async (resolve, reject) => {
            try {
                let pieHistories = await this.pieHistoryModel.find({
                    '_id': { $in: pie.history }
                }).lean();
                resolve(pieHistories);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getPieByAddress(address) {
        return new Promise(async (resolve, reject) => {
            let pies = await this.pieModel.find().where('address').equals(address).lean();
            if (pies[0]) {
                resolve(pies[0]);
            }
            else {
                reject("Sorry, can't find any Pie in our database which matches your query.");
            }
        });
    }
    getPieByName(name) {
        return new Promise(async (resolve, reject) => {
            let pies = await this.pieModel.find().where('name').equals(name).lean();
            if (pies[0]) {
                resolve(pies[0]);
            }
            else {
                reject("Sorry, can't find any Pie in our database which matches your query.");
            }
        });
    }
    createPie(pie) {
        return new Promise(async (resolve, reject) => {
            try {
                pie.address = pie.address.toLocaleLowerCase();
                const createdPie = new this.pieModel(pie);
                let pieDB = await createdPie.save();
                resolve(pieDB);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    deletePie(pie) {
        return new Promise(async (resolve, reject) => {
            try {
                let pieDB = await this.pieModel.findOneAndDelete({ address: pie.address.toLocaleLowerCase() });
                resolve(pieDB);
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
__decorate([
    schedule_1.Cron('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], PiesService.prototype, "updateNAVs", null);
PiesService = PiesService_1 = __decorate([
    common_1.Injectable(),
    __param(1, mongoose_1.InjectModel(pie_entity_1.PieEntity.name)),
    __param(2, mongoose_1.InjectModel(pie_history_entity_1.PieHistoryEntity.name)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        mongoose_2.Model,
        mongoose_2.Model])
], PiesService);
exports.PiesService = PiesService;
//# sourceMappingURL=pies.service.js.map