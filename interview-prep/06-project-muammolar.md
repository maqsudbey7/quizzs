# 6. Projectda uchraydigan real muammolar va ularning yechimlari

Suhbatda ko'p so'raladi: **"Projectingizda qanday qiyin muammoga duch keldingiz va qanday hal qildingiz?"**
Javobni **STAR** formatida bering:
- **S**ituation — qanday loyiha, qanday vaziyat
- **T**ask — nima qilish kerak edi
- **A**ction — siz aniq nima qildingiz (texnik detallar!)
- **R**esult — natija (raqam bilan bo'lsa yaxshi: "yuklanish 4s → 1.2s")

Quyidagi muammolardan **o'zingiz duch kelgan 3–4 tasini** tanlab, o'z hikoyangizni tayyorlang.

---

## 1. Keraksiz re-render'lar → sahifa sekinlashadi

**Belgilar:** input'ga yozganda qotish, katta ro'yxat sekin.

**Diagnostika:** React DevTools → Profiler → "Highlight updates when components render". Qaysi komponent nima sababdan render bo'layotganini ko'ring.

**Yechimlar:**
1. State'ni **pastga tushiring** (state colocation) — input state'i butun sahifada emas, faqat input komponentida bo'lsin.
2. `React.memo` + `useCallback`/`useMemo` (props barqaror bo'lishi uchun).
3. Redux'da `createSelector`, selector'dan faqat kerakli maydonni oling.
4. Context'ni bo'lib tashlang, `value`ni `useMemo`.
5. Katta ro'yxat → virtualizatsiya (`react-window`).
6. Og'ir filtr → `useDeferredValue` / `useTransition`.

---

## 2. `useEffect` cheksiz sikl

```jsx
// ❌ har renderda yangi ob'ekt → effect qayta ishlaydi → setState → render → ...
const filters = { page, q };
useEffect(() => { fetchData(filters).then(setData); }, [filters]);
```
**Yechim:** dependency'ga primitivlarni qo'ying (`[page, q]`), yoki `useMemo`, yoki fetch'ni RTK Query'ga o'tkazing. ESLint `react-hooks/exhaustive-deps` qoidasini o'chirmang — u to'g'ri aytadi.

---

## 3. Race condition — eski javob yangisini ustidan yozadi

Qidiruvda "ab" va "abc" so'rovlari: "ab" javobi keyinroq kelsa noto'g'ri natija ko'rinadi.
**Yechim:** `AbortController` (03-react #10), debounce, yoki RTK Query/React Query (avtomatik hal qiladi).

---

## 4. Memory leak: "Can't perform a React state update on an unmounted component"

Sabab: komponent yopilgandan keyin timer/listener/subscription/so'rov hali ishlayapti.
**Yechim:** `useEffect`da **har doim cleanup**: `clearInterval`, `removeEventListener`, `controller.abort()`, `socket.close()`, `unsubscribe()`.

---

## 5. Token muddati tugashi (401) va refresh

Bir vaqtda 5 ta so'rov 401 qaytarsa — 5 marta refresh qilmaslik kerak.

```ts
// axios interceptor — bitta refresh, qolganlari navbatda kutadi
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = null; });
        const token = await refreshPromise;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```
RTK Query'da xuddi shunday `baseQueryWithReauth` + `async-mutex` bilan yoziladi.

---

## 6. Loading / error / empty holatlarni unutish

Ko'p junior faqat "muvaffaqiyatli" holatni yozadi. Har bir ma'lumot yuklanadigan joyda **4 holat**: loading (skeleton), error (xabar + "qayta urinish" tugmasi), empty ("hech narsa topilmadi"), success.

```tsx
if (isLoading) return <Skeleton />;
if (isError)   return <ErrorState onRetry={refetch} />;
if (!data?.length) return <EmptyState />;
return <List items={data} />;
```

---

## 7. Form'lar: ko'p maydon, validatsiya, sekinlik

**Yechim:** React Hook Form + Zod. Server xatolarini (`422`) maydonlarga bog'lash (`setError`). Submit paytida tugmani `disabled` qilish (ikki marta yuborishning oldini olish).

```tsx
const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
const { register, handleSubmit, formState: { errors, isSubmitting } } =
  useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
```

---

## 8. Katta ro'yxat / jadval: 10 000 qator

**Yechim:** server-side pagination yoki infinite scroll (`IntersectionObserver`) + virtualizatsiya. Filtr va sahifa raqamini **URL**'da saqlang (`?page=2&q=...`) — refresh va "orqaga" tugmasi ishlaydi, link ulashish mumkin.

---

## 9. Bundle hajmi katta, birinchi yuklanish sekin

**Diagnostika:** Lighthouse, bundle visualizer.
**Yechim:** route-based `lazy()`, og'ir kutubxonalarni dinamik `import()` (chart, editor), rasmlarni optimizatsiya, keraksiz dependency'larni olib tashlash.

---

## 10. Prop drilling va "spagetti" state

**Yechim:** composition (`children`), Context (kam o'zgaradigan ma'lumot), Redux/Zustand (global), server state → RTK Query. Har bir state uchun so'rang: "Bu qayerda yashashi kerak?"

---

## 11. Papka strukturasi tartibsiz

**Feature-based** struktura (middle'dan kutiladi):
```
src/
  app/            # store, router, provider'lar
  features/
    auth/         # authSlice.ts, LoginForm.tsx, api.ts, hooks.ts
    cart/
    products/
  shared/
    ui/           # Button, Modal, Input
    lib/          # utils, helpers
    api/          # axios instance, baseApi
  pages/
```
Yoki **FSD (Feature-Sliced Design)** — O'zbekistondagi ko'p kompaniyalarda so'raladi.

---

## 12. "Menda ishlaydi, prod'da ishlamaydi"

Sabablar: env o'zgaruvchilar, CORS, SPA routing (refresh'da 404 → server'da hammasini `index.html`ga yo'naltirish, Vercel'da `rewrites`), keshlangan eski bundle, case-sensitive fayl nomlari (Windows vs Linux), `console.log` qoldiqlari.

---

## 13. Hydration xatosi (Next.js)

Server va klient HTML'i mos kelmaydi: `Date.now()`, `Math.random()`, `window`/`localStorage`ni render'da ishlatish.
**Yechim:** bunday kodni `useEffect` ichiga ko'chirish, `dynamic(() => import(...), { ssr: false })`.

---

## 14. Bir xil ma'lumot ikki joyda (state sync muammosi)

Ma'lumot Redux'da ham, lokal state'da ham saqlansa — ular bir-biridan ajralib qoladi.
**Yechim:** **Single source of truth.** Hisoblanadigan qiymatni saqlamang — hisoblang (derived state).

---

## 15. Production'dagi xatolarni bilmaslik

**Yechim:** Sentry (error monitoring), Error Boundary + log, analytics. "Foydalanuvchi aytmaguncha bilmaymiz" — yomon holat.

---

## 16. Jamoa bilan ishlash muammolari

- Merge conflict'lar → kichik va tez-tez PR, `main`dan tez-tez `pull/rebase`.
- Tushunarsiz task → savol berish, aniqlashtirish, taxmin qilib ketmaslik.
- Deadline'ga ulgurmaslik → **erta** xabar berish, task'ni bo'laklarga bo'lish.
- Code review'da tanqid → shaxsiy qabul qilmaslik, o'rganish imkoniyati.

---

## 📝 Namuna javob (STAR)

> **S:** Online do'kon loyihasida mahsulotlar sahifasi 2000+ mahsulot bilan juda sekin ishlardi, qidiruvga yozganda qotib qolardi.
> **T:** Sahifani tezlashtirish kerak edi.
> **A:** React Profiler bilan tekshirib, har harf yozilganda butun ro'yxat qayta render bo'layotganini va har harfda API so'rov ketayotganini topdim. Qidiruvga 400ms debounce qo'shdim, eski so'rovlarni AbortController bilan bekor qildim, `ProductCard`ni `React.memo` bilan o'radim, filtr selector'ini `createSelector`ga o'tkazdim va ro'yxatga `react-window` bilan virtualizatsiya qo'shdim. Filtrlarni URL query'ga ko'chirdim.
> **R:** API so'rovlar soni ~10 barobar kamaydi, yozish paytidagi qotish yo'qoldi, Lighthouse performance 58 → 91 ga chiqdi.
