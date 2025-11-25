import { SpecializationsService } from './specializations.service';
export declare class SpecializationsController {
    private readonly service;
    constructor(service: SpecializationsService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
    }[]>;
    create(name: string): import(".prisma/client").Prisma.Prisma__SpecializationClient<{
        id: string;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__SpecializationClient<{
        id: string;
        name: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
