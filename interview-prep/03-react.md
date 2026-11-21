# 3. React — savol va javoblar

---

## 3.1 Asoslar

### 🟢 1. React nima? Virtual DOM nima?

React — UI qurish uchun **komponentlarga asoslangan, deklarativ** kutubxona. Siz "UI qanday ko'rinishi kerak"ligini yozasiz (state → UI), React DOM'ni o'zi yangilaydi.

**Virtual DOM** — haqiqiy DOM'ning yengil JS ob'ektlardagi nusxasi. State o'zgarganda:
1. Yangi virtual daraxt yaratiladi (render).
2. Eski daraxt bilan solishtiriladi (**reconciliation / diffing**).
3. Faqat farq qilgan joylar haqiqiy DOM'ga yoziladi (**commit**).

Haqiqiy DOM operatsiyalari qimmat — shuning uchun minimal o'zgarish foydali.

---

### 🟢 2. JSX nima?

JSX — JS ichida HTML'ga o'xshash sintaksis. Babel/SWC uni `React.createElement(...)` (yangi JSX transform'da `_jsx(...)`) chaqiruvlariga aylantiradi.
- `class` → `className`, `for` → `htmlFor`
- `{}` ichida faqat **expression** (if/for emas — ternary, `&&`, `map`).
- Bitta root element yoki `<>...</>` (Fragment).

---

### 🟢 3. Props va state farqi?

| Props | State |
|---|---|
| Ota komponentdan keladi | Komponentning o'zida saqlanadi |
| **Read-only** (o'zgartirib bo'lmaydi) | `setState` orqali o'zgaradi |
| O'zgarsa — komponent qayta render bo'ladi | O'zgarsa — komponent qayta render bo'ladi |

Ma'lumot **yuqoridan pastga** oqadi (one-way data flow). Bola otaga ma'lumot yubormoqchi bo'lsa — ota callback funksiya props sifatida beradi.

---

### 🟢 4. `key` nima uchun kerak? Nega `index`ni key qilmaslik kerak?

`key` — React'ga ro'yxatdagi qaysi element qaysi ekanini aniqlashga yordam beradi (reconciliation uchun).

`index` key bo'lsa: element **o'chirilsa, qo'shilsa yoki tartibi o'zgarsa**, React noto'g'ri elementlarni qayta ishlatadi → input qiymatlari aralashib ketadi, animatsiyalar buziladi, ortiqcha re-render.

```jsx
{todos.map(t => <TodoItem key={t.id} todo={t} />)}  // ✅ barqaror unikal id
```
Index faqat ro'yxat **statik** bo'lsa (hech qachon o'zgarmasa) qabul qilinadi. `key={Math.random()}` — ❌ eng yomoni, har renderda hammasi qayta yaratiladi.

**Trick:** `key`ni o'zgartirib komponentni majburan "reset" qilish mumkin: `<Form key={userId} />`.

---

### 🟢 5. Controlled va uncontrolled komponent?

```jsx
// Controlled — qiymat React state'da
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />

// Uncontrolled — qiymat DOM'da, ref orqali o'qiladi
const ref = useRef(null);
<input defaultValue="" ref={ref} />
// ref.current.value
```
Katta formalar uchun **React Hook Form** (uncontrolled asosida, kam re-render) + **Zod/Yup** validatsiya — amaliyotda eng keng tarqalgan.

---

### 🟢 6. Komponent qachon qayta render bo'ladi?

1. O'zining **state**'i o'zgarganda.
2. **Ota komponent** render bo'lganda (props o'zgarmasa ham!).
3. Ishlatayotgan **Context** qiymati o'zgarganda.
4. Custom hook ichidagi state o'zgarganda.

❗ "Props o'zgarganda render bo'ladi" — to'liq to'g'ri emas. Ota render bo'lsa bola **default holatda** doim render bo'ladi. Buni `React.memo` bilan to'xtatish mumkin.

---

## 3.2 Hooks

### 🟢 7. Hook qoidalari?

1. Faqat **komponent yoki custom hook'ning yuqori darajasida** chaqiring — `if`, `for`, ichki funksiyada emas.
2. Faqat React funksiyalarida chaqiring.

Sabab: React hook'larni **chaqirilish tartibi** bo'yicha eslab qoladi (ichkarida ro'yxat/linked list). Tartib o'zgarsa state aralashib ketadi.

---

### 🟢 8. `useState` haqida chuqurroq

```jsx
const [count, setCount] = useState(0);

// ❗ setState asinxron (batch qilinadi) — darhol yangi qiymat kelmaydi
setCount(count + 1);
console.log(count); // hali eski qiymat

// Ketma-ket yangilash:
setCount(count + 1); setCount(count + 1);       // +1 (ikkalasi ham eski count'ni oladi)
setCount(c => c + 1); setCount(c => c + 1);     // +2 ✅

// Lazy initial state — og'ir hisob faqat bir marta
const [data, setData] = useState(() => JSON.parse(localStorage.getItem('d') ?? '[]'));

// Ob'ekt/massivni MUTATE qilmang
setUser({ ...user, name: 'Ali' });              // ✅
user.name = 'Ali'; setUser(user);               // ❌ havola o'zgarmagan → render bo'lmaydi
```

React 18'dan boshlab **automatic batching** — `setTimeout`, promise, native event ichida ham bir nechta setState bitta render'ga birlashtiriladi.

---

### 🟡 9. `useEffect` qanday ishlaydi? Dependency array?

`useEffect` — render **commit qilingandan keyin** (ekranga chizilgandan keyin) side effect bajarish uchun: API so'rov, subscription, timer, DOM bilan ishlash.

```jsx
useEffect(() => { ... });            // har renderdan keyin
useEffect(() => { ... }, []);        // faqat mount'da (bir marta)
useEffect(() => { ... }, [id]);      // id o'zgarganda

useEffect(() => {
  const handler = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler); // cleanup
}, []);
```

**Cleanup** qachon ishlaydi: komponent unmount bo'lganda **va** keyingi effect ishlashidan oldin.

**StrictMode'da** (development) effect'lar 2 marta ishlaydi (mount → unmount → mount) — cleanup to'g'ri yozilganini tekshirish uchun. Bu bug emas.

---

### 🟡 10. `useEffect`da fetch qilishdagi muammolar va yechim (race condition)

```jsx
useEffect(() => {
  const controller = new AbortController();
  setLoading(true);

  fetch(`/api/users/${id}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(e => { if (e.name !== 'AbortError') setError(e); })
    .finally(() => setLoading(false));

  return () => controller.abort(); // id tez o'zgarsa eski so'rov bekor qilinadi
}, [id]);
```
Muammo: foydalanuvchi id=1 → id=2 ni tez bossa, id=1 javobi **keyinroq** kelib id=2 ni ustidan yozishi mumkin. AbortController yoki `ignore` flag bilan hal qilinadi.

Amaliyotda: server ma'lumotlari uchun **TanStack Query** yoki **RTK Query** — caching, loading, error, refetch, race condition'larni o'zi hal qiladi.

---

### 🟡 11. Sizga `useEffect` kerak emas — qachon?

- **Props/state'dan hisoblanadigan qiymat** uchun effect + state kerak emas:
```jsx
// ❌
const [fullName, setFullName] = useState('');
useEffect(() => setFullName(first + ' ' + last), [first, last]);
// ✅
const fullName = first + ' ' + last;
```
- Foydalanuvchi harakatiga javob (tugma bosildi → so'rov) — **event handler** ichida qiling, effect'da emas.
- Props o'zgarganda state'ni reset qilish — `key` ishlating.

---

### 🟡 12. `useEffect` vs `useLayoutEffect`?

- `useEffect` — brauzer ekranga chizgandan **keyin** (asinxron). 99% holatda shu.
- `useLayoutEffect` — DOM yangilangandan keyin, lekin chizishdan **oldin** (sinxron). Element o'lchamini o'lchab, pozitsiyani tuzatish (tooltip) — "miltillash"ning oldini olish uchun.

---

### 🟡 13. `useRef` nima uchun?

1. DOM elementga murojaat: `inputRef.current.focus()`.
2. Render'lar orasida **o'zgaruvchan qiymat saqlash, lekin re-render chaqirmasdan**: timer id, oldingi qiymat, "mounted" flag.

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}
```
`ref.current`ni o'zgartirish render chaqirmaydi. Render paytida `ref.current`ni o'qish/yozish tavsiya etilmaydi.

