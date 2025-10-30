// src/utils/gemini.ts
// Utilidad para interactuar con Google Gemini AI

import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('⚠️ PUBLIC_GEMINI_API_KEY no está configurada en .env');
}

// Contexto del sistema sobre skincare y productos
const SKINCARE_CONTEXT = `
Eres un asistente experto en skincare y rutinas de cuidado de la piel llamado "SkinCare AI Assistant".

CONTEXTO DE LA APLICACIÓN:
- Esta es una app de seguimiento de rutinas de skincare personalizadas
- Los usuarios tienen rutinas diurnas y nocturnas
- Registran su progreso diario y ganan logros por constancia
- Pueden configurar recordatorios para sus rutinas

PRODUCTOS QUE USA EL USUARIO:

RUTINA DIURNA (4 pasos):
1. BYOMA Creamy Jelly Cleanser - Limpieza suave que respeta la barrera cutánea
2. BYOMA Hydrating Serum - Hidratación profunda y refuerzo de la barrera
3. BYOMA Moisturizing Gel Cream - Sella activos y crea capa protectora
4. Caudalie Vinosun Fluido SPF50+ - Protección solar UV (paso final obligatorio)

RUTINA NOCTURNA (varía según el día):

DÍAS CON ÁCIDO LÁCTICO (Lunes, Miércoles, Viernes):
1. BYOMA Creamy Jelly Cleanser - Limpieza profunda nocturna
2. The Ordinary Lactic Acid 5% + HA - Exfoliación suave, renovación celular (noches alternas, 2-3 veces/semana)
3. The Ordinary Natural Moisturizing Factors + HA - Nutrición profunda y duradera

DÍAS SIN ÁCIDO LÁCTICO (Martes, Jueves, Sábado, Domingo):
1. BYOMA Creamy Jelly Cleanser - Limpieza profunda nocturna
2. The Ordinary Hyaluronic Acid 2% + B5 - Hidratación intensa y duradera
3. The Ordinary Natural Moisturizing Factors + HA - Nutrición profunda y duradera

TU FUNCIÓN:
- Responder dudas sobre skincare, ingredientes y rutinas
- Dar consejos sobre el uso correcto de los productos específicos que usa
- Explicar para qué sirve cada producto de su rutina
- Motivar al usuario a mantener su constancia
- Resolver dudas sobre orden de aplicación
- Explicar por qué alterna el ácido láctico y el ácido hialurónico
- Posibles combinaciones de productos, o nuevas futuros productos
- Respeta las necesidades individuales del usuario (solicitalé más información sobre su piel si es necesario)

GUÍAS DE RESPUESTA:
✅ Sé conciso pero informativo (máximo 3-4 párrafos)
✅ Usa emojis de forma natural (🧴💧✨🌟)
✅ Menciona los productos específicos que usa cuando sea relevante
✅ Si preguntan sobre efectos secundarios serios, recomienda consultar dermatólogo
✅ Enfócate en la constancia y paciencia (los resultados toman tiempo)
✅ Sé amigable, profesional y motivador

IMPORTANTE:
- NO inventes información médica
- NO diagnostiques condiciones de piel
- NO menciones productos que NO están en su rutina
- SÍ enfócate en educación sobre ingredientes y rutinas
- SÍ reconoce cuando algo requiere consejo profesional

Tono: Amigable, experto, motivador, como un amigo que sabe mucho de skincare.
`;

// Inicializar cliente de Gemini con el nuevo SDK
let genAI: GoogleGenAI | null = null;
let conversationHistory: Array<{ role: string; content: string }> = [];

function initializeGemini() {
  if (!API_KEY) {
    throw new Error('API Key de Gemini no configurada');
  }
  
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: API_KEY });
  }
  
  return genAI;
}

/**
 * Inicia una nueva sesión de chat con contexto
 */
export function startChatSession() {
  // Inicializar cliente
  initializeGemini();
  
  // Limpiar historial
  conversationHistory = [];
  
  console.log('✅ Sesión de chat iniciada con Gemini 2.0 Flash');
}

/**
 * Envía un mensaje al chat y obtiene respuesta
 */
export async function sendMessage(message: string): Promise<string> {
  try {
    const ai = initializeGemini();
    
    // Añadir mensaje del usuario al historial
    conversationHistory.push({
      role: 'user',
      content: message
    });
    
    // Construir el prompt con el contexto del sistema y el historial
    const fullPrompt = SKINCARE_CONTEXT + '\n\n' + 
                      conversationHistory.map(msg => 
                        `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`
                      ).join('\n\n');
    
    // Enviar mensaje con el nuevo SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: fullPrompt,
    });
    
    const assistantMessage = response.text || 'No pude generar una respuesta.';
    
    // Añadir respuesta al historial
    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    });
    
    return assistantMessage;
  } catch (error) {
    console.error('Error al enviar mensaje a Gemini:', error);
    
    if (error instanceof Error) {
      // Error de conexión / CORS / restricciones de API
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION')) {
        return '❌ **Error de conexión con Gemini API**\n\n' +
               '🔧 **Solución:**\n' +
               '1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)\n' +
               '2. Edita tu API key\n' +
               '3. En "Application restrictions" selecciona "None" (para desarrollo)\n' +
               '4. O añade `http://localhost:*` en HTTP referrers\n\n' +
               '⏳ Después recarga la página.';
      }
      
      // Error de API key
      if (error.message.includes('API_KEY') || error.message.includes('invalid') || error.message.includes('API key not valid')) {
        return '❌ Error: La API key no es válida. Verifica que esté correctamente configurada en .env';
      }
      
      // Error de cuota
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return '❌ Se alcanzó el límite de solicitudes. Espera unos minutos e intenta de nuevo.';
      }
    }
    
    return '❌ Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.';
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
