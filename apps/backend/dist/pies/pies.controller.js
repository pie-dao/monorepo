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
exports.PiesController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pie_history_entity_1 = require("./entities/pie-history.entity");
const pie_entity_1 = require("./entities/pie.entity");
const pies_service_1 = require("./pies.service");
let PiesController = class PiesController {
    constructor(piesService) {
        this.piesService = piesService;
    }
    async getPies(name, address) {
        try {
            return await this.piesService.getPies(name, address);
        }
        catch (error) {
            throw new common_1.NotFoundException(error);
        }
    }
    ;
    async getPieHistory(name, address) {
        try {
            return await this.piesService.getPieHistory(name, address);
        }
        catch (error) {
            throw new common_1.NotFoundException(error);
        }
    }
    ;
    async getPieByAddress(address) {
        try {
            return await this.piesService.getPieByAddress(address);
        }
        catch (error) {
            throw new common_1.NotFoundException(error);
        }
    }
    async getPieByName(name) {
        try {
            return await this.piesService.getPieByName(name);
        }
        catch (error) {
            throw new common_1.NotFoundException(error);
        }
    }
};
__decorate([
    swagger_1.ApiOkResponse({ type: pie_entity_1.PieEntity, isArray: true }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    swagger_1.ApiQuery({ name: 'name', required: false }),
    swagger_1.ApiQuery({ name: 'address', required: false }),
    common_1.Get('all'),
    __param(0, common_2.Query('name')),
    __param(1, common_2.Query('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PiesController.prototype, "getPies", null);
__decorate([
    swagger_1.ApiOkResponse({ type: pie_history_entity_1.PieHistoryEntity, isArray: true }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    swagger_1.ApiQuery({ name: 'name', required: false }),
    swagger_1.ApiQuery({ name: 'address', required: false }),
    common_1.Get('history'),
    __param(0, common_2.Query('name')),
    __param(1, common_2.Query('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PiesController.prototype, "getPieHistory", null);
__decorate([
    swagger_1.ApiOkResponse({ type: pie_entity_1.PieEntity, isArray: false }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    common_1.Get('address/:address'),
    __param(0, common_1.Param('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PiesController.prototype, "getPieByAddress", null);
__decorate([
    swagger_1.ApiOkResponse({ type: pie_entity_1.PieEntity, isArray: false }),
    swagger_1.ApiNotFoundResponse(),
    swagger_1.ApiBadRequestResponse(),
    common_1.Get('name/:name'),
    __param(0, common_1.Param('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PiesController.prototype, "getPieByName", null);
PiesController = __decorate([
    swagger_1.ApiTags('Pies'),
    common_3.Controller('pies'),
    __metadata("design:paramtypes", [pies_service_1.PiesService])
], PiesController);
exports.PiesController = PiesController;
//# sourceMappingURL=pies.controller.js.map