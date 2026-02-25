import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Preferences {
    cursorStyle: CursorStyle;
    lastActiveTab: string;
    fontStyle: FontStyle;
    backgroundStyle: BackgroundStyle;
    notepad: string;
    cloakPreset: TabCloakPreset;
    accentColor: string;
}
export interface UserProfile {
    name: string;
}
export enum BackgroundStyle {
    starfield = "starfield",
    spaceNebula = "spaceNebula",
    darkOcean = "darkOcean",
    matrixCode = "matrixCode",
    cyberForest = "cyberForest",
    abstractGlitch = "abstractGlitch",
    solidDark = "solidDark",
    particleGrid = "particleGrid",
    neonCity = "neonCity",
    neonRain = "neonRain",
    cyberHexGrid = "cyberHexGrid"
}
export enum CursorStyle {
    arrowGlow = "arrowGlow",
    starBurst = "starBurst",
    neonDot = "neonDot",
    crosshair = "crosshair",
    ringPulse = "ringPulse"
}
export enum FontStyle {
    orbitron = "orbitron",
    sansSerif = "sansSerif",
    monospace = "monospace",
    rajdhani = "rajdhani",
    pressStart2P = "pressStart2P"
}
export enum TabCloakPreset {
    clever = "clever",
    google = "google",
    default_ = "default",
    youtube = "youtube",
    googleClassroom = "googleClassroom"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCCoins(amount: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCCoins(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPreferences(): Promise<Preferences>;
    getPurchasedEffects(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveNotepad(notepad: string): Promise<void>;
    savePreferences(lastActiveTab: string, accentColor: string, cursorStyle: CursorStyle, backgroundStyle: BackgroundStyle, fontStyle: FontStyle, cloakPreset: TabCloakPreset): Promise<void>;
    setPurchasedEffects(effects: Array<string>): Promise<void>;
    spendCCoins(amount: bigint): Promise<boolean>;
}
