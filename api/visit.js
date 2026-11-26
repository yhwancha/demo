// 방문 기록: 페이지가 열릴 때 한 번 호출됩니다.
// - Vercel 로그에 한 줄 남깁니다 (Vercel 대시보드 → Logs 에서 "VISIT" 검색).
// - SLACK_WEBHOOK_URL 이나 DISCORD_WEBHOOK_URL 환경변수가 있으면 그쪽으로도 알림을 보냅니다.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const h = req.headers;
  const clip = (v, n = 200) => String(v || '').slice(0, n);
  const visit = {
    who: clip(body.who, 60) || '(이름 없는 링크)',
    path: clip(body.path),
    ref: clip(body.ref),
    lang: clip(body.lang, 20),
    screen: clip(body.screen, 20),
    country: clip(h['x-vercel-ip-country'], 4),
    city: decodeURIComponent(clip(h['x-vercel-ip-city'], 80)),
    ip: clip((h['x-forwarded-for'] || '').split(',')[0].trim(), 60),
    ua: clip(h['user-agent'], 300),
    at: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
  };

  console.log('VISIT ' + JSON.stringify(visit));

  const text =
    `👀 데모 방문: *${visit.who}*\n` +
    `${visit.at} · ${visit.city || '?'}, ${visit.country || '?'} · ${visit.ip}\n` +
    `${visit.path}${visit.ref ? ' · 유입: ' + visit.ref : ''}\n${visit.ua}`;

  const jobs = [];
  if (process.env.SLACK_WEBHOOK_URL) {
    jobs.push(fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    }));
  }
  if (process.env.DISCORD_WEBHOOK_URL) {
    jobs.push(fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text.replace(/\*/g, '**') }),
    }));
  }
  await Promise.allSettled(jobs);

  res.status(204).end();
}
