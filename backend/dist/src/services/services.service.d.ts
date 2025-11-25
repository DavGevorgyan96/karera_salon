import { PrismaService } from '../prisma/prisma.service';
export declare class ServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(category?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        price: import("@prisma/client/runtime/library").Decimal;
        durationMinutes: number;
        description: string | null;
        isActive: boolean;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        price: import("@prisma/client/runtime/library").Decimal;
        durationMinutes: number;
        description: string | null;
        isActive: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create(data: any): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        price: import("@prisma/client/runtime/library").Decimal;
        durationMinutes: number;
        description: string | null;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: any): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        price: import("@prisma/client/runtime/library").Decimal;
        durationMinutes: number;
        description: string | null;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__ServiceClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        price: import("@prisma/client/runtime/library").Decimal;
        durationMinutes: number;
        description: string | null;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
