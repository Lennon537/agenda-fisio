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
  location = 'Ketlen Fisio - Fisioterapia & Pilates (Av. Paulista, 1500 - São Paulo, SP)',
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
    ? `Lembramos que sua sessão de *${careLabel}* na *Ketlen Fisio* começa em breve, às *${timeStr}*.`
    : `Lembramos que sua sessão de *${careLabel}* na *Ketlen Fisio* está agendada para amanhã, *${dateDisplay}*, às *${timeStr}*.`;

  const text = encodeURIComponent(
    `${greeting}\n\n${timeNotice}\n\n📍 *Endereço:* Av. Paulista, 1500 - Ketlen Fisio\n\nPor favor, responda com *CONFIRMAR* para garantir seu horário ou nos avise caso precise remarcar.\n\nAtenciosamente,\n*Dra. Ketlen & Equipe*`
  );

  return `https://wa.me/${phoneWithCountry}?text=${text}`;
}
