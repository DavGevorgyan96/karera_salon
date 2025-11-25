import { PrismaService } from '../prisma/prisma.service';
export declare class AppointmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    checkAvailability(staffId: string, date: string, timeFrom: string): Promise<boolean>;
    create(data: any): Promise<{
        id: string;
        clientName: string;
        clientPhone: string;
        date: Date;
        timeFrom: Date;
        timeTo: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        commentFromClient: string | null;
        createdAt: Date;
        updatedAt: Date;
        serviceId: string;
        staffId: string | null;
    }>;
    findAll(query: any): import(".prisma/client").Prisma.PrismaPromise<({
        service: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            category: string;
            price: import("@prisma/client/runtime/library").Decimal;
            durationMinutes: number;
            description: string | null;
            isActive: boolean;
        };
        staff: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            avatarUrl: string | null;
            specializationId: string | null;
            rating: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        clientName: string;
        clientPhone: string;
        date: Date;
        timeFrom: Date;
        timeTo: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        commentFromClient: string | null;
        createdAt: Date;
        updatedAt: Date;
        serviceId: string;
        staffId: string | null;
    })[]>;
    updateStatus(id: string, status: string): import(".prisma/client").Prisma.Prisma__AppointmentClient<{
        id: string;
        clientName: string;
        clientPhone: string;
        date: Date;
        timeFrom: Date;
        timeTo: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        commentFromClient: string | null;
        createdAt: Date;
        updatedAt: Date;
        serviceId: string;
        staffId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
