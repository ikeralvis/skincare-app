// src/utils/gemini.ts
// Utilidad para interactuar con Google Gemini AI

import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('⚠️ PUBLIC_GEMINI_API_KEY no está configurada en .env');
}

// Contexto del sistema sobre skincare y productos
const SKINCARE_CONTEXT = `
Eres "SkinCare AI Assistant", un experto en rutinas de cuidado de la piel.

CONTEXTO DE LA APLICACIÓN:
- La app ayuda a seguir rutinas de skincare diurnas y nocturnas, registrar progreso y mantener constancia.

PRODUCTOS QUE USA EL USUARIO:
1. BYOMA Creamy Jelly Cleanser - Limpieza suave que respeta la barrera cutánea - Diurno y Nocturno
2. BYOMA Hydrating Serum - Hidratación profunda y refuerzo de la barrera - Diurno
3. BYOMA Moisturizing Gel Cream - Sella activos y crea capa protectora - Diurno
4. Caudalie Vinosun Fluido SPF50+ - Protección solar UV (paso final obligatorio) - Diurno

DÍAS CON ÁCIDO LÁCTICO (Lunes, Miércoles, Viernes):
2. The Ordinary Lactic Acid 5% + HA - Exfoliación suave, renovación celular (noches alternas, 2-3 veces/semana) - Nocturno
3. The Ordinary Natural Moisturizing Factors + HA - Nutrición profunda y duradera - Nocturno

DÍAS SIN ÁCIDO LÁCTICO (Martes, Jueves, Sábado, Domingo):
2. The Ordinary Hyaluronic Acid 2% + B5 - Hidratación intensa y duradera - Nocturno
3. The Ordinary Natural Moisturizing Factors + HA - Nutrición profunda y duradera - Nocturno

Tu función:
- Resolver dudas sobre productos, orden de aplicación e ingredientes.
- Dar consejos breves y claros sobre nuevos productos, aclaraciones de como usarlos.
- Recordar la importancia de la constancia.
- No diagnostiques ni inventes información médica.

Guías:
✅ Sé conciso (3-4 párrafos máx)  
✅ Usa emojis 🧴💧✨  
✅ Si hay dudas serias → recomendar dermatólogo  
✅ Tono: amable, experto, motivador

IMPORTANTE:
- NO inventes información médica
- NO diagnostiques condiciones de piel
- NO menciones productos que NO están en su rutina
- SÍ enfócate en educación sobre ingredientes y rutinas
- SÍ reconoce cuando algo requiere consejo profesional
`;

// Inicializar cliente de Gemini con el nuevo SDK
let genAI: GoogleGenAI | null = null;
let conversationHistory: Array<{ role: string; content: string }> = [];

function initializeGemini() {
  if (!API_KEY) {
    throw new Error('API Key de Gemini no configurada');
  }

  if (!genAI) {
    // Nota: El SDK de GoogleGenAI (a diferencia de otros SDKs)
    // ya incorpora una estrategia de reintento. Sin embargo, implementaremos
    // una capa adicional de manejo de errores de cuota para mayor control.
    genAI = new GoogleGenAI({ apiKey: API_KEY });
  }

  return genAI;
}

/**
 * Función de pausa asíncrona.
 * @param ms Milisegundos a esperar.
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Función central de llamada a la API con lógica de reintento.
 * @param fullPrompt Prompt completo a enviar a la API.
 * @param maxRetries Número máximo de reintentos.
 * @returns Respuesta de texto del asistente.
 */
async function generateContentWithRetry(fullPrompt: string, maxRetries: number = 3): Promise<string> {
  const ai = initializeGemini();
  const model = 'gemini-2.0-flash-lite';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📡 Intentando generar contenido (Intento ${attempt}/${maxRetries})...`);
      const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
      });
      return response.text || 'No pude generar una respuesta.';
    } catch (error) {
      console.error(`❌ Error en el intento ${attempt}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        if (attempt < maxRetries) {
          const waitTime = 60000 * attempt; // 20s, 40s, 60s...
          console.warn(`⚠️ Cuota excedida. Esperando ${waitTime / 1000}s antes de reintentar...`);
          await sleep(waitTime);
        } else {
          throw new Error('Se agotaron los reintentos. El límite de solicitudes sigue excedido.');
        }
      } else {
        throw error;
      }
    }
  }
  throw new Error('Error desconocido después de reintentos.');
}



/**
 * Inicia una nueva sesión de chat con contexto
 */
export function startChatSession() {
  initializeGemini();
  conversationHistory = [];
  console.log('✅ Sesión de chat iniciada con Gemini');
}


/**
 * Envía un mensaje al chat y obtiene respuesta
 */
export async function sendMessage(message: string): Promise<string> {
  try {
    await sleep(2000);
    conversationHistory.push({ role: 'user', content: message });

    // 🔹 Limitar historial a las últimas 5 interacciones (10 mensajes)
    const recentMessages = conversationHistory.slice(-10);

    // 🔹 Construir prompt corto y eficiente
    const fullPrompt =
      SKINCARE_CONTEXT +
      '\n\n' +
      recentMessages
        .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
        .join('\n\n');

    const assistantMessage = await generateContentWithRetry(fullPrompt);

    conversationHistory.push({ role: 'assistant', content: assistantMessage });
    return assistantMessage;

  } catch (error) {
    console.error('Error al enviar mensaje a Gemini:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('cuota') || errorMessage.includes('límite')) {
      return '❌ Se alcanzó el límite de solicitudes. Espera unos minutos o amplía tu cuota.';
    }
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('ERR_CONNECTION')) {
      return '❌ Error de conexión con Gemini API.\nVerifica tu internet o las restricciones de API key.';
    }
    if (errorMessage.includes('API key')) {
      return '❌ Error: La API key no es válida o no está configurada.';
    }

    return '❌ Hubo un error al procesar tu mensaje. Intenta de nuevo.';
  }
}


/**
 * Reinicia la sesión de chat (borra historial)
 */
export function resetChatSession() {
  conversationHistory = [];
  console.log('🔄 Historial de chat reiniciado');
}

/**
 * Verifica si la API key está configurada
 */
export function isGeminiConfigured(): boolean {
  return !!API_KEY;
}