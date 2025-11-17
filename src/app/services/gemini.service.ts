import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private genAI = new GoogleGenerativeAI('AIzaSyDb9RR_TFjApkukd98VyP_6W0KtGtLT4J4');
  private model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  async extractTask(prompt: string): Promise<{ title: string; category: string } | null> {
    const clean = `Extrae título y categoría de esta frase: "${prompt}". Responde solo con formato JSON: {"title":"...","category":"..."}`;
    const res = await this.model.generateContent(clean);
    console.log('Gemini raw response:', res);    
    //const text = res.response?.candidates ?  res.response?.candidates[0]?.content.parts[0].text?.toString() : '';
    const text = res.response.text().replace('```json', '').replace('```', '');
    console.log('response text:', text);
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
}
