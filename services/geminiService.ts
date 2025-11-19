import { GoogleGenAI, Type } from "@google/genai";
import { AppConfig, ModelType, ScriptContent, VoiceoverLanguage } from "../types";

const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        style: { type: Type.STRING, description: "Gaya sinematik dan estetika visual." },
        camera: { type: Type.STRING, description: "Petunjuk bidikan dan pergerakan kamera." },
        scene: { type: Type.STRING, description: "Deskripsi lokasi dan suasana." },
        script_timeline: {
            type: Type.ARRAY,
            description: "Urutan adegan/scene.",
            items: {
                type: Type.OBJECT,
                properties: {
                    timestamp: { type: Type.STRING, description: "Rentang waktu adegan (misalnya, [00:00-00:08])." },
                    label: { type: Type.STRING, description: "Judul Scene (Scene 1, Scene 2, dst atau Hook, Climax)." },
                    action: { type: Type.STRING, description: "Deskripsi visual dan aksi detil untuk scene ini." },
                    voiceover: { type: Type.STRING, description: "Naskah Voiceover/Narasi (dubbing) untuk scene ini. Wajib diisi untuk mode Storytelling." }
                },
                required: ["timestamp", "label", "action"]
            }
        },
        seo_title: { type: Type.STRING, description: "Judul video yang menarik dan SEO-friendly, maks 60 karakter." },
        description: { type: Type.STRING, description: "Deskripsi singkat video yang menjual konsepnya, maks 150 karakter." },
        cta_seo: { type: Type.STRING, description: "Ajakan bertindak yang persuasif dan SEO-friendly (Call to Action)." },
        hashtags: { type: Type.STRING, description: "Daftar hashtag yang relevan, dipisahkan koma dan diawali simbol '#'." }
    },
    required: ["style", "camera", "scene", "script_timeline", "seo_title", "description", "cta_seo", "hashtags"]
};

export const generateVideoScript = async (prompt: string, config: AppConfig): Promise<ScriptContent> => {
    let durationDescription, partsInstruction, systemRoleAddon;

    if (config.model === ModelType.SORA) {
        durationDescription = '15 Detik';
        partsInstruction = '4 bagian: Hook, Context, Climax, dan Resolution. Total durasi 15 detik. Format waktu [00:00-00:04].';
        systemRoleAddon = "";
    } else if (config.model === ModelType.VEO) {
        durationDescription = '8 Detik';
        partsInstruction = '3 bagian: Hook, Climax, dan Resolution. Total durasi 8 detik. Sangat ringkas. Format waktu [00:00-00:03].';
        systemRoleAddon = "";
    } else {
        // Veo3
        const totalSeconds = config.sceneCount * 8;
        durationDescription = `${totalSeconds} Detik (${config.sceneCount} Scene x 8 Detik)`;
        
        const timestampInstructions = [];
        for(let i = 0; i < config.sceneCount; i++) {
            timestampInstructions.push(`${i*8}-${(i+1)*8}`);
        }
        const timeString = timestampInstructions.join(', ');

        partsInstruction = `TEPAT ${config.sceneCount} SCENE. Setiap scene durasinya 8 detik (urutan waktu: ${timeString}). Cerita harus NYAMBUNG (Storytelling) dan berkembang dari Scene 1 sampai Scene ${config.sceneCount} secara kronologis.`;
        systemRoleAddon = "Fokus pada Storytelling naratif yang mendalam. Pastikan kontinuitas visual dan cerita antar scene terjaga dengan sangat baik sesuai jumlah scene yang diminta.";
    }

    let voInstruction = "";
    let strictModeRule2 = "";

    if (config.voLang === VoiceoverLanguage.SFX) {
        voInstruction = "Field JSON 'voiceover': JANGAN BUAT NARASI/DIALOG MANUSIA. Isi field ini dengan deskripsi Sound Effect (SFX) dan Audio Ambience yang detail dan imersif sesuai scene. Gunakan awalan '[SFX]'. Contoh: '[SFX] Suara hujan deras membentur atap seng, diselingi guntur pelan'.";
        strictModeRule2 = "2. Field JSON 'voiceover': HANYA BOLEH BERISI DESKRIPSI SUARA (SFX/AMBIENCE). DILARANG ADA DIALOG MANUSIA.";
    } else {
        voInstruction = `Field JSON 'voiceover': WAJIB diisi dengan narasi voiceover yang mengalir dalam bahasa ${config.voLang}.`;
        strictModeRule2 = `2. Field JSON 'voiceover': WAJIB HUKUMNYA ditulis dalam bahasa ${config.voLang}.`;
    }

    const systemPrompt = `Anda adalah Creative Director dan Penulis Skrip profesional untuk konten video pendek model AI ${config.model}. ${systemRoleAddon}

ATURAN BAHASA (STRICT MODE):
1. Field JSON 'action', 'scene', 'style', 'camera': WAJIB HUKUMNYA ditulis dalam bahasa ${config.promptLang}.
${strictModeRule2}
3. Field 'seo_title', 'description', 'cta_seo', 'hashtags': Tulis dalam Bahasa Indonesia.

ATURAN STRUKTUR:
1. Output HARUS format JSON sesuai skema.
2. Panjang total: ${durationDescription}. Instruksi struktur: ${partsInstruction}.
3. Konten visual harus detail dan sinematik.
4. ${voInstruction}`;

    const userQuery = `Buatkan konsep video pendek berdasarkan ide berikut: "${prompt}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userQuery,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: responseSchema
            }
        });

        const text = response.text;
        if (!text) throw new Error("No text response from Gemini");
        
        return JSON.parse(text) as ScriptContent;
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
};
