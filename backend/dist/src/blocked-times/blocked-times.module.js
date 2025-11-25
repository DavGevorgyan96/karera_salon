"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedTimesModule = void 0;
const common_1 = require("@nestjs/common");
const blocked_times_service_1 = require("./blocked-times.service");
const blocked_times_controller_1 = require("./blocked-times.controller");
const prisma_service_1 = require("../prisma/prisma.service");
let BlockedTimesModule = class BlockedTimesModule {
};
exports.BlockedTimesModule = BlockedTimesModule;
exports.BlockedTimesModule = BlockedTimesModule = __decorate([
    (0, common_1.Module)({
        controllers: [blocked_times_controller_1.BlockedTimesController],
        providers: [blocked_times_service_1.BlockedTimesService, prisma_service_1.PrismaService],
    })
], BlockedTimesModule);
//# sourceMappingURL=blocked-times.module.js.map