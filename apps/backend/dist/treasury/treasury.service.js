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
var TreasuryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreasuryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const treasury_entity_1 = require("./entities/treasury.entity");
const rxjs_1 = require("rxjs");
const TREASURY_CRON_FREQUENCY = '0 0 * * *';
let TreasuryService = TreasuryService_1 = class TreasuryService {
    constructor(httpService, treasuryModel) {
        this.httpService = httpService;
        this.treasuryModel = treasuryModel;
        this.logger = new common_1.Logger(TreasuryService_1.name);
        this.zapperApiUrl = 'https://api.zapper.fi/v1';
        this.treasury = process.env.TREASURY_ADDRESS;
        this.zapperApiKey = process.env.ZAPPER_API_KEY;
    }
    async getTreasury(days = 7) {
        const sinceDate = this.daysAgo(days);
        return this.treasuryModel.find({ createdAt: { $gte: sinceDate } });
    }
    daysAgo(days) {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d;
    }
    async createTreasuryRecord() {
        this.logger.log(`Treasury service executed at ${TREASURY_CRON_FREQUENCY}`);
        try {
            await this.loadTreasury();
        }
        catch (err) {
            console.error('There was an error fetching data from the Zapper API', err);
        }
    }
    async loadTreasury() {
        const networks = await this.getSupportedNetworks();
        const balances = await this.getNetworkBalances(networks);
        const underlyingAssets = this.getUnderlyingAssetsArray(balances);
        const total = this.getTotal(underlyingAssets);
        await this.loadDB(total);
    }
    async getSupportedNetworks() {
        const { zapperApiUrl, zapperApiKey, treasury } = this;
        const url = `${zapperApiUrl}/protocols/balances/supported?addresses%5B%5D=${treasury}&api_key=${zapperApiKey}`;
        return this.apiCall(url);
    }
    getUnderlyingAssetsArray(balances) {
        return this.flatten(balances.filter(({ length }) => length > 0));
    }
    getTotal(assets) {
        const treasury = assets.reduce((total, balance) => total + balance.total, 0);
        return {
            underlying_assets: assets,
            treasury,
        };
    }
    async getNetworkBalances(networks) {
        return Promise.all(networks.map((network) => this.getNetworkBalance(network)));
    }
    async getNetworkBalance(network) {
        const balances = await this.getBalanceSummary(network);
        const records = balances.filter((record) => this.recordHasUsefulData(record));
        return records;
    }
    async loadDB(record) {
        const model = new this.treasuryModel(record);
        await model.save();
    }
    async getBalanceSummary(supported) {
        const { zapperApiUrl, zapperApiKey, treasury } = this;
        const { network } = supported;
        const records = supported.apps.map(async (protocol) => {
            let url = '';
            url += `${zapperApiUrl}/protocols/${protocol.appId}/balances`;
            url += `?addresses%5B%5D=${treasury}&network=${network}&api_key=${zapperApiKey}`;
            const data = await this.apiCall(url);
            const treasuryValues = this.extractTreasuryValues(data);
            if (treasuryValues) {
                return Object.assign({ network, protocol: protocol.appId }, treasuryValues);
            }
        });
        return Promise.all(records);
    }
    extractTreasuryValues(balance) {
        const { meta } = balance[this.treasury];
        if (meta && meta.length > 0) {
            const labels = ['Assets', 'Debt', 'Total'];
            const treasuryArray = labels.map((label) => this.extractValuesFromMeta(meta, label));
            return Object.assign({}, ...treasuryArray);
        }
    }
    extractValuesFromMeta(meta, label) {
        const { value } = meta.find((m) => m.label === label);
        return { [label.toLowerCase()]: value };
    }
    recordHasUsefulData(record) {
        return record !== undefined && !(record.assets === 0 && record.debt === 0);
    }
    async apiCall(url) {
        const fetchSupported = this.httpService.get(url);
        const res = await rxjs_1.firstValueFrom(fetchSupported);
        return res.data;
    }
    flatten(arr) {
        return [].concat.apply([], arr);
    }
};
__decorate([
    schedule_1.Cron(TREASURY_CRON_FREQUENCY),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TreasuryService.prototype, "createTreasuryRecord", null);
TreasuryService = TreasuryService_1 = __decorate([
    common_1.Injectable(),
    __param(1, mongoose_1.InjectModel(treasury_entity_1.TreasuryEntity.name)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        mongoose_2.Model])
], TreasuryService);
exports.TreasuryService = TreasuryService;
//# sourceMappingURL=treasury.service.js.map