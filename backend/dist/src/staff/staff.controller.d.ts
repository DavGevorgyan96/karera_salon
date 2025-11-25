import { StaffService } from './staff.service';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        specialization: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        avatarUrl: string | null;
        specializationId: string | null;
        rating: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__StaffClient<{
        specialization: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        avatarUrl: string | null;
        specializationId: string | null;
        rating: import("@prisma/client/runtime/library").Decimal;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create(createStaffDto: any): import(".prisma/client").Prisma.Prisma__StaffClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        avatarUrl: string | null;
        specializationId: string | null;
        rating: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateStaffDto: any): import(".prisma/client").Prisma.Prisma__StaffClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        avatarUrl: string | null;
        specializationId: string | null;
        rating: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__StaffClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        avatarUrl: string | null;
        specializationId: string | null;
        rating: import("@prisma/client/runtime/library").Decimal;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
