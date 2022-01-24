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
exports.TreasuryController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const treasury_service_1 = require("./treasury.service");
const swagger_1 = require("@nestjs/swagger");
const treasury_entity_1 = require("./entities/treasury.entity");
const getTreasury_dto_1 = require("./dto/getTreasury.dto");
let TreasuryController = class TreasuryController {
    constructor(treasuryService) {
        this.treasuryService = treasuryService;
    }
    async getTreasury(params) {
        try {
            return await this.treasuryService.getTreasury(params.days);
        }
        catch (error) {
            throw new common_1.NotFoundException(error);
        }
    }
};
__decorate([
    swagger_1.ApiOkResponse({ type: treasury_entity_1.TreasuryEntity, isArray: true }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    swagger_1.ApiQuery({
        name: 'days',
        required: false,
        description: 'Number of days of data to fetch, defaults to 7',
    }),
    common_1.Get(),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getTreasury_dto_1.GetTreasuryQuery]),
    __metadata("design:returntype", Promise)
], TreasuryController.prototype, "getTreasury", null);
TreasuryController = __decorate([
    swagger_1.ApiTags('Treasury'),
    common_2.Controller('treasury'),
    __metadata("design:paramtypes", [treasury_service_1.TreasuryService])
], TreasuryController);
exports.TreasuryController = TreasuryController;
//# sourceMappingURL=treasury.controller.js.map