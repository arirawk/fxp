export enum ModelType {
    SORA = 'Sora',
    VEO = 'Veo',
    VEO3 = 'Veo3'
}

export enum Language {
    ENGLISH = 'English',
    INDONESIAN = 'Indonesian'
}

export enum VoiceoverLanguage {
    INDONESIAN = 'Indonesian',
    ENGLISH = 'English',
    SFX = 'SFX'
}

export interface TimelineItem {
    timestamp: string;
    label: string;
    action: string;
    voiceover: string;
}

export interface ScriptContent {
    style: string;
    camera: string;
    scene: string;
    script_timeline: TimelineItem[];
    seo_title: string;
    description: string;
    cta_seo: string;
    hashtags: string;
}

export interface AppConfig {
    model: ModelType;
    sceneCount: number; // Only used for Veo3
    promptLang: Language;
    voLang: VoiceoverLanguage;
}
