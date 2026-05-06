type SteamworksOverlayType = "friends" | "community" | "players" | "settings" | "official-game-group" | "stats" | "achievements";

interface SteamworksAchievementInfo {
    isAchieved: boolean;
    unlockTime: number;
}

interface SteamworksAuthTicketInfo {
    authTicket: number;
    ticketHexStr: string;
}

declare class ISteamworksInstance {
    readonly isAvailble: boolean;
    readonly isRunningOnSteamDeck: boolean;
    readonly personaName: string;
    readonly accoundId: number;
    readonly steamId64Bit: string;
    readonly staticAccountKey: string;
    readonly appOwnerAccountId: number;
    readonly appOwnerSteamId64Bit: string;
    readonly appOwnerStaticAccountKey: string;
    readonly playerSteamLevel: number;
    readonly appId: number;
    readonly steamUILanguage: string;
    readonly currentGameLanguage: string;

    getAvailableGameLanguages(): string[];
    showOverlay(overlayType: SteamworksOverlayType): void;
    showOverlayInviteDialog(lobbyId: string): void;

    unlockAchievement(achievement: string): Promise<boolean>;
    clearAchievement(achievement: string): Promise<boolean>;
    getAchievementInfo(achievement: string): Promise<SteamworksAchievementInfo | null>;

    checkDlcInstalled(appIds: number): Promise<boolean>;
    isDlcInstalled(appId: number): boolean;
    installDlc(appId: number): void;
    uninstallDlc(appId: number): void;
    getAuthTicketForWebApi(identity?: string): Promise<SteamworksAuthTicketInfo>;
    readonly authTicket: number;
    readonly ticketHexStr: string;
    cancelAuthTicket(authTicket: number): void;

    setRichPresence(key: string, value: string): void;
    clearRichPresence(): void;

    triggerScreenshot(): void;
}