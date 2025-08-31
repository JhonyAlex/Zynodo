import React from 'react';
import type { FlowTemplate, SuggestedNode } from './types';

const WebIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
);
const CrmIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);
const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
);


// Reusable node snippets for suggestions
const NODE_SNIPPETS: { [key: string]: SuggestedNode } = {
  SHOW_POPUP: { icon: <ChatIcon />, label: 'Mostrar Popup de Oferta', description: 'Muestra una oferta especial después de 10 segundos.' },
  CAPTURE_LEAD: { icon: <CrmIcon />, label: 'Capturar Lead', description: 'Guarda la información de contacto del usuario.' },
  ADD_TO_CRM: { icon: <CrmIcon />, label: 'Añadir a CRM', description: 'Crea un nuevo contacto en el sistema CRM.' },
  SEND_WELCOME_EMAIL: { icon: <ChatIcon />, label: 'Enviar Email de Bienvenida', description: 'Envía un correo electrónico de bienvenida inmediato.' },
  WAIT_2_DAYS: { icon: <BotIcon />, label: 'Esperar 2 días', description: 'Pausa el flujo durante 48 horas.' },
  SEND_FOLLOW_UP: { icon: <ChatIcon />, label: 'Email de Seguimiento', description: 'Envía un segundo correo con más información.' },
  PROCESS_WITH_AI: { icon: <BotIcon />, label: 'Procesar con IA', description: 'Analiza la intención del usuario con un modelo de IA.' },
  SEARCH_KB: { icon: <WebIcon />, label: 'Buscar en Base de Conocimiento', description: 'Busca la respuesta más relevante.' },
  SEND_RESPONSE: { icon: <ChatIcon />, label: 'Enviar Respuesta', description: 'Envía la respuesta encontrada al usuario.' },
};

export const DEFAULT_SUGGESTIONS: SuggestedNode[] = [
  NODE_SNIPPETS.ADD_TO_CRM,
  NODE_SNIPPETS.SEND_FOLLOW_UP,
  NODE_SNIPPETS.WAIT_2_DAYS,
  NODE_SNIPPETS.PROCESS_WITH_AI,
];

export const AVAILABLE_NODES: (SuggestedNode & { id: string })[] = Object.entries(NODE_SNIPPETS).map(([id, data]) => ({
  id,
  ...data,
}));


export const TEMPLATES: FlowTemplate[] = [
  {
    id: 'web-pages',
    title: 'Páginas web',
    description: 'Flujo para capturar leads desde una visita web.',
    icon: <WebIcon />,
    nodes: [
      { id: 'web-1', type: 'custom', data: { icon: <WebIcon />, label: 'Visita a la Web', description: 'Se activa cuando un usuario visita una página específica.', suggestedNextNodes: [NODE_SNIPPETS.SHOW_POPUP, NODE_SNIPPETS.WAIT_2_DAYS] }, position: { x: 0, y: 0 } },
      { id: 'web-2', type: 'custom', data: { icon: <ChatIcon />, label: 'Mostrar Popup de Oferta', description: 'Muestra una oferta especial después de 10 segundos.', suggestedNextNodes: [NODE_SNIPPETS.CAPTURE_LEAD] }, position: { x: 0, y: 120 } },
      { id: 'web-3', type: 'custom', data: { icon: <CrmIcon />, label: 'Capturar Lead', description: 'Guarda la información de contacto del usuario.', suggestedNextNodes: [NODE_SNIPPETS.ADD_TO_CRM, NODE_SNIPPETS.SEND_WELCOME_EMAIL] }, position: { x: 0, y: 240 } },
      { id: 'web-4', type: 'custom', data: { icon: <CrmIcon />, label: 'Añadir a CRM', description: 'Crea un nuevo contacto en el sistema CRM.', suggestedNextNodes: [NODE_SNIPPETS.SEND_WELCOME_EMAIL, NODE_SNIPPETS.WAIT_2_DAYS] }, position: { x: 0, y: 360 } },
    ],
    edges: [
      { id: 'e-web-1-2', source: 'web-1', target: 'web-2', animated: true, type: 'custom' },
      { id: 'e-web-2-3', source: 'web-2', target: 'web-3', animated: true, type: 'custom' },
      { id: 'e-web-3-4', source: 'web-3', target: 'web-4', animated: true, type: 'custom' },
    ],
  },
  {
    id: 'crm-automation',
    title: 'Automatización CRM',
    description: 'Envía una secuencia de bienvenida a nuevos leads.',
    icon: <CrmIcon />,
    nodes: [
      { id: 'crm-1', type: 'custom', data: { icon: <CrmIcon />, label: 'Nuevo Lead en CRM', description: 'Se activa cuando se crea un nuevo lead.', suggestedNextNodes: [NODE_SNIPPETS.SEND_WELCOME_EMAIL] }, position: { x: 0, y: 0 } },
      { id: 'crm-2', type: 'custom', data: { icon: <ChatIcon />, label: 'Enviar Email de Bienvenida', description: 'Envía un correo electrónico de bienvenida inmediato.', suggestedNextNodes: [NODE_SNIPPETS.WAIT_2_DAYS] }, position: { x: 0, y: 120 } },
      { id: 'crm-3', type: 'custom', data: { icon: <BotIcon />, label: 'Esperar 2 días', description: 'Pausa el flujo durante 48 horas.', suggestedNextNodes: [NODE_SNIPPETS.SEND_FOLLOW_UP] }, position: { x: 0, y: 240 } },
      { id: 'crm-4', type: 'custom', data: { icon: <ChatIcon />, label: 'Email de Seguimiento', description: 'Envía un segundo correo con más información.', suggestedNextNodes: [NODE_SNIPPETS.ADD_TO_CRM, NODE_SNIPPETS.PROCESS_WITH_AI] }, position: { x: 0, y: 360 } },
    ],
    edges: [
      { id: 'e-crm-1-2', source: 'crm-1', target: 'crm-2', animated: true, type: 'custom' },
      { id: 'e-crm-2-3', source: 'crm-2', target: 'crm-3', animated: true, type: 'custom' },
      { id: 'e-crm-3-4', source: 'crm-3', target: 'crm-4', animated: true, type: 'custom' },
    ],
  },
  {
    id: 'ai-chat',
    title: 'Chat IA',
    description: 'Procesa y responde preguntas de usuarios con IA.',
    icon: <ChatIcon />,
    nodes: [
      { id: 'chat-1', type: 'custom', data: { icon: <ChatIcon />, label: 'Mensaje de Usuario', description: 'Recibe un nuevo mensaje de un chat.', suggestedNextNodes: [NODE_SNIPPETS.PROCESS_WITH_AI] }, position: { x: 0, y: 0 } },
      { id: 'chat-2', type: 'custom', data: { icon: <BotIcon />, label: 'Procesar con IA', description: 'Analiza la intención del usuario con un modelo de IA.', suggestedNextNodes: [NODE_SNIPPETS.SEARCH_KB] }, position: { x: 0, y: 120 } },
      { id: 'chat-3', type: 'custom', data: { icon: <WebIcon />, label: 'Buscar en Base de Conocimiento', description: 'Busca la respuesta más relevante.', suggestedNextNodes: [NODE_SNIPPETS.SEND_RESPONSE] }, position: { x: 0, y: 240 } },
      { id: 'chat-4', type: 'custom', data: { icon: <ChatIcon />, label: 'Enviar Respuesta', description: 'Envía la respuesta encontrada al usuario.', suggestedNextNodes: [NODE_SNIPPETS.ADD_TO_CRM, NODE_SNIPPETS.CAPTURE_LEAD] }, position: { x: 0, y: 360 } },
    ],
    edges: [
      { id: 'e-chat-1-2', source: 'chat-1', target: 'chat-2', animated: true, type: 'custom' },
      { id: 'e-chat-2-3', source: 'chat-2', target: 'chat-3', animated: true, type: 'custom' },
      { id: 'e-chat-3-4', source: 'chat-3', target: 'chat-4', animated: true, type: 'custom' },
    ],
  },
  {
    id: 'welcome-bot',
    title: 'Bot de bienvenida',
    description: 'Un bot simple que saluda y dirige a los usuarios.',
    icon: <BotIcon />,
    nodes: [
      { id: 'bot-1', type: 'custom', data: { icon: <ChatIcon />, label: 'Inicio de Chat', description: 'Un usuario abre la ventana de chat.', suggestedNextNodes: [NODE_SNIPPETS.PROCESS_WITH_AI, NODE_SNIPPETS.CAPTURE_LEAD] }, position: { x: 250, y: 0 } },
      { id: 'bot-2', type: 'custom', data: { icon: <BotIcon />, label: 'Mensaje de Saludo', description: 'Envía un saludo y pregunta qué necesita el usuario.', suggestedNextNodes: [NODE_SNIPPETS.PROCESS_WITH_AI, NODE_SNIPPETS.SEARCH_KB] }, position: { x: 250, y: 120 } },
      { id: 'bot-3a', type: 'custom', data: { icon: <CrmIcon />, label: 'Opción: Ventas', description: 'Si el usuario elige "Ventas".', suggestedNextNodes: [NODE_SNIPPETS.ADD_TO_CRM, NODE_SNIPPETS.SEND_WELCOME_EMAIL] }, position: { x: 0, y: 240 } },
      { id: 'bot-3b', type: 'custom', data: { icon: <WebIcon />, label: 'Opción: Soporte', description: 'Si el usuario elige "Soporte".', suggestedNextNodes: [NODE_SNIPPETS.SEARCH_KB, NODE_SNIPPETS.SEND_FOLLOW_UP] }, position: { x: 500, y: 240 } },
      { id: 'bot-4a', type: 'custom', data: { icon: <CrmIcon />, label: 'Notificar a Equipo de Ventas', description: 'Avisa al canal de ventas en Slack.', suggestedNextNodes: [NODE_SNIPPETS.ADD_TO_CRM] }, position: { x: 0, y: 360 } },
      { id: 'bot-4b', type: 'custom', data: { icon: <WebIcon />, label: 'Crear Ticket de Soporte', description: 'Crea un nuevo ticket en el sistema de ayuda.', suggestedNextNodes: [NODE_SNIPPETS.SEND_FOLLOW_UP] }, position: { x: 500, y: 360 } },
    ],
    edges: [
      { id: 'e-bot-1-2', source: 'bot-1', target: 'bot-2', animated: true, type: 'custom' },
      { id: 'e-bot-2-3a', source: 'bot-2', target: 'bot-3a', animated: true, type: 'custom' },
      { id: 'e-bot-2-3b', source: 'bot-2', target: 'bot-3b', animated: true, type: 'custom' },
      { id: 'e-bot-3a-4a', source: 'bot-3a', target: 'bot-4a', animated: true, type: 'custom' },
      { id: 'e-bot-3b-4b', source: 'bot-3b', target: 'bot-4b', animated: true, type: 'custom' },
    ],
  },
];
