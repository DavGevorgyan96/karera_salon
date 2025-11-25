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
exports.BlockedTimesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BlockedTimesService = class BlockedTimesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.blockedTime.findMany({
            include: { staff: true },
        });
    }
    async create(data) {
        const date = new Date(data.date);
        let timeFrom = null;
        let timeTo = null;
        if (data.timeFrom) {
            timeFrom = new Date(`1970-01-01T${data.timeFrom}`);
            if (isNaN(timeFrom.getTime())) {
                timeFrom = new Date(data.timeFrom);
            }
        }
        if (data.timeTo) {
            timeTo = new Date(`1970-01-01T${data.timeTo}`);
            if (isNaN(timeTo.getTime())) {
                timeTo = new Date(data.timeTo);
            }
        }
        return this.prisma.blockedTime.create({
            data: {
                date: date,
                timeFrom: timeFrom,
                timeTo: timeTo,
                reason: data.reason,
                staffId: data.staffId || null,
            },
        });
    }
    async remove(id) {
        return this.prisma.blockedTime.delete({ where: { id } });
    }
};
exports.BlockedTimesService = BlockedTimesService;
exports.BlockedTimesService = BlockedTimesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlockedTimesService);
//# sourceMappingURL=blocked-times.service.js.map