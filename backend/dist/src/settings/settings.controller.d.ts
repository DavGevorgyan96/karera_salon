import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
