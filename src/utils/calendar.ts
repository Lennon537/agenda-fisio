/**
 * Utilitários de Integração de Calendário (100% Gratuitos e sem chaves de API)
 * e Lembretes de Consulta para WhatsApp
 */

export interface GoogleCalendarEventOptions {
  title: string;
  description: string;
  location?: string;
  dateIso: string; // "YYYY-MM-DD"
  timeStr: string; // "HH:MM"
  durationMinutes?: number;
}

/**
 * Gera URL oficial do Google Calendar (Gratuito e compatível com web e mobile)
 */
export function generateGoogleCalendarUrl({
  title,
  description,
  location = 'Ketllen Souza Fisioterapia (Av. Paulista, 1500 - São Paulo, SP)',
  dateIso,
  timeStr,
  durationMinutes = 50,
}: GoogleCalendarEventOptions): string {
  try {
    const [year, month, day] = dateIso.split('-').map(Number);
    const [hours, mins] = timeStr.split(':').map(Number);
    
    // Horário local
    const startDate = new Date(year, month - 1, day, hours, mins);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    const pad = (n: number) => String(n).padStart(2, '0');

    // Formato ISO básico sem separadores para Google Calendar: YYYYMMDDTHHmmSS
    const startStr = `${startDate.getFullYear()}${pad(startDate.getMonth() + 1)}${pad(startDate.getDate())}T${pad(startDate.getHours())}${pad(startDate.getMinutes())}00`;
    const endStr = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startStr}/${endStr}`,
      details: description,
      location: location,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch (e) {
    console.error('Erro ao gerar link do Google Agenda', e);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}`;
  }
}

/**
 * Gera mensagem formatada para disparo de lembrete de consulta no WhatsApp
 */
export function generateWhatsAppReminderUrl({
  phone,
  patientName,
  careType,
  dateDisplay,
  timeStr,
  type = '24h',
}: {
  phone: string;
  patientName: string;
  careType: 'fisioterapia' | 'pilates';
  dateDisplay: string;
  timeStr: string;
  type?: '24h' | '2h';
}): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  const careLabel = careType === 'fisioterapia' ? 'Fisioterapia' : 'Pilates';
  
  const greeting = type === '2h' 
    ? `Olá, ${patientName}! Tudo pronto para logo mais? 🌿`
    : `Olá, ${patientName}! Tudo bem? 🌿`;

  const timeNotice = type === '2h'
    ? `Lembramos que sua sessão de *${careLabel}* na *Ketllen Souza Fisioterapia* começa em breve, às *${timeStr}*.`
    : `Lembramos que sua sessão de *${careLabel}* na *Ketllen Souza Fisioterapia* está agendada para amanhã, *${dateDisplay}*, às *${timeStr}*.`;

  const text = encodeURIComponent(
    `${greeting}\n\n${timeNotice}\n\n📍 *Endereço:* Av. Paulista, 1500 - Ketllen Souza Fisioterapia\n\nPor favor, responda com *CONFIRMAR* para garantir seu horário ou nos avise caso precise remarcar.\n\nAtenciosamente,\n*Dra. Ketllen Souza & Equipe*`
  );

  return `https://wa.me/${phoneWithCountry}?text=${text}`;
}

export type WhatsAppSendMode = 'auto' | 'app' | 'web';

/**
 * Detecta se o dispositivo do usuário é móvel (smartphone ou tablet)
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

/**
 * Gera as URLs formatadas para Envio de WhatsApp:
 * - App: protocolo nativo (whatsapp://send...)
 * - Web: WhatsApp Web no navegador (https://web.whatsapp.com/send...)
 * - Universal / wa.me: página oficial com redirecionamento
 */
export function getWhatsAppUrls({
  phone,
  text,
}: {
  phone: string;
  text: string;
}) {
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  const encodedText = encodeURIComponent(text);

  return {
    app: `whatsapp://send?phone=${phoneWithCountry}&text=${encodedText}`,
    web: `https://web.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodedText}`,
    universal: `https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodedText}`,
    waMe: `https://wa.me/${phoneWithCountry}?text=${encodedText}`,
    phoneWithCountry,
  };
}

/**
 * Abre o WhatsApp diretamente respeitando se o usuário quer usar Aplicativo ou WhatsApp Web,
 * enviando diretamente para o número da Dra. Ketllen.
 */
export function openWhatsAppDirect({
  phone,
  text,
  mode = 'auto',
}: {
  phone: string;
  text: string;
  mode?: WhatsAppSendMode;
}) {
  if (typeof window === 'undefined') return;

  const urls = getWhatsAppUrls({ phone, text });

  if (mode === 'web') {
    window.open(urls.web, '_blank', 'noopener,noreferrer');
    return;
  }

  if (mode === 'app') {
    const isMobile = isMobileDevice();
    if (isMobile) {
      // No celular, abre o aplicativo diretamente
      window.location.href = urls.app;
      // Fallback para api se o protocolo demorar
      setTimeout(() => {
        window.open(urls.universal, '_blank');
      }, 700);
    } else {
      // No desktop, tenta protocolo ou universal
      window.open(urls.universal, '_blank', 'noopener,noreferrer');
    }
    return;
  }

  // Modo auto:
  if (isMobileDevice()) {
    window.location.href = urls.app;
    setTimeout(() => {
      window.open(urls.universal, '_blank');
    }, 700);
  } else {
    // No computador, abre direto no WhatsApp Web (sem tela intermediária chata)
    window.open(urls.web, '_blank', 'noopener,noreferrer');
  }
}

