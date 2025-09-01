# Ordinace Klapala – Tools API (Webhook backend pro ElevenLabs)

Tento projekt poskytuje jednoduché API endpointy pro napojení **ElevenLabs Agent** pomocí **Webhook tools**.
Hostovat lze na **Vercelu** (doporučeno) nebo kdekoli jinde (Docker).

## Obsah
- `/api/tools/appointments.search` – najde nejbližší volné termíny (mock 2 sloty)
- `/api/tools/appointments.book` – potvrdí rezervaci (mock, vrací bookingId)
- `/api/tools/patients.search` – vyhledá pacienta dle jména/telefonu (mock)
- `/api/tools/faq` – vrátí stručné FAQ odpovědi

## Rychlý start
```bash
pnpm install
cp .env.example .env
pnpm dev
# nebo prod
pnpm build && pnpm start
```

### Env proměnné
Uprav `.env`:
```
TOOLS_API_KEY=supersecret123

ELEVENLABS_API_KEY=
ELEVENLABS_AGENT_ID=
ELEVENLABS_VOICE_ID=
ELEVENLABS_USE_REALTIME=true
```
> `TOOLS_API_KEY` je **tajný klíč**, kterým chráníš své endpointy.
> V ElevenLabs nastav v každém Webhook toolu hlavičku: `X-API-KEY: supersecret123`.

## Nasazení na Vercel
1. Pushni repo na GitHub.
2. Vercel → New Project → vyber repo.
3. V **Settings → Environment Variables** přidej `TOOLS_API_KEY` (stejnou hodnotu).
4. Deploy.

## Nastavení Webhook tools v ElevenLabs
V Agentovi přidej 4 nástroje:

- **appointments.search**  
  `POST https://TVUJPROJEKT.vercel.app/api/tools/appointments.search`
- **appointments.book**  
  `POST https://TVUJPROJEKT.vercel.app/api/tools/appointments.book`
- **patients.search**  
  `POST https://TVUJPROJEKT.vercel.app/api/tools/patients.search`
- **faq.get**  
  `GET https://TVUJPROJEKT.vercel.app/api/tools/faq`

Headers pro všechny:
```
Content-Type: application/json
X-API-KEY: supersecret123
```

## Test lokálně
```bash
curl -X POST http://localhost:3000/api/tools/appointments.search   -H "x-api-key: supersecret123" -H "content-type: application/json"   -d '{}'
```

## Docker (nasazení mimo Vercel)
```bash
docker build -t ordinace-klapala .
docker run -p 3000:3000 --env-file .env ordinace-klapala
```

---

**Pozn.:** Toto je jen backend pro tools. Frontend (UI recepce + hlas) stavíš zvlášť a volá tyto endpointy, zatímco ElevenLabs Agent má pravidla/“osobnost” a používá webhooky.