---

### 🟡 14. `useMemo` va `useCallback` farqi? Qachon ishlatish kerak?

- `useMemo(() => compute(a, b), [a, b])` — **qiymatni** memoizatsiya qiladi.
- `useCallback(fn, [deps])` — **funksiyaning o'zini** (havolasini) memoizatsiya qiladi. `useCallback(fn, d) === useMemo(() => fn, d)`.

**Qachon kerak:**
1. Haqiqatan **og'ir hisob** (minglab elementni filter/sort).
2. Qiymat/funksiya `React.memo` bilan o'ralgan bolaga props sifatida beriladi.
3. Qiymat boshqa hook'ning dependency'si (`useEffect` cheksiz sikl bo'lmasligi uchun).

**Qachon kerak emas:** hamma joyga qo'yish — kod murakkablashadi, memo'ning o'zi ham xarajat. Avval **o'lchang** (React DevTools Profiler).

```jsx
const Child = React.memo(function Child({ onClick }) { ... });

function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => console.log('click'), []); // havola barqaror
  return <Child onClick={handleClick} />;   // Parent render bo'lsa ham Child render bo'lmaydi
}
```
Eslatma: **React Compiler** (React 19 ekotizimi) memoizatsiyani avtomatik qila boshladi — lekin suhbatda qo'lda qanday ishlashini bilishingiz kerak.

---

### 🟡 15. `useContext` nima? Kamchiligi?

Context — props drilling'siz (ko'p qavatdan props uzatmasdan) ma'lumot uzatish: theme, til, auth user.

```jsx
const ThemeContext = createContext('light');
<ThemeContext.Provider value={theme}><App /></ThemeContext.Provider>
const theme = useContext(ThemeContext);
```

**Kamchilik:** `value` o'zgarsa **barcha** consumer'lar qayta render bo'ladi. Shuning uchun:
- `value`ni `useMemo` bilan o'rang (har renderda yangi ob'ekt bo'lmasligi uchun).
- Tez-tez o'zgaradigan va kam o'zgaradigan ma'lumotni alohida context'larga ajrating.
- Murakkab global state uchun Redux Toolkit / Zustand.

---

### 🟡 16. `useReducer` qachon kerak?

State murakkab bo'lsa (bir nechta bog'liq maydon, keyingi holat oldingisiga bog'liq) — logikani komponentdan ajratish uchun:

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'add': return { ...state, items: [...state.items, action.item] };
    case 'remove': return { ...state, items: state.items.filter(i => i.id !== action.id) };
    default: return state;
  }
}
const [state, dispatch] = useReducer(reducer, { items: [] });
```

---

### 🟡 17. Custom hook nima? Misol.

`use` bilan boshlanadigan, ichida boshqa hook'larni ishlatadigan funksiya — **logikani qayta ishlatish** uchun (UI emas).

```jsx
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ishlatish
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search);
useEffect(() => { if (debouncedSearch) fetchResults(debouncedSearch); }, [debouncedSearch]);
```
Boshqa misollar: `useFetch`, `useLocalStorage`, `useOnClickOutside`, `useMediaQuery`, `useToggle`.

---

### 🟡 18. React 18/19 yangi hook'lari?

- `useId` — SSR'da ham barqaror unikal id (label/input uchun).
- `useTransition` — shoshilinch bo'lmagan yangilanishni belgilash (katta ro'yxat filtrlash), UI qotmaydi.
- `useDeferredValue` — qiymatning "kechiktirilgan" versiyasi.
- `useSyncExternalStore` — tashqi store'larga obuna (Redux shu orqali ulanadi).
- React 19: `use()` (promise/context o'qish), `useActionState`, `useFormStatus`, `useOptimistic`, Server Components, Actions, `ref` oddiy prop sifatida (`forwardRef` shart emas).

---

## 3.3 Arxitektura va patternlar

### 🟡 19. Lifting state up va props drilling?

- **Lifting state up** — ikki aka-uka komponent bir xil state'ga muhtoj bo'lsa, state'ni eng yaqin umumiy otaga ko'tarish.
- **Props drilling** — props'ni ko'p qavatdan (ishlatmaydigan komponentlar orqali) o'tkazish. Yechim: **composition** (`children` orqali), Context, global state.

```jsx
// Composition bilan drilling'ni kamaytirish
<Layout sidebar={<Sidebar user={user} />}>
  <Content />
