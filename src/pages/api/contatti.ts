import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Resend } from 'resend';

export const prerender = false;

const ContactSchema = z.object({
  nome: z.string().trim().min(2, 'Nome troppo corto').max(120),
  azienda: z.string().trim().max(160).optional().or(z.literal('')),
  email: z.string().trim().email('Email non valida').max(180),
  telefono: z.string().trim().max(40).optional().or(z.literal('')),
  interesse: z.string().trim().max(120).optional().or(z.literal('')),
  pack: z.string().trim().max(40).optional().or(z.literal('')),
  settore: z.string().trim().max(120).optional().or(z.literal('')),
  programma: z.string().trim().max(160).optional().or(z.literal('')),
  messaggio: z.string().trim().min(10, 'Racconta almeno qualcosa (10 caratteri)').max(4000),
  privacy: z.union([z.literal('on'), z.literal('true'), z.boolean()]).refine((v) => !!v, {
    message: 'Devi accettare la privacy policy',
  }),
  // honeypot
  website: z.string().max(0).optional().or(z.literal('')),
});

function isJsonRequest(req: Request) {
  const ct = req.headers.get('content-type') ?? '';
  return ct.includes('application/json');
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const POST: APIRoute = async ({ request, redirect }) => {
  let raw: Record<string, unknown>;
  try {
    if (isJsonRequest(request)) {
      raw = await request.json();
    } else {
      const fd = await request.formData();
      raw = Object.fromEntries(fd.entries());
    }
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Body non valido' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Honeypot: se compilato, simuliamo successo silenzioso
  if (typeof raw.website === 'string' && raw.website.trim() !== '') {
    return isJsonRequest(request)
      ? new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } })
      : redirect('/grazie', 303);
  }

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return new Response(JSON.stringify({ ok: false, errors }), {
      status: 422,
      headers: { 'content-type': 'application/json' },
    });
  }
  const data = parsed.data;

  const resendKey = import.meta.env.RESEND_API_KEY;
  const fromEmail = import.meta.env.CONTACT_FROM ?? 'no-reply@ai.bitora.it';
  const toEmail = import.meta.env.CONTACT_TO ?? 'info@bitora.it';
  const replyTo = data.email;

  const subject = `[ai.bitora.it] Nuova richiesta · ${data.nome}${data.azienda ? ' · ' + data.azienda : ''}`;

  const text = [
    `Nuova richiesta dal sito ai.bitora.it`,
    ``,
    `Nome:        ${data.nome}`,
    `Azienda:     ${data.azienda || '—'}`,
    `Email:       ${data.email}`,
    `Telefono:    ${data.telefono || '—'}`,
    `Interesse:   ${data.interesse || '—'}`,
    `Pacchetto:   ${data.pack || '—'}`,
    `Settore:     ${data.settore || '—'}`,
    `Programma:   ${data.programma || '—'}`,
    ``,
    `Messaggio:`,
    data.messaggio,
  ].join('\n');

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#0f172a">
      <div style="background:linear-gradient(135deg,#6366f1,#06b6d4);padding:24px;border-radius:12px 12px 0 0;color:#fff">
        <h1 style="margin:0;font-size:20px">Nuova richiesta · ai.bitora.it</h1>
        <p style="margin:6px 0 0;opacity:0.9;font-size:13px">${escapeHtml(data.nome)}${data.azienda ? ' · ' + escapeHtml(data.azienda) : ''}</p>
      </div>
      <div style="background:#f8fafc;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:0">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${[
            ['Email', `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`],
            ['Telefono', data.telefono ? `<a href="tel:${escapeHtml(data.telefono)}">${escapeHtml(data.telefono)}</a>` : '—'],
            ['Interesse', escapeHtml(data.interesse || '—')],
            ['Pacchetto', escapeHtml(data.pack || '—')],
            ['Settore', escapeHtml(data.settore || '—')],
            ['Programma', escapeHtml(data.programma || '—')],
          ]
            .map(
              ([k, v]) =>
                `<tr><td style="padding:6px 0;color:#64748b;width:120px">${k}</td><td style="padding:6px 0;color:#0f172a">${v}</td></tr>`,
            )
            .join('')}
        </table>
        <div style="margin-top:18px">
          <div style="font-size:12px;color:#64748b;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px">Messaggio</div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px;white-space:pre-wrap;line-height:1.6">${escapeHtml(
            data.messaggio,
          )}</div>
        </div>
      </div>
      <p style="font-size:11px;color:#94a3b8;text-align:center;margin-top:14px">
        Ricevuto su ai.bitora.it · ${new Date().toLocaleString('it-IT')}
      </p>
    </div>
  `;

  if (!resendKey) {
    console.error('[contatti] RESEND_API_KEY non configurata. Payload:', { ...data, messaggio: '[truncated]' });
    if (isJsonRequest(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'Configurazione email mancante.' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }
    return redirect('/contatti?error=config', 303);
  }

  try {
    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from: `Bitora AI <${fromEmail}>`,
      to: [toEmail],
      replyTo,
      subject,
      text,
      html,
    });
    if (error) {
      console.error('[contatti] Resend error:', error);
      throw new Error(error.message ?? 'send error');
    }
  } catch (err) {
    console.error('[contatti] Send failed:', err);
    if (isJsonRequest(request)) {
      return new Response(JSON.stringify({ ok: false, error: 'Invio non riuscito, riprova più tardi.' }), {
        status: 502,
        headers: { 'content-type': 'application/json' },
      });
    }
    return redirect('/contatti?error=send', 303);
  }

  if (isJsonRequest(request)) {
    return new Response(JSON.stringify({ ok: true, redirect: '/grazie' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }
  return redirect('/grazie', 303);
};
