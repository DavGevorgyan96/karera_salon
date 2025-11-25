import { PrismaService } from '../prisma/prisma.service';
export declare class BlockedTimesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        staff: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            avatarUrl: string | null;
            specializationId: string | null;
            rating: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        timeFrom: Date | null;
        timeTo: Date | null;
        staffId: string | null;
        reason: string | null;
    })[]>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        timeFrom: Date | null;
        timeTo: Date | null;
        staffId: string | null;
        reason: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        timeFrom: Date | null;
        timeTo: Date | null;
        staffId: string | null;
        reason: string | null;
    }>;
}