</Layout>
```

---

### 🟡 20. HOC, render props, compound components?

- **HOC** — komponent olib, yangi komponent qaytaradigan funksiya: `withAuth(Component)`. Hozir ko'pincha custom hook bilan almashtiriladi.
- **Render props** — `<DataLoader render={data => <List data={data} />} />`.
- **Compound components** — `<Tabs><Tabs.List/><Tabs.Panel/></Tabs>` — ichki holatni Context orqali bo'lishadi (UI kutubxonalarda keng tarqalgan).

---

### 🟡 21. Error Boundary nima?

Bola komponentlardagi **render paytidagi** xatolarni ushlab, butun ilova "oq ekran" bo'lmasligi uchun fallback UI ko'rsatadi. Faqat **class** komponent bilan yoziladi (yoki `react-error-boundary` kutubxonasi).

Ushlamaydi: event handler'lardagi xatolar, asinxron kod (setTimeout, promise), SSR, boundary'ning o'zidagi xato.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logToSentry(error, info); }
  render() { return this.state.hasError ? <h2>Xatolik yuz berdi</h2> : this.props.children; }
}
```

---

### 🟡 22. Code splitting va lazy loading?

```jsx
const AdminPage = lazy(() => import('./pages/AdminPage'));

<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/admin" element={<AdminPage />} />
  </Routes>
</Suspense>
```
Bundle sahifalar bo'yicha bo'linadi — birinchi yuklanish tezlashadi.

---

### 🟡 23. Portal nima?

`createPortal(children, domNode)` — komponentni DOM daraxtining boshqa joyiga (masalan `document.body`) chizish. Modal, tooltip, dropdown uchun (`overflow: hidden` va `z-index` muammolaridan qochish). Event'lar React daraxti bo'yicha bubble qiladi.

---

### 🟡 24. `React.memo` qachon ishlamaydi?

Props'da har renderda **yangi** ob'ekt/massiv/funksiya bo'lsa:
```jsx
<Child style={{ color: 'red' }} />       // har safar yangi ob'ekt → memo foydasiz
<Child onClick={() => doSomething()} />  // har safar yangi funksiya
<Child items={data.filter(...)} />       // har safar yangi massiv
```
Yechim: `useMemo`/`useCallback` yoki ob'ektni komponentdan tashqariga chiqarish.

---

### 🟡 25. Reconciliation algoritmi qanday ishlaydi?

React ikki taxmin asosida O(n) diffing qiladi:
1. **Har xil tipdagi** element (`<div>` → `<span>`, `ComponentA` → `ComponentB`) — eski daraxt to'liq o'chiriladi, yangisi yaratiladi (state yo'qoladi).
2. Ro'yxatdagi elementlar `key` orqali aniqlanadi.

❗ Komponentni boshqa komponent **ichida** e'lon qilmang — har renderda yangi tip bo'ladi va state yo'qoladi:
```jsx
function Parent() {
  const Child = () => <input />;  // ❌ har renderda yangi komponent → input focus yo'qoladi
  return <Child />;
}
```

---

### 🟡 26. React Fiber nima?

React 16'dan beri ichki arxitektura. Render ishini kichik bo'laklarga (fiber) bo'lib, **to'xtatib turish, ustuvorlik berish va davom ettirish** imkonini beradi. Concurrent features (`useTransition`, Suspense) shunga asoslangan.

Ikki faza: **render** (pure, to'xtatilishi mumkin) va **commit** (DOM'ga yozish, sinxron).

---

### 🟢 27. React Router asoslari (v6+)?

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="products/:id" element={<Product />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>

const { id } = useParams();
const navigate = useNavigate(); navigate('/login', { replace: true });
const [searchParams, setSearchParams] = useSearchParams(); // ?page=2&q=phone
```
**Protected route:**
```jsx
function RequireAuth({ children }) {
  const user = useSelector(selectUser);
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
```

---

### 🟡 28. SSR, CSR, SSG farqi? Next.js nima beradi?

- **CSR** (Client-Side Rendering) — bo'sh HTML + JS, brauzer chizadi (Vite + React). SEO zaif, birinchi yuklanish sekinroq.
- **SSR** — har so'rovda serverda HTML generatsiya. SEO yaxshi, birinchi kontent tez.
- **SSG** — build vaqtida HTML generatsiya (blog, landing).
- **ISR** — SSG + vaqti-vaqti bilan qayta generatsiya.
- **Hydration** — serverdan kelgan HTML'ga brauzerda JS "jon kiritishi" (event'larni ulash).

Next.js (App Router): Server Components, file-based routing, SSR/SSG, image optimizatsiya, API routes. Middle uchun Next.js asoslarini bilish katta plyus.
