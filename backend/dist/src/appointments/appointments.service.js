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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AppointmentsService = class AppointmentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAvailability(staffId, date, timeFrom) {
        if (!staffId)
            return true;
        const checkDate = new Date(date);
        const checkTime = new Date(`1970-01-01T${timeFrom}:00`);
        const existing = await this.prisma.appointment.findFirst({
            where: {
                staffId,
                date: checkDate,
                status: { not: client_1.AppointmentStatus.CANCELED },
                AND: [
                    { timeFrom: { lte: checkTime } },
                    { timeTo: { gt: checkTime } }
                ]
            },
        });
        return !existing;
    }
    async create(data) {
        const service = await this.prisma.service.findUnique({ where: { id: data.serviceId } });
        if (!service)
            throw new Error('Service not found');
        const timeFromDate = new Date(`1970-01-01T${data.timeFrom}:00`);
        const timeToDate = new Date(timeFromDate.getTime() + service.durationMinutes * 60000);
        return this.prisma.appointment.create({
            data: {
                clientName: data.clientName,
                clientPhone: data.clientPhone,
                serviceId: data.serviceId,
                staffId: data.staffId || null,
                date: new Date(data.date),
                timeFrom: timeFromDate,
                timeTo: timeToDate,
                status: client_1.AppointmentStatus.NEW,
                commentFromClient: data.commentFromClient,
            },
        });
    }
    findAll(query) {
        const where = {};
        if (query.date)
            where.date = new Date(query.date);
        if (query.staffId)
            where.staffId = query.staffId;
        if (query.status)
            where.status = query.status;
        return this.prisma.appointment.findMany({
            where,
            include: { staff: true, service: true },
            orderBy: { date: 'asc' },
        });
    }
    updateStatus(id, status) {
        return this.prisma.appointment.update({
            where: { id },
            data: { status: status },
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map