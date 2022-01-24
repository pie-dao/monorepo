"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiesModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const mongoose_1 = require("@nestjs/mongoose");
const pie_entity_1 = require("./entities/pie.entity");
const pie_history_entity_1 = require("./entities/pie-history.entity");
const pies_controller_1 = require("./pies.controller");
const pies_service_1 = require("./pies.service");
let PiesModule = class PiesModule {
};
PiesModule = __decorate([
    common_1.Module({
        imports: [
            axios_1.HttpModule,
            mongoose_1.MongooseModule.forFeature([{ name: pie_entity_1.PieEntity.name, schema: pie_entity_1.PieSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: pie_history_entity_1.PieHistoryEntity.name, schema: pie_history_entity_1.PieHistorySchema }])
        ],
        controllers: [pies_controller_1.PiesController],
        providers: [pies_service_1.PiesService]
    })
], PiesModule);
exports.PiesModule = PiesModule;
//# sourceMappingURL=pies.module.js.map