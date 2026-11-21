# 8. Junior → Middle: yo'l xaritasi va tavsiyalar

---

## 8.1 Junior va Middle'ning asosiy farqi

| | Junior | Middle |
|---|---|---|
| Vazifa | Aniq yozilgan task'ni bajaradi | Noaniq task'ni o'zi aniqlashtiradi, bo'laklarga bo'ladi |
| Yordam | Ko'p yordam kerak | Mustaqil, kerak bo'lsa juniorlarga yordam beradi |
| Kod | "Ishlasa bo'ldi" | O'qiladigan, test qilinadigan, kengaytiriladigan |
| Bilim | *Qanday* ishlatishni biladi | *Nima uchun* shunday ishlashini biladi |
| Muammo | Xatoni ko'p vaqt qidiradi | Tizimli debug qiladi (DevTools, Network, Profiler) |
| Qaror | Birinchi topgan yechim | Variantlarni solishtiradi (trade-off) |
| Mas'uliyat | O'z task'i | Feature'ning to'liq hayot sikli: dizayn → kod → test → deploy → monitoring |

**Asosiy fikr:** Middle — ko'proq texnologiya biladigan odam emas, balki **mustaqil va ishonchli** natija beradigan odam.

---

## 8.2 Texnik yo'l xaritasi (taxminan 6–12 oy)

### 1-bosqich: Poydevorni mustahkamlash (1–2 oy)
- [ ] JS: closure, this, prototype, event loop, promise — **boshqaga tushuntira olish** darajasida
- [ ] TypeScript `strict` rejimida loyiha yozish, generics va utility types
- [ ] React: render qachon va nega bo'ladi, hook'larning ichki mantiqi, reconciliation
- [ ] CSS: Flex, Grid, responsive — dizayndan pixel-perfect yasash
- 📚 Manbalar: [javascript.info](https://javascript.info), [react.dev](https://react.dev) (ayniqsa "You Might Not Need an Effect"), TypeScript Handbook, "You Don't Know JS" kitoblari

### 2-bosqich: Ekotizim (2–3 oy)
- [ ] **Redux Toolkit + RTK Query** yoki **TanStack Query** — server state vs client state
- [ ] **React Hook Form + Zod**
- [ ] **React Router** (loader'lar, protected routes)
- [ ] **Next.js** (App Router, SSR/SSG, Server Components) — bozorda talab katta
- [ ] UI kutubxona: shadcn/ui, MUI yoki Ant Design
- [ ] Zustand (kichik global state uchun)

### 3-bosqich: Middle'ni ajratib turadigan ko'nikmalar (3–6 oy)
- [ ] **Testing**: Vitest + React Testing Library + MSW; bitta E2E (Playwright)
- [ ] **Performance**: Profiler, Lighthouse, Web Vitals, code splitting, virtualizatsiya
- [ ] **Arxitektura**: feature-based / FSD papka strukturasi, qayta ishlatiladigan komponentlar, design system
- [ ] **Git**: rebase, cherry-pick, conflict hal qilish, toza commit tarixi
- [ ] **CI/CD**: GitHub Actions (lint + test + build), Vercel/Netlify deploy
- [ ] **Xavfsizlik**: XSS, CSRF, token saqlash, CORS
- [ ] **Accessibility (a11y)**: semantik HTML, klaviatura navigatsiyasi, ARIA
- [ ] Brauzer qanday ishlashi, HTTP, keshlash
- [ ] Asosiy algoritmlar va data structures (array, hash map, stack/queue, tree — LeetCode Easy/Medium 50–100 ta)

### 4-bosqich: Soft skills (doimiy)
- [ ] Task'ni baholash (estimation) va muddatga amal qilish
- [ ] Code review qilish (faqat olish emas, **berish** ham)
- [ ] Texnik qarorni yozma tushuntirish (PR description, kichik hujjat)
- [ ] Backend va dizayner bilan muloqot (API kontrakt, edge case'larni oldindan muhokama)
- [ ] Juniorlarga yordam berish / mentorlik

---

## 8.3 Portfolio: qanday loyihalar qilish kerak

Todo va kalkulyator yetarli emas. **1–2 ta katta, "haqiqiy" loyiha** qiling:

**Misol: E-commerce yoki Admin Dashboard**
- Auth (login/register, JWT + refresh, protected routes, rollar)
- CRUD + server-side pagination, filtr, qidiruv (URL'da saqlanadi)
- RTK Query (cache, invalidation, optimistic update)
- React Hook Form + Zod
- Savat (Redux + persist)
- Loading skeleton, error, empty holatlar
- Dark mode, i18n (uz/ru/en)
- Responsive
- Unit + integration testlar
- CI (GitHub Actions) + deploy (Vercel)
- Yaxshi **README**: skrinshotlar, demo link, texnologiyalar, qanday ishga tushirish, qanday qiyinchiliklar va qarorlar

> 💡 Mavjud quiz loyihangizni (shu repo) ham yaxshilash mumkin: TypeScript'ga o'tkazish, Redux Toolkit/RTK Query qo'shish, natijalar tarixini saqlash, testlar yozish, timer va leaderboard qo'shish. Suhbatda "loyihamni qanday refactor qildim" — ajoyib hikoya.

---

## 8.4 Kundalik odatlar

1. **Har kuni 1–2 soat** o'qish/amaliyot (ish vaqtidan tashqari).
2. **Rasmiy hujjatlarni o'qing** — YouTube'dan ko'ra chuqurroq.
3. **Boshqalarning kodini o'qing** — open source (shadcn/ui, RTK, Excalidraw), jamoadoshlaringizning PR'lari.
4. **"Nega?" deb so'rang** — har bir yechim uchun alternativani o'ylang.
5. **O'rganganingizni yozing** — Telegram kanal, blog, Notion. Tushuntirish — eng yaxshi o'rganish.
6. **AI vositalaridan to'g'ri foydalaning** — kodni ko'r-ko'rona ko'chirmang, har bir qatorni tushunib oling. Suhbatda AI yo'q.
7. **Ingliz tili** — hujjatlar, xalqaro vakansiyalar va remote ish uchun juda muhim.

---

## 8.5 Suhbat jarayoni va taktika

### Odatiy bosqichlar
1. **HR suhbat** — o'zingiz haqingizda, motivatsiya, maosh kutilmasi.
2. **Texnik suhbat** — nazariya savollar (shu papkadagi 01–05).
3. **Live-coding** yoki **test topshiriq** (07).
4. **Project / tajriba muhokamasi** (06).
5. Ba'zan — **team lead / CTO** bilan yakuniy suhbat.

### "O'zingiz haqingizda gapirib bering" — shablon (1–2 daqiqa)
> "Men X yildan beri frontend dasturchiman. Asosiy stack: React, TypeScript, Redux Toolkit. Oxirgi loyiham — [nima], unda men [aniq nima qildim: auth, dashboard, performance]. Eng qiziq muammo — [qisqa STAR]. Hozir [testing / Next.js]ni chuqur o'rganyapman. Sizning kompaniyangizga [sabab] uchun qiziqyapman."

### Texnik savollarga javob berish
- Avval **qisqa ta'rif** → keyin **misol** → keyin **qachon ishlatiladi / kamchiligi**.
- Bilmasangiz: *"Bu bilan ishlamaganman, lekin mantiqan shunday deb o'ylayman…"* — yolg'on gapirgandan ko'ra yaxshi.
- O'z tajribangizdan misol keltiring — "projectimda shunday muammo bo'lgan edi…".

### Live-coding'da
1. Masalani **qayta o'z so'zingiz bilan** ayting.
2. Edge case'larni so'rang (bo'sh massiv? null? katta ma'lumot?).
3. Ovoz chiqarib fikrlang — intervyuer fikrlash jarayonini baholaydi.
4. Avval ishlaydigan oddiy yechim → keyin optimallashtirish.
5. Oxirida qo'lda test qiling.

### Siz beradigan savollar (oxirida albatta so'rang)
- Jamoa qanday tuzilgan? Nechta frontend dasturchi bor?
- Code review jarayoni qanday? Testlar yoziladimi?
- Qanday stack ishlatiladi, texnik qarz ko'pmi?
- Junior/middle'ning o'sishi uchun qanday imkoniyatlar bor (mentor, kurslar)?
- Birinchi 3 oyda mendan nima kutiladi?

### Maosh haqida
Avval bozorni o'rganing (hh.uz, Telegram kanallar, tanishlar). Aniq diapazon ayting, juda past aytmang. "Sizning taklifingizni eshitsam bo'ladimi?" deb so'rash ham mumkin.

---

## 8.6 Suhbatdan oldingi checklist

- [ ] Rezyume: 1 sahifa, raqamlar bilan natijalar, GitHub va demo linklar ishlaydi
- [ ] GitHub: pin qilingan 2–3 ta yaxshi loyiha, toza README
- [ ] 01–05 fayllardagi savollarga ovoz chiqarib javob berib chiqdim
- [ ] 07'dagi masalalardan kamida 10 tasini **qog'ozsiz, yoddan** yoza olaman
- [ ] O'z loyihamdan 3 ta STAR hikoya tayyorladim (06)
- [ ] "O'zim haqimda" matnini mashq qildim
- [ ] Kompaniya haqida o'qib chiqdim (mahsuloti, stack'i)
- [ ] Intervyuerga 3 ta savol tayyorladim
- [ ] (Online bo'lsa) internet, mikrofon, kamera, ekran ulashish tekshirildi

---

## 8.7 Eng muhim maslahat

> Suhbatdan "yiqilish" — normal holat. Har bir suhbatdan keyin **javob bera olmagan savollaringizni yozib oling** va o'sha kuni o'rganing. 5–10 ta suhbatdan keyin savollar takrorlana boshlaydi va siz ancha kuchli bo'lasiz.

Omad! 🚀
