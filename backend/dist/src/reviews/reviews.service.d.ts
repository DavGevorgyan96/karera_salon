import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): import(".prisma/client").Prisma.Prisma__ReviewClient<{
        id: string;
        createdAt: Date;
        rating: number;
        clientName: string;
        status: import(".prisma/client").$Enums.ReviewStatus;
        staffId: string | null;
        text: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findApproved(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        rating: number;
        clientName: string;
        status: import(".prisma/client").$Enums.ReviewStatus;
        staffId: string | null;
        text: string;
    }[]>;
    findAll(status?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        rating: number;
        clientName: string;
        status: import(".prisma/client").$Enums.ReviewStatus;
        staffId: string | null;
        text: string;
    }[]>;
    updateStatus(id: string, status: string): import(".prisma/client").Prisma.Prisma__ReviewClient<{
        id: string;
        createdAt: Date;
        rating: number;
        clientName: string;
        status: import(".prisma/client").$Enums.ReviewStatus;
        staffId: string | null;
        text: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
