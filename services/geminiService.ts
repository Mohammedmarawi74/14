
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function generateCarouselContent(topic: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `أنشئ محتوى لكاروسيل انستقرام تعليمي واحترافي حول الموضوع التالي: "${topic}". 
    يجب أن يتكون من 5 شرائح. كل شريحة تحتوي على عنوان جذاب، وصف قصير ومفيد، ورقم تسلسلي.
    اللغة: العربية الفصحى.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            numberText: { type: Type.STRING },
          },
          required: ["title", "description", "numberText"],
        },
      },
    },
  });

  return JSON.parse(response.text);
}
