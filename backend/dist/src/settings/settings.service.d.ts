import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        workHoursJson: import("@prisma/client/runtime/library").JsonValue;
        contactPhone: string;
        contactAddress: string;
        contactTelegram: string | null;
        contactWhatsApp: string | null;
        categories: string[];
        heroTitle: string | null;
        heroSubtitle: string | null;
    }>;
    updateSettings(data: any): Promise<{
        id: string;
        workHoursJson: import("@prisma/client/runtime/library").JsonValue;
        contactPhone: string;
        contactAddress: string;
        contactTelegram: string | null;
        contactWhatsApp: string | null;
        categories: string[];
        heroTitle: string | null;
        heroSubtitle: string | null;
    }>;
}
