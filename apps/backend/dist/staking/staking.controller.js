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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const epoch_entity_1 = require("./entities/epoch.entity");
const staking_service_1 = require("./staking.service");
let StakingController = class StakingController {
    constructor(stakingService) {
        this.stakingService = stakingService;
    }
    async getStakers(ids) {
        try {
            let stakersIds = null;
            if (ids) {
                stakersIds = ids.split(",").map(id => '"' + id + '"');
            }
            return await this.stakingService.getStakers(stakersIds);
        }
        catch (error) {
            throw new common_1.NotFoundException(error);
        }
    }
    ;
    async getLocks(locked_at, ids) {
        try {
            let stakersIds = null;
            if (ids) {
                stakersIds = ids.split(",").map(id => '"' + id + '"');
            }
            return await this.stakingService.getLocks(locked_at, stakersIds);
        }
        catch (error) {
            throw new common_1.NotFoundException(error);
        }
    }
    ;
    async getEpochs(startDate) {
        try {
            return await this.stakingService.getEpochs(startDate);
        }
        catch (error) {
            throw new common_1.NotFoundException(error);
        }
    }
    ;
    async getEpoch(windowIndex) {
        try {
            return await this.stakingService.getEpoch(windowIndex);
        }
        catch (error) {
            throw new common_1.NotFoundException(error);
        }
    }
    ;
    async getFreeRiders(month, blockNumber, proposals) {
        try {
            if (month === undefined || blockNumber === undefined) {
                throw new common_1.InternalServerErrorException({ error: "month / blockNumber are mandatory params." }, null);
            }
            let proposalsIds = proposals ? proposals.split(",").map(id => '"' + id + '"') : null;
            return await this.stakingService.getFreeRiders(month, blockNumber, proposalsIds);
        }
        catch (error) {
            throw new common_1.NotFoundException(error);
        }
    }
    ;
};
__decorate([
    swagger_1.ApiOkResponse({ type: Array, isArray: true }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    swagger_1.ApiQuery({ name: 'ids', required: false }),
    common_1.Get('stakers'),
    __param(0, common_1.Query('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "getStakers", null);
__decorate([
    swagger_1.ApiOkResponse({ type: Array, isArray: true }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    swagger_1.ApiQuery({ name: 'locked_at', required: false }),
    swagger_1.ApiQuery({ name: 'ids', required: false }),
    common_1.Get('locks'),
    __param(0, common_1.Query('locked_at')),
    __param(1, common_1.Query('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "getLocks", null);
__decorate([
    swagger_1.ApiOkResponse({ type: epoch_entity_1.EpochEntity, isArray: true }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    swagger_1.ApiQuery({ name: 'startDate', required: false }),
    common_1.Get('epochs'),
    __param(0, common_1.Query('startDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "getEpochs", null);
__decorate([
    swagger_1.ApiOkResponse({ type: epoch_entity_1.EpochEntity }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    swagger_1.ApiQuery({ name: 'windowIndex', required: false }),
    common_1.Get('epoch'),
    __param(0, common_1.Query('windowIndex')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "getEpoch", null);
__decorate([
    swagger_1.ApiOkResponse({ type: Object, isArray: false }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    swagger_1.ApiQuery({ name: 'month', required: true }),
    swagger_1.ApiQuery({ name: 'blockNumber', required: true }),
    swagger_1.ApiQuery({ name: 'proposals', required: true, isArray: true }),
    common_1.Get('free-riders'),
    __param(0, common_1.Query('month')),
    __param(1, common_1.Query('blockNumber')),
    __param(2, common_1.Query('proposals')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], StakingController.prototype, "getFreeRiders", null);
StakingController = __decorate([
    swagger_1.ApiTags('Staking'),
    common_1.Controller('staking'),
    __metadata("design:paramtypes", [staking_service_1.StakingService])
], StakingController);
exports.StakingController = StakingController;
//# sourceMappingURL=staking.controller.js.map