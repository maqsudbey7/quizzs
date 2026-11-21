# 5. Qo'shimcha mavzular — HTML/CSS, brauzer, tarmoq, xavfsizlik, Git, test

---

## 5.1 HTML va CSS

### 🟢 1. Semantik HTML nima va nega muhim?
`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<button>` — ma'noli teglar. Foydasi: **SEO**, **accessibility** (ekran o'quvchilar), o'qilishi oson kod.
❗ Bosiladigan narsa uchun `<div onClick>` emas, `<button>` ishlating (klaviatura va focus avtomatik ishlaydi).

### 🟢 2. Box model? `box-sizing: border-box`?
Element = content + padding + border + margin. `border-box`da `width` padding va border'ni **o'z ichiga oladi** — hisoblash osonlashadi.

### 🟢 3. `display: none` vs `visibility: hidden` vs `opacity: 0`?
- `none` — joy egallamaydi, DOM'da bor.
- `visibility: hidden` — joy egallaydi, ko'rinmaydi, bosib bo'lmaydi.
- `opacity: 0` — joy egallaydi, ko'rinmaydi, **bosish mumkin**.

### 🟢 4. `position` qiymatlari?
`static` (default), `relative` (o'z joyiga nisbatan, absolute bolalar uchun ota), `absolute` (eng yaqin positioned otaga nisbatan, oqimdan chiqadi), `fixed` (viewport'ga nisbatan), `sticky` (scroll'da yopishib qoladi).

### 🟡 5. Flexbox va Grid farqi?
- **Flex** — bir o'lchamli (qator **yoki** ustun). Navbar, kartochka ichidagi elementlarni tekislash.
- **Grid** — ikki o'lchamli (qator **va** ustun). Sahifa layout'i, galereya.
```css
.center { display: flex; justify-content: center; align-items: center; }
.cards  { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
```

### 🟡 6. Specificity (ustuvorlik)?
`!important` > inline style > `#id` > `.class, [attr], :hover` > `tag, ::before`. Teng bo'lsa — keyin yozilgani yutadi.

### 🟡 7. Responsive dizayn?
Mobile-first `@media (min-width: 768px)`, nisbiy birliklar (`rem`, `%`, `vw`, `clamp()`), flex/grid, `<meta name="viewport">`, responsive rasmlar (`srcset`).

### 🟡 8. CSS-in-JS, CSS Modules, Tailwind — farqi?
- **CSS Modules** — klass nomlari avtomatik lokal (`styles.button`), to'qnashuv yo'q.
- **Tailwind** — utility-first, tez yozish, kichik CSS bundle.
- **styled-components / emotion** — JS ichida CSS, dinamik stillar, lekin runtime xarajat.
- **SCSS** — o'zgaruvchilar, nesting, mixin.

---

## 5.2 Brauzer va performance

### 🟡 9. Brauzerga URL yozganda nima sodir bo'ladi?
1. DNS → IP manzil.
2. TCP (+ TLS handshake HTTPS uchun).
3. HTTP so'rov → server javobi (HTML).
4. HTML parse → **DOM**; CSS parse → **CSSOM**.
5. DOM + CSSOM → **Render tree** → **Layout** (o'lcham/joy) → **Paint** → **Composite**.
6. `<script>` parse'ni to'xtatadi (`defer`/`async` bo'lmasa).

### 🟡 10. Reflow va repaint?
- **Reflow (layout)** — geometriya o'zgarganda (width, height, joy) qayta hisoblash — qimmat.
- **Repaint** — faqat ko'rinish (rang, fon) o'zgarganda.
- `transform` va `opacity` — faqat composite, eng arzon → animatsiya uchun shularni ishlating.

### 🟡 11. `script`da `async` va `defer`?
- `defer` — parallel yuklaydi, HTML parse tugagach **tartib bilan** bajaradi. Odatda shu.
- `async` — parallel yuklaydi, yuklanishi bilan **darhol** bajaradi (tartib kafolatlanmaydi). Analytics uchun.

### 🟡 12. Core Web Vitals?
- **LCP** (Largest Contentful Paint) — eng katta element chizilish vaqti (< 2.5s).
- **INP** (Interaction to Next Paint) — interaktivlik tezligi (< 200ms).
- **CLS** (Cumulative Layout Shift) — sahifa "sakrashi" (< 0.1). Rasmlarga `width/height` bering.

### 🟡 13. Frontend performance'ni qanday yaxshilaysiz?
- Code splitting, lazy loading (route va og'ir komponentlar).
- Rasm optimizatsiya: WebP/AVIF, `loading="lazy"`, to'g'ri o'lcham.
- Katta ro'yxatlar uchun **virtualizatsiya** (`react-window`, `@tanstack/react-virtual`).
- Keraksiz re-render'larni kamaytirish (Profiler bilan topish, memo).
- Debounce/throttle.
- Bundle tahlili (`rollup-plugin-visualizer`), og'ir kutubxonalarni almashtirish (moment → dayjs, lodash → lodash-es/native).
- Keshlash, CDN, gzip/brotli.

---

## 5.3 Tarmoq va API

### 🟢 14. HTTP metodlar va status kodlar?
- `GET` (o'qish), `POST` (yaratish), `PUT` (to'liq almashtirish), `PATCH` (qisman yangilash), `DELETE`.
- **Idempotent**: GET, PUT, DELETE (bir necha marta chaqirish natijani o'zgartirmaydi). POST — idempotent emas.
- Kodlar: `200` OK, `201` Created, `204` No Content, `301/302` redirect, `304` Not Modified, `400` Bad Request, `401` Unauthorized (autentifikatsiya yo'q), `403` Forbidden (huquq yo'q), `404`, `409` Conflict, `422` validatsiya, `429` Too Many Requests, `500`, `502`, `503`.

### 🟡 15. CORS nima?
Brauzerning xavfsizlik siyosati: boshqa **origin**'ga (protokol + domen + port) so'rovga server `Access-Control-Allow-Origin` header bilan ruxsat bermasa, brauzer javobni bloklaydi. "Murakkab" so'rovlardan oldin `OPTIONS` **preflight** yuboriladi.
❗ CORS **server tomonida** hal qilinadi. Development'da — Vite `server.proxy`.

### 🟡 16. REST vs GraphQL?
- REST — resurs bo'yicha endpoint'lar, over/under-fetching bo'lishi mumkin.
- GraphQL — bitta endpoint, klient kerakli maydonlarni o'zi so'raydi.

### 🟡 17. Axios va fetch farqi?
Axios: avtomatik JSON, **4xx/5xx da reject qiladi**, interceptor'lar, timeout, eski brauzerlar. Fetch: native, `res.ok`ni qo'lda tekshirish, `AbortController`.

### 🟡 18. WebSocket, SSE, polling?
- **Polling** — har N soniyada so'rov (oddiy, lekin isrof).
- **SSE** — server → klient bir tomonlama oqim (bildirishnomalar, AI stream).
- **WebSocket** — ikki tomonlama real-time (chat, o'yin).

### 🟡 19. JWT, access va refresh token?
- **Access token** — qisqa muddatli (5–15 daq), har so'rovda `Authorization: Bearer`.
- **Refresh token** — uzoq muddatli, yangi access token olish uchun (ideal holda `HttpOnly` cookie'da).
- 401 kelsa → refresh → asl so'rovni qayta yuborish (interceptor bilan, [06-fayl](./06-project-muammolar.md)da kod bor).

---

## 5.4 Xavfsizlik

### 🟡 20. XSS nima va React qanday himoya qiladi?
**XSS** — sahifaga zararli skript kiritish. React `{}` ichidagi matnni avtomatik escape qiladi. Xavfli joylar: `dangerouslySetInnerHTML` (kerak bo'lsa **DOMPurify** bilan tozalang), `href={userInput}` (`javascript:` URL), token'ni `localStorage`da saqlash.

### 🟡 21. CSRF nima?
Foydalanuvchi boshqa saytda turib, sizning saytingizga uning cookie'lari bilan so'rov yuborilishi. Himoya: `SameSite` cookie, CSRF token.

---

## 5.5 Git va jamoada ishlash

### 🟢 22. Asosiy buyruqlar?
`clone`, `status`, `add`, `commit`, `push`, `pull`, `fetch`, `branch`, `checkout/switch`, `merge`, `rebase`, `stash`, `log`, `diff`, `reset`, `revert`, `cherry-pick`.

### 🟡 23. `merge` vs `rebase`?
- `merge` — tarixni saqlaydi, merge commit yaratadi.
- `rebase` — commit'larni boshqa branch ustiga "ko'chiradi", tarix chiziqli. ❗ **Umumiy (push qilingan) branch'ni rebase qilmang**.

### 🟡 24. `reset` vs `revert`?
- `reset` — tarixni o'chiradi/o'zgartiradi (lokal uchun).
- `revert` — o'zgarishni bekor qiluvchi **yangi** commit yaratadi (push qilingan kod uchun xavfsiz).

### 🟡 25. Merge conflict'ni qanday hal qilasiz?
Konflikt markerlarini (`<<<<<<<`, `=======`, `>>>>>>>`) ko'rib chiqaman, ikkala tomon mantiqini tushunaman, kerak bo'lsa kod muallifi bilan gaplashaman, keyin test qilib commit qilaman.

### 🟢 26. Conventional commits, Git flow?
`feat: ...`, `fix: ...`, `refactor: ...`, `chore: ...`. Branch'lar: `main`, `develop`, `feature/xxx`, `hotfix/xxx`. Pull Request → code review → merge.

---

## 5.6 Testing

### 🟡 27. Test turlari?
- **Unit** — alohida funksiya/komponent (Jest/Vitest).
- **Integration** — bir nechta qism birga (React Testing Library).
- **E2E** — real brauzerda butun oqim (Playwright, Cypress).

### 🟡 28. React Testing Library falsafasi?
"Foydalanuvchi qanday ishlatsa, shunday test qiling" — implementatsiya detallarini emas, **natijani** tekshiring.
```tsx
test('tugma bosilganda counter oshadi', async () => {
  render(<Counter />);
  await userEvent.click(screen.getByRole('button', { name: /oshirish/i }));
  expect(screen.getByText('1')).toBeInTheDocument();
});
```
API mock uchun — **MSW** (Mock Service Worker).

---

## 5.7 Build vositalar

### 🟡 29. Vite va Webpack farqi?
- **Vite** — dev'da native ES modules (bundle qilmaydi → juda tez start), HMR tez; production'da Rollup bilan bundle.
- **Webpack** — hamma narsani bundle qiladi, juda moslashuvchan, lekin sekinroq va konfiguratsiyasi murakkab.

### 🟡 30. Tree shaking, minification, source map?
- **Tree shaking** — ishlatilmagan export'larni bundle'dan olib tashlash (ESM kerak).
- **Minification** — bo'shliq, nomlarni qisqartirish.
- **Source map** — minified koddagi xatoni asl kodga bog'lash (debug uchun).

### 🟢 31. ESLint va Prettier?
ESLint — kod sifati va xatolar (masalan `react-hooks/exhaustive-deps`). Prettier — formatlash. Husky + lint-staged — commit oldidan avtomatik tekshirish.

### 🟢 32. `.env` o'zgaruvchilar?
Vite'da `VITE_` prefiksli o'zgaruvchilar `import.meta.env.VITE_API_URL` orqali. ❗ Frontend'dagi env **maxfiy emas** — bundle'ga tushadi. Secret key'larni hech qachon frontend'ga qo'ymang.
