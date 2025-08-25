// src/data/routines.ts
export const dailyRoutine = [
  {
    step: 1,
    title: "MÓDULO DE LIMPIEZA PROFUNDA",
    accessCode: "BYOMA Creamy Jelly Cleanser",
    function: "Limpieza suave que respeta tu barrera cutánea, eliminando impurezas acumuladas durante la noche.",
    usage: "Masajea una dosis sobre el rostro húmedo. Aclara con agua.",
    image: "/images/limpiador.png"
  },
  {
    step: 2,
    title: "MÓDULO DE REFUERZO CELULAR",
    accessCode: "BYOMA Hydrating Serum",
    function: "Aporta una dosis de hidratación profunda y refuerza la barrera de tu piel, preparándola para la defensa.",
    usage: "Aplica 3-4 gotas sobre la piel limpia y seca. Presiona suavemente hasta que se absorba.",
    image: "/images/serumByoma.png"
  },
  {
    step: 3,
    title: "MÓDULO DE SELLADO Y CONFORT",
    accessCode: "BYOMA Moisturizing Gel Cream",
    function: "Sella los activos del sérum y crea una capa protectora. Mantiene la piel en un estado óptimo de hidratación.",
    usage: "Aplica una dosis (tamaño de una almendra) sobre el rostro y cuello. Masajea hasta su absorción.",
    image: "/images/cremaByoma.png"
  },
  {
    step: 4,
    title: "MÓDULO DE DEFENSA ACTIVA",
    accessCode: "Caudalie Vinosun Fluido SPF50+",
    function: "Tu defensa esencial contra la radiación UV. Genera un campo de fuerza invisible que protege tu ADN dérmico del daño solar.",
    usage: "ÚLTIMO PASO. Aplica generosamente sobre el rostro y el cuello.",
    image: "/images/sol.png"
  }
];

export const nightlyRoutineWithLactic = [
  {
    step: 1,
    title: "MÓDULO DE LIMPIEZA PROFUNDA",
    accessCode: "BYOMA Creamy Jelly Cleanser",
    function: "Limpia tu piel en profundidad, eliminando cualquier residuo restante para una purificación completa.",
    usage: "Aplica sobre el rostro húmedo. Masajea hasta crear espuma y aclara con agua.",
    image: "/images/limpiador.png"
  },
  {
    step: 2,
    title: "MÓDULO DE REGENERACIÓN NOCTURNA",
    accessCode: "The Ordinary Lactic Acid 5% + HA",
    function: "(Noches alternas, 2-3 veces/semana). Micro-exfolia la piel suavemente para activar la renovación celular, mejorando la textura y la luminosidad.",
    usage: "Aplica 2-3 gotas. Deja que se absorba antes del siguiente paso.",
    image: "/images/latico.png"
  },
  {
    step: 3,
    title: "UNIDAD DE REPARACIÓN NOCTURNA",
    accessCode: "The Ordinary Natural Moisturizing Factors + HA",
    function: "Sella todos los activos, proporcionando una nutrición profunda y duradera. Es el paso final para una regeneración óptima.",
    usage: "Aplica una dosis generosa sobre el rostro y el cuello.",
    image: "/images/crema_ordinary.webp"
  }
];

export const nightlyRoutineWithoutLactic = [
  {
    step: 1,
    title: "MÓDULO DE LIMPIEZA PROFUNDA",
    accessCode: "BYOMA Creamy Jelly Cleanser",
    function: "Limpia tu piel en profundidad, eliminando cualquier residuo restante para una purificación completa.",
    usage: "Aplica sobre el rostro húmedo. Masajea hasta crear espuma y aclara con agua.",
    image: "/images/limpiador.png"
  },
  {
    step: 2,
    title: "Módulo de Refuerzo Celular",
    accessCode: "The Ordinary Hyaluronic Acid 2% + B5",
    function: "Un agente que retiene el agua en tu piel, proporcionando una hidratación intensa y duradera para el proceso de reparación nocturna.",
    usage: "Aplica unas gotas sobre el rostro y el cuello.",
    image: "/images/ordinary_hialuronico.webp"
  },
  {
    step: 3,
    title: "UNIDAD DE REPARACIÓN NOCTURNA",
    accessCode: "The Ordinary Natural Moisturizing Factors + HA",
    function: "Sella todos los activos, proporcionando una nutrición profunda y duradera. Es el paso final para una regeneración óptima.",
    usage: "Aplica una dosis generosa sobre el rostro y el cuello.",
    image: "/images/crema_ordinary.webp"
  }
];

export const weeklyRoutine = {
  "Lunes": nightlyRoutineWithLactic,
  "Martes": nightlyRoutineWithoutLactic,
  "Miércoles": nightlyRoutineWithLactic,
  "Jueves": nightlyRoutineWithoutLactic,
  "Viernes": nightlyRoutineWithLactic,
  "Sábado": nightlyRoutineWithoutLactic,
  "Domingo": nightlyRoutineWithoutLactic,
};
