type SteamworksOverlayType = "friends" | "community" | "players" | "settings" | "official-game-group" | "stats" | "achievements";

interface SteamworksAchievementInfo {
    isAchieved: boolean;
    unlockTime: number;
}

interface SteamworksAuthTicketInfo {
    authTicket: number;
    ticketHexStr: string;
}

interface SteamworksScoreUploadResult {
    score: number;
    didScoreChange: boolean;
    globalRankNew: number;
    globalRankPrevious: number;
}

type SteamworksLeaderboardDataType = "global" | "global-around-user" | "friends";

interface SteamworksLeaderboardEntries {
    entries: SteamworksLeaderboardEntry[];
}

interface SteamworksLeaderboardEntry {
    personaName: string;
    globalRank: number;
    score: number;
}

declare class ISteamworksInstance {
    readonly isAvailable: boolean;
    readonly isRunningOnSteamDeck: boolean;
    readonly personaName: string;
    readonly accountId: number;
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

    uploadLeaderboardScore(leaderboardName: string, score: number, forceUpdate: boolean): Promise<SteamworksScoreUploadResult>;
    downloadLeaderboardEntries(leaderboardName: string, dataType: SteamworksLeaderboardDataType, start: number, end: number): Promise<SteamworksLeaderboardEntries>;

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
