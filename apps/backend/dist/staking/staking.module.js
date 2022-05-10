"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingModule = void 0;
const common_1 = require("@nestjs/common");
const staking_service_1 = require("./staking.service");
const staking_controller_1 = require("./staking.controller");
const axios_1 = require("@nestjs/axios");
const mongoose_1 = require("@nestjs/mongoose");
const merkleTreeDistributor_1 = require("../helpers/merkleTreeDistributor/merkleTreeDistributor");
const epoch_entity_1 = require("./entities/epoch.entity");
let StakingModule = class StakingModule {
};
StakingModule = __decorate([
    common_1.Module({
        imports: [
            axios_1.HttpModule,
            mongoose_1.MongooseModule.forFeature([{ name: epoch_entity_1.EpochEntity.name, schema: epoch_entity_1.EpochSchema }])
        ],
        controllers: [staking_controller_1.StakingController],
        providers: [staking_service_1.StakingService, merkleTreeDistributor_1.MerkleTreeDistributor],
        exports: [staking_service_1.StakingService, merkleTreeDistributor_1.MerkleTreeDistributor]
    })
], StakingModule);
exports.StakingModule = StakingModule;
//# sourceMappingURL=staking.module.js.map