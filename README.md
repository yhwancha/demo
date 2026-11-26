# 법인카드 관리 데모

눌러 볼 수 있는 화면 시안입니다. 정적 HTML 한 장(`public/index.html`)이고 Vercel 에 올라가 있습니다.

## 받는 사람별 링크

`/v/<이름>` 으로 링크를 만들어 보내면 누가 열었는지 구분됩니다. 페이지 내용은 같습니다.

- `https://<도메인>/v/acme` → acme 에게 보낸 링크
- `https://<도메인>/?u=acme` 도 같은 뜻으로 동작합니다.

## 방문 확인

1. **Vercel Analytics** (프로젝트 → Analytics): 방문자 수, 페이지뷰, 국가, 기기, 유입 경로. 페이지 목록에 `/v/acme` 가 보이면 acme 가 연 것입니다.
2. **실시간 알림**: Vercel 프로젝트 환경변수에 `SLACK_WEBHOOK_URL` 또는 `DISCORD_WEBHOOK_URL` 을 넣으면, 링크가 열릴 때마다 시각·도시·기기와 함께 알림이 옵니다.
3. **로그**: 프로젝트 → Logs 에서 `VISIT` 로 검색 (Hobby 플랜은 보관 기간이 짧습니다).
