# Frontend suhbat savollari va javoblari (Junior → Middle)

Hammasi bitta ro'yxatda. Savolni o'qing, javobni yopib o'zingiz ayting, keyin tekshiring.

---

## JAVASCRIPT

**1. `var`, `let`, `const` farqi nima?**
`var` funksiya ichida amal qiladi va qayta e'lon qilish mumkin. `let` va `const` faqat `{ }` blok ichida amal qiladi. `const`ga qayta qiymat berib bo'lmaydi, lekin ichidagi ob'ektni o'zgartirish mumkin.

**2. JS'da qanday tiplar bor?**
7 ta primitiv: `string`, `number`, `boolean`, `undefined`, `null`, `symbol`, `bigint`. Qolgan hammasi `object` (array va function ham object).

**3. Primitiv va object nusxalanishining farqi?**
Primitiv qiymat bo'yicha nusxalanadi. Object esa havola (reference) bo'yicha: `b = a` qilsangiz ikkalasi bitta ob'ektni ko'rsatadi.

**4. `==` va `===` farqi?**
`==` tiplarni o'zgartirib solishtiradi (`0 == ''` → true). `===` tip va qiymatni birga tekshiradi. Doim `===` ishlating.

**5. `null` va `undefined` farqi?**
`undefined` — qiymat umuman berilmagan. `null` — dasturchi ataylab "bo'sh" deb qo'ygan.

**6. Falsy qiymatlar qaysilar?**
`false`, `0`, `""`, `null`, `undefined`, `NaN`. Qolgan hammasi truthy, jumladan `[]` va `{}`.

**7. `??` va `||` farqi?**
`||` har qanday falsy qiymatda o'ng tomonni oladi. `??` esa faqat `null`/`undefined` bo'lganda. Misol: `0 || 5` → 5, `0 ?? 5` → 0.

**8. Optional chaining `?.` nima?**
`user?.address?.city` — oraliqdagi qiymat `null` bo'lsa xato bermaydi, `undefined` qaytaradi.

**9. Hoisting nima?**
JS kod bajarilishidan oldin e'lonlarni "yuqoriga ko'taradi". `function` to'liq ko'tariladi. `var` ko'tariladi, lekin qiymati `undefined` bo'ladi. `let`/`const` ham ko'tariladi, lekin e'londan oldin ishlatsangiz xato beradi (TDZ).

**10. Closure nima?**
Ichki funksiya tashqi funksiya o'zgaruvchilarini, tashqi funksiya ishini tugatgandan keyin ham "eslab qoladi".
```js
function counter() { let c = 0; return () => ++c; }
const inc = counter(); inc(); inc(); // 2
```
Ishlatiladigan joylari: private o'zgaruvchi, debounce, React hook'lar.

**11. `this` nima?**
Funksiya qanday chaqirilganiga bog'liq. `obj.method()` → `this` = `obj`. Oddiy chaqiruvda → `undefined`. `new` bilan → yangi ob'ekt. Arrow function'ning o'z `this`i yo'q, uni tashqaridan oladi.

**12. `call`, `apply`, `bind` farqi?**
Uchalasi ham `this`ni belgilaydi. `call` argumentlarni alohida oladi, `apply` massivda oladi — ikkalasi darhol chaqiradi. `bind` esa yangi funksiya qaytaradi, darhol chaqirmaydi.

**13. Arrow function va oddiy funksiya farqi?**
Arrow'da `this` va `arguments` yo'q, uni `new` bilan chaqirib bo'lmaydi, sintaksisi qisqa.

**14. Pure function nima?**
Bir xil kirishga doim bir xil natija qaytaradi va tashqi narsani o'zgartirmaydi. Redux reducer'lari pure bo'lishi shart.

**15. Event loop qanday ishlaydi?**
JS bitta oqimda ishlaydi. Ketma-ketlik: avval sinxron kod → keyin barcha microtask'lar (Promise, await) → keyin bitta macrotask (setTimeout) → yana microtask'lar…
```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1 4 3 2
```

**16. Promise nima?**
Kelajakda keladigan natija. Holatlari: `pending` → `fulfilled` yoki `rejected`.

**17. `Promise.all`, `allSettled`, `race`, `any` farqi?**
`all` — hammasi muvaffaqiyatli bo'lishini kutadi, bittasida xato bo'lsa darhol xato beradi. `allSettled` — hammasini kutadi, xato bo'lsa ham. `race` — birinchi tugaganini qaytaradi. `any` — birinchi muvaffaqiyatlisini qaytaradi.

**18. async/await va xatoni ushlash qanday?**
`try { await ... } catch (e) { ... }`. Eslatma: `fetch` 404/500 kodida xato bermaydi, `res.ok`ni o'zingiz tekshirishingiz kerak.

**19. Ikkita so'rovni qanday tez bajaramiz?**
Ketma-ket `await` qilmang. `await Promise.all([a(), b()])` — ikkalasi parallel ishlaydi.

**20. Prototype nima?**
Har bir ob'ektda yashirin havola bor (prototype). Kerakli xususiyat ob'ektning o'zida topilmasa, JS uni prototype zanjiri bo'ylab qidiradi. `class` aslida shuning ustiga qurilgan.

**21. Shallow va deep copy farqi?**
`{...obj}` faqat yuqori darajani nusxalaydi, ichki ob'ektlar umumiy qoladi. To'liq nusxa olish uchun `structuredClone(obj)` ishlating.

**22. Qaysi array metodlari massivni o'zgartiradi?**
O'zgartiradi: `push`, `pop`, `splice`, `sort`, `reverse`. Yangi massiv qaytaradi: `map`, `filter`, `slice`, `concat`. React state bilan faqat ikkinchi guruhni ishlating.

**23. `map`, `filter`, `reduce` nima qiladi?**
`map` har bir elementni o'zgartiradi, `filter` shartga mos elementlarni tanlaydi, `reduce` massivdan bitta natija hosil qiladi (yig'indi, guruhlash).

**24. `Map` va `Set` nima?**
`Map` — kaliti har qanday tipda bo'lishi mumkin bo'lgan lug'at. `Set` — faqat unikal qiymatlar. Dublikatlarni olib tashlash: `[...new Set(arr)]`.

**25. Event bubbling va delegation nima?**
Bubbling — event bosilgan elementdan ota elementlarga ko'tariladi. Delegation — har bir bolaga emas, ota elementga bitta handler qo'yish.

**26. `preventDefault` va `stopPropagation` farqi?**
`preventDefault` brauzerning standart harakatini to'xtatadi (masalan, form submit). `stopPropagation` eventning yuqoriga ko'tarilishini to'xtatadi.

**27. Debounce va throttle farqi?**
Debounce — foydalanuvchi to'xtagandan N ms keyin bir marta ishlaydi (qidiruv inputi). Throttle — N ms ichida ko'pi bilan bir marta ishlaydi (scroll).

**28. localStorage, sessionStorage va cookie farqi?**
localStorage o'chirmaguncha saqlanadi. sessionStorage tab yopilganda o'chadi. Cookie kichik hajmli va har so'rovda serverga yuboriladi. Token uchun eng xavfsizi `HttpOnly` cookie.

**29. Memory leak qachon bo'ladi?**
`setInterval` yoki event listener tozalanmasa, global o'zgaruvchilar ko'payib ketsa. React'da bunga ko'pincha `useEffect` cleanup yozilmagani sabab bo'ladi.

**30. `0.1 + 0.2 === 0.3` nima beradi?**
`false`. Sababi — sonlarning ikkilik tizimdagi aniqligi cheklangan.

---

## TYPESCRIPT

**31. TypeScript nima uchun kerak?**
Xatolar kod yozish paytidayoq ushlanadi, autocomplete ishlaydi, katta loyihada ishlash osonlashadi. Tiplar faqat kompilyatsiya vaqtida mavjud, runtime'da yo'q.

**32. `type` va `interface` farqi?**
Ikkalasi ham ob'ekt shaklini yozadi. Union (`'a' | 'b'`) va tuple faqat `type` bilan yoziladi. `interface`ni `extends` bilan kengaytirish va ikki marta e'lon qilib birlashtirish mumkin.

**33. `any`, `unknown`, `never`, `void` farqi?**
`any` tekshiruvni butunlay o'chiradi (yomon). `unknown` ishlatishdan oldin tekshirishga majbur qiladi (xavfsiz). `void` — funksiya hech narsa qaytarmaydi. `never` — hech qachon bo'lmaydigan qiymat.

**34. Union va intersection nima?**
Union `A | B` — "yoki A, yoki B". Intersection `A & B` — "ham A, ham B".

**35. Type narrowing nima?**
`typeof`, `instanceof`, `in` yoki `===` bilan tekshirib, tipni aniqroq qilish.

**36. Discriminated union nima?**
Har bir variantda umumiy maydon bo'ladi, masalan `status`:
```ts
type State = { status: 'loading' } | { status: 'success'; data: User[] } | { status: 'error'; error: string };
```
`status`ni tekshirganingizda TS qolgan maydonlarni o'zi biladi.

**37. Generics nima?**
Tipni parametr sifatida berish:
```ts
function first<T>(arr: T[]): T | undefined { return arr[0]; }
```

**38. Eng ko'p ishlatiladigan utility type'lar?**
`Partial` (hamma maydon ixtiyoriy), `Required`, `Pick` (faqat tanlanganlar), `Omit` (tanlanganlarsiz), `Record<K, V>`, `ReturnType`, `Readonly`.

**39. `keyof` va `typeof` nima?**
`keyof T` — ob'ekt kalitlarining union'i. `typeof obj` — o'zgaruvchidan tip olish.

**40. `enum` yoki union — qaysi biri yaxshi?**
Ko'pincha `'up' | 'down'` ko'rinishidagi union yaxshi: runtime'da kod yaratmaydi.

**41. React'da event va ref qanday tiplanadi?**
`React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`, `useRef<HTMLInputElement>(null)`, `useState<User | null>(null)`.

**42. `as` va `!` nega xavfli?**
Ular bilan compiler'ga "men bilaman" deysiz. Agar adashsangiz, xato runtime'da chiqadi. Ularning o'rniga tekshiruv (narrowing) yozing.

---

## REACT

**43. React nima? Virtual DOM nima?**
React — UI yasash uchun komponentlarga asoslangan kutubxona. Virtual DOM — DOM'ning JS'dagi nusxasi. State o'zgarganda React yangi va eski nusxani solishtiradi va haqiqiy DOM'ga faqat farqni yozadi.

**44. JSX nima?**
JS ichida HTML'ga o'xshash yozuv, u `React.createElement` chaqiruvlariga aylanadi. `class` o'rniga `className` yoziladi, `{}` ichiga faqat ifoda (expression) qo'yiladi.

**45. Props va state farqi?**
Props otadan keladi va faqat o'qiladi. State komponentning o'zida saqlanadi va `setState` bilan o'zgaradi.

**46. `key` nima uchun kerak? Nega index'ni key qilmaslik kerak?**
`key` React'ga ro'yxatdagi elementlarni farqlashga yordam beradi. Index key bo'lsa, element o'chirilganda yoki tartib o'zgarganda inputlar aralashib ketadi. Unikal `id` ishlating.

**47. Komponent qachon qayta render bo'ladi?**
O'z state'i o'zgarganda, ota komponent render bo'lganda va ishlatayotgan context o'zgarganda.

**48. Controlled va uncontrolled input farqi?**
Controlled'da qiymat state'da turadi (`value` + `onChange`). Uncontrolled'da qiymat DOM'da turadi va `ref` orqali o'qiladi.

**49. Hook qoidalari qanday?**
Hook'larni faqat komponentning eng yuqori qismida chaqiring: `if` yoki `for` ichida emas. Sababi — React hook'larni chaqirilish tartibi bo'yicha eslab qoladi.

**50. `setState` darhol yangilanadimi?**
Yo'q, yangilanishlar guruhlanadi (batching). Oldingi qiymatga tayanib yangilash uchun `setCount(c => c + 1)` ko'rinishini ishlating.

**51. State'dagi ob'ektni qanday o'zgartirish kerak?**
Mutatsiya qilmang. Yangi ob'ekt yarating: `setUser({ ...user, name: 'Ali' })`.

**52. `useEffect` qanday ishlaydi?**
Render tugagandan keyin ishlaydi. `[]` — faqat bir marta. `[id]` — `id` o'zgarganda. Hech narsa berilmasa — har renderda. `return () => {}` — tozalash (cleanup).

**53. Cleanup qachon ishlaydi?**
Komponent yopilganda va effect qayta ishga tushishidan oldin. Unda timer, listener va so'rovlarni tozalang.

**54. Nega development'da effect 2 marta ishlaydi?**
StrictMode cleanup to'g'ri yozilganini tekshirish uchun shunday qiladi. Bu xato emas.

**55. useEffect'da fetch qilishda qanday muammo bor?**
Race condition bo'ladi: eski javob kechikib kelib, yangisini ustidan yozadi. Yechim — `AbortController` bilan eski so'rovni bekor qilish, yoki RTK Query / React Query ishlatish.

**56. Qachon `useEffect` kerak emas?**
Props yoki state'dan hisoblanadigan qiymat uchun — uni oddiy o'zgaruvchi qiling. Tugma bosilganda bajariladigan ish uchun — uni event handler ichida yozing.

**57. `useRef` nima uchun kerak?**
DOM elementga murojaat qilish uchun (`ref.current.focus()`) va qayta render chaqirmasdan qiymat saqlash uchun (masalan, timer id).

**58. `useMemo` va `useCallback` farqi?**
`useMemo` hisoblangan qiymatni eslab qoladi, `useCallback` funksiyani eslab qoladi. Ularni og'ir hisoblarda va `React.memo`dagi bolaga props berishda ishlating. Hamma joyga qo'yish shart emas.

**59. `React.memo` nima?**
Props o'zgarmasa, komponentni qayta render qilmaydi. Lekin props'ga har safar yangi ob'ekt yoki funksiya berilsa, foyda bermaydi.

**60. `useContext` nima? Kamchiligi bormi?**
Props'ni pastga qavatma-qavat uzatmasdan ma'lumot berish (theme, til, user). Kamchiligi: qiymat o'zgarsa, uni ishlatayotgan hamma komponent qayta render bo'ladi.

**61. `useReducer` qachon kerak?**
State murakkab bo'lsa va ko'p turdagi o'zgarishlar bo'lsa — logikani reducer'ga ajratish uchun.

**62. Custom hook nima?**
`use` bilan boshlanadigan va logikani qayta ishlatish uchun yoziladigan funksiya. Misollar: `useDebounce`, `useFetch`, `useLocalStorage`.

**63. `useLayoutEffect` va `useEffect` farqi?**
`useLayoutEffect` ekranga chizilishdan oldin ishlaydi. U element o'lchamini o'lchash kabi holatlar uchun kerak. 99% holatda `useEffect` yetarli.

**64. Props drilling nima? Qanday hal qilinadi?**
Props'ni ko'p qavat orqali uzatish. Yechimlari: `children` orqali composition, Context, Redux/Zustand.

**65. Lifting state up nima?**
Ikki komponentga bir xil state kerak bo'lsa, uni ularning umumiy ota komponentiga ko'chirish.

**66. Error Boundary nima?**
Render paytidagi xatoni ushlab, butun sahifa oq bo'lib qolmasligi uchun zaxira UI ko'rsatadi. U event handler va async koddagi xatolarni ushlamaydi.

**67. Lazy loading qanday qilinadi?**
`const Page = lazy(() => import('./Page'))` va `<Suspense fallback={...}>`. Bunda sahifa kodi faqat kerak bo'lganda yuklanadi.

**68. Portal nima?**
Komponentni DOM'ning boshqa joyiga chizish (`createPortal`). Modal va tooltip uchun ishlatiladi.

**69. Nega komponentni boshqa komponent ichida e'lon qilmaslik kerak?**
Har renderda u yangi komponent hisoblanadi va state yo'qoladi (masalan, input focus'i).

**70. React Router asosiy hook'lari qaysilar?**
`useParams` (URL'dagi `:id`), `useNavigate` (boshqa sahifaga o'tish), `useSearchParams` (`?page=2`), `useLocation`. Protected route — user bo'lmasa `<Navigate to="/login" />`.

**71. CSR, SSR va SSG farqi?**
CSR — brauzer chizadi (Vite+React). SSR — har so'rovda server HTML yaratadi (SEO uchun yaxshi). SSG — HTML build vaqtida yaratiladi. Next.js uchalasini ham qila oladi.

**72. React 18/19'da qanday yangiliklar bor?**
Automatic batching, `useTransition`, `useDeferredValue`, `useId`, Server Components, `use()`, `useOptimistic`, `useActionState`.

---

## REDUX TOOLKIT

**73. Redux nima?**
Global state'ni bitta store'da saqlash vositasi. State faqat `dispatch(action)` orqali, reducer yordamida o'zgaradi.

**74. Redux Toolkit oddiy Redux'dan nimasi bilan yaxshi?**
Boilerplate kam. `createSlice` action va reducer'larni birga yaratadi, Immer bor (to'g'ridan-to'g'ri "o'zgartirish" mumkin), DevTools avtomatik ulanadi.

**75. Slice qanday yoziladi?**
```ts
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem(state, action) { state.items.push(action.payload); },
    removeItem(state, action) { state.items = state.items.filter(i => i.id !== action.payload); },
  },
});
export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;
```

**76. Store qanday ulanadi?**
`configureStore({ reducer: { cart: cartReducer } })`, keyin `<Provider store={store}>`. Komponentda `useSelector` va `useDispatch` ishlatiladi.

**77. Immer qanday ishlaydi? Qanday xato bo'lishi mumkin?**
Siz state'ning nusxasini o'zgartirasiz, Immer esa undan yangi state yasaydi. Xatolar: bir vaqtda ham o'zgartirib, ham `return` qilish; `state = ...` deb yozish (bunday paytda `return` kerak).

**78. `createAsyncThunk` nima?**
API so'rovi uchun ishlatiladi. U avtomatik `pending`, `fulfilled` va `rejected` action'larini yaratadi, ular `extraReducers`da ushlanadi. Natijani olish: `dispatch(thunk()).unwrap()`.

**79. `reducers` va `extraReducers` farqi?**
`reducers` — slice'ning o'z action'lari uchun. `extraReducers` — tashqi action'lar (thunk'lar, boshqa slice'lar) uchun.

**80. Selector va `createSelector` nima?**
Selector state'dan kerakli qismni oladi. `createSelector` natijani eslab qoladi. Har safar yangi massiv qaytaradigan selector (`filter`) ortiqcha render'larga sabab bo'ladi.

**81. Middleware nima?**
Dispatch va reducer orasidagi qatlam. Masalan logging yoki thunk (async).

**82. RTK Query nima?**
API so'rovlari uchun tayyor vosita. Loading, error, kesh va qayta yuklashni o'zi boshqaradi. `useGetProductsQuery()` → `{ data, isLoading, isError }`. Mutation'dan keyin `invalidatesTags` ro'yxatni avtomatik yangilaydi.

**83. Server state va client state farqi?**
Server state — API'dan keladigan ma'lumot, uni RTK Query / React Query boshqaradi. Client state — savat, filtr, theme kabilar, ular slice'da yoki `useState`da turadi.

**84. Normalizatsiya va `createEntityAdapter` nima?**
Ro'yxatni `{ ids: [], entities: {} }` ko'rinishida saqlash. Bunda id bo'yicha qidirish tez bo'ladi va dublikat bo'lmaydi.

**85. Redux, Context va Zustand — qachon qaysi biri?**
Context — kam o'zgaradigan ma'lumot (theme, til). Zustand — kichik/o'rta loyiha. Redux Toolkit — katta loyiha va katta jamoa.

**86. Nega reducer'da API so'rovi yoki `Math.random` ishlatmaslik kerak?**
Reducer pure bo'lishi kerak. Random id'ni `prepare` ichida yoki komponentda yarating.

**87. Optimistic update nima?**
Serverdan javob kelishini kutmasdan UI'ni darhol yangilash, xato bo'lsa — eski holatga qaytarish (masalan, like tugmasi).

---

## QO'SHIMCHA (HTML, CSS, brauzer, tarmoq, Git, test)

**88. Semantik HTML nima?**
Ma'noli teglar: `header`, `nav`, `main`, `button`. Ular SEO va accessibility uchun foydali. Bosiladigan narsaga `div` emas, `button` ishlating.

**89. Box model va `border-box` nima?**
Element = content + padding + border + margin. `border-box` bo'lsa, `width` padding va border'ni ham o'z ichiga oladi.

**90. Flex va Grid farqi?**
Flex bir yo'nalishda ishlaydi (qator yoki ustun). Grid ikki yo'nalishda ishlaydi (jadval kabi).

**91. `position` qiymatlari qanday?**
`relative` — o'z joyiga nisbatan. `absolute` — positioned otaga nisbatan. `fixed` — ekranga nisbatan. `sticky` — scroll'da yopishib qoladi.

**92. Brauzerga URL yozilganda nima bo'ladi?**
DNS → server bilan ulanish → HTML keladi → DOM va CSSOM quriladi → layout → paint → ekranga chiqadi.

**93. `defer` va `async` farqi?**
`defer` — skript HTML o'qib bo'lingandan keyin tartib bilan ishlaydi. `async` — yuklanishi bilan darhol ishlaydi.

**94. Saytni qanday tezlashtirasiz?**
Lazy loading, rasmlarni siqish (WebP), katta ro'yxatni virtualizatsiya qilish, keraksiz render'larni kamaytirish, debounce, bundle'ni kichraytirish.

**95. HTTP metodlar va status kodlar?**
GET — olish, POST — yaratish, PUT/PATCH — yangilash, DELETE — o'chirish. Kodlar: 200 OK, 201 yaratildi, 400 noto'g'ri so'rov, 401 login qilinmagan, 403 ruxsat yo'q, 404 topilmadi, 500 server xatosi.

**96. CORS nima?**
Brauzer boshqa domenga yuborilgan so'rovni, server ruxsat bermasa, bloklaydi. U server tomonida hal qilinadi. Development'da proxy ishlatiladi.

**97. Access va refresh token nima?**
Access token qisqa muddatli bo'ladi va har so'rovda yuboriladi. U eskirsa (401), refresh token bilan yangisi olinadi va so'rov qayta yuboriladi (axios interceptor orqali).

**98. XSS nima? React undan himoya qiladimi?**
XSS — sahifaga zararli skript kiritish. React matnni avtomatik escape qiladi, lekin `dangerouslySetInnerHTML` xavfli.

**99. Axios va fetch farqi?**
Axios JSON'ni avtomatik o'giradi, 4xx/5xx'da xato beradi va interceptor'lari bor. `fetch` brauzerga o'rnatilgan, lekin `res.ok`ni qo'lda tekshirish kerak.

**100. Git'da `merge` va `rebase` farqi?**
`merge` tarixni saqlab, merge commit yaratadi. `rebase` tarixni chiziqli qiladi. Push qilingan umumiy branch'ni rebase qilmang.

**101. `reset` va `revert` farqi?**
`reset` tarixni o'chiradi. `revert` o'zgarishni bekor qiladigan yangi commit yaratadi (push qilingan kod uchun xavfsiz).

**102. Merge conflict qanday hal qilinadi?**
`<<<<<<<` va `>>>>>>>` belgilari orasidagi ikkala variantni ko'rib, to'g'risini qoldirasiz, test qilasiz va commit qilasiz.

**103. Qanday test turlari bor?**
Unit (Jest/Vitest), integration (React Testing Library), E2E (Playwright/Cypress).

**104. Vite va Webpack farqi?**
Vite development rejimida juda tez ishga tushadi. Webpack eskiroq, sekinroq, lekin juda moslashuvchan.

**105. `.env`dagi kalitlar xavfsizmi?**
Frontend'da yo'q — ular bundle'ga tushadi. Maxfiy kalitni frontend'ga qo'ymang.

---

## PROJECTDA UCHRAYDIGAN MUAMMOLAR VA YECHIMLARI

**106. Sahifa sekin, input yozganda qotadi.**
Sabab — keraksiz re-render. React DevTools Profiler bilan topiladi. Yechim: state'ni pastroq komponentga tushirish, `React.memo` + `useCallback`, `createSelector`, katta ro'yxat uchun `react-window`.

**107. `useEffect` cheksiz ishlayapti.**
Sabab — dependency'da har renderda yangi yaratiladigan ob'ekt yoki funksiya bor, yoki dependency array umuman yo'q. Yechim: dependency'ga primitiv qiymatlarni qo'yish yoki `useMemo`.

**108. Qidiruvda eski natija chiqib qolyapti.**
Sabab — race condition. Yechim: debounce + `AbortController`, yoki RTK Query.

**109. "Can't update state on unmounted component" xatosi chiqyapti.**
Sabab — cleanup yo'q. Yechim: `useEffect`da `clearInterval`, `removeEventListener`, `abort()` qilish.

**110. Token eskirsa foydalanuvchi tizimdan chiqib ketyapti.**
Yechim: axios interceptor 401 kodini ushlab, refresh qiladi va so'rovni qayta yuboradi. Bir vaqtda kelgan 401'lar uchun refresh faqat bir marta qilinadi.

**111. Har bir ma'lumot yuklanadigan joyda qaysi holatlar bo'lishi kerak?**
4 ta holat: loading (skeleton), error (qayta urinish tugmasi bilan), empty (bo'sh ro'yxat), success.

**112. Katta forma sekin ishlayapti va validatsiya qiyin.**
Yechim: React Hook Form + Zod. Submit paytida tugmani `disabled` qiling.

**113. 10 000 ta qatorli ro'yxatni qanday ko'rsatish kerak?**
Server-side pagination yoki infinite scroll + virtualizatsiya. Filtr va sahifa raqamini URL'da saqlang.

**114. Birinchi yuklanish sekin.**
Yechim: sahifalarni `lazy()` bilan bo'lish, og'ir kutubxonalarni dinamik import qilish, rasmlarni optimizatsiya qilish.

**115. Sayt prod'da refresh qilinganda 404 beradi.**
SPA routing muammosi. Serverda barcha yo'llarni `index.html`ga yo'naltiring (Vercel'da `rewrites`).

**116. Bir xil ma'lumot ikki joyda saqlanib, bir-biriga mos kelmay qolyapti.**
Ma'lumot bitta joyda saqlansin. Hisoblanadigan qiymatni saqlamang, uni hisoblang.

**117. Papka strukturasi tartibsiz.**
Feature-based tuzilma ishlating: `features/auth`, `features/cart`, `shared/ui`, `app/store`. FSD'ni ham o'rganing.

**118. Production'dagi xatolarni bilmayapmiz.**
Yechim: Sentry + Error Boundary.

**119. "Qanday qiyin muammoni hal qilgansiz?" savoliga qanday javob berish kerak?**
STAR usulida: **vaziyat** → **vazifa** → **nima qildingiz** (texnik tafsilotlar bilan) → **natija** (raqam bilan bo'lsa yaxshi). Misol: "Mahsulotlar sahifasi qotardi. Profiler bilan sababini topdim, debounce, memo va virtualizatsiya qo'shdim. Lighthouse 58 dan 91 ga chiqdi."

---

## LIVE-CODING (eng ko'p so'raladiganlari)

**120. Debounce yozing.**
```js
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
```

**121. Throttle yozing.**
```js
function throttle(fn, ms) {
  let last = 0;
  return (...args) => { const now = Date.now(); if (now - last >= ms) { last = now; fn(...args); } };
}
```

**122. Massivni tekislang (flatten).**
```js
const flatten = arr => arr.reduce((a, x) => a.concat(Array.isArray(x) ? flatten(x) : x), []);
```

**123. Dublikatlarni olib tashlang.**
`[...new Set(arr)]`

**124. Two Sum masalasi.**
```js
function twoSum(nums, target) {
  const m = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (m.has(target - nums[i])) return [m.get(target - nums[i]), i];
    m.set(nums[i], i);
  }
}
```

**125. Palindromni tekshiring.**
`const isPal = s => s === [...s].reverse().join('');`

**126. `useDebounce` hook'ini yozing.**
```jsx
function useDebounce(value, ms = 500) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}
```

**127. `useFetch` hook'ini yozing.**
```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const c = new AbortController();
    setLoading(true);
    fetch(url, { signal: c.signal })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(setData)
      .catch(e => e.name !== 'AbortError' && setError(e))
      .finally(() => setLoading(false));
    return () => c.abort();
  }, [url]);
  return { data, loading, error };
}
```

**128. Todo list (qo'shish, belgilash, o'chirish) yozing.**
```jsx
const [todos, setTodos] = useState([]);
const add = text => setTodos(p => [...p, { id: Date.now(), text, done: false }]);
const toggle = id => setTodos(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t));
const remove = id => setTodos(p => p.filter(t => t.id !== id));
```

**129. Bu kodda nima xato?**
```jsx
useEffect(() => { setFiltered(users.filter(u => u.name.includes(q))); });
return filtered.map((u, i) => <div key={i} onClick={() => u.active = true}>{u.name}</div>);
```
Xatolar: dependency array yo'q (cheksiz sikl), `filtered` alohida state bo'lmasligi kerak (uni `useMemo` bilan hisoblang), `key={i}` ishlatilgan, props mutatsiya qilingan.

---

## JUNIOR'DAN MIDDLE'GA CHIQISH — TAVSIYALAR

**130. Middle Junior'dan nimasi bilan farq qiladi?**
Mustaqil ishlaydi, noaniq vazifani o'zi aniqlashtiradi, "qanday"ni emas, "nega"ni biladi, toza va test qilinadigan kod yozadi, xatoni tez topadi, juniorlarga yordam beradi.

**131. Qaysi tartibda o'rganish kerak?**
1. JS'ni chuqur o'rganing: closure, this, event loop, promise. Manba: javascript.info.
2. TypeScript'ni `strict` rejimda o'rganing.
3. React'ni chuqur o'rganing: react.dev, ayniqsa "You Might Not Need an Effect" bo'limi.
4. Redux Toolkit + RTK Query (yoki React Query).
5. React Hook Form + Zod, React Router.
6. Next.js — bozorda talab katta.
7. Testing: Vitest + React Testing Library.
8. Performance: Profiler, Lighthouse, lazy loading.
9. Git, CI/CD (GitHub Actions), Vercel'ga deploy.
10. Algoritmlar: LeetCode'dagi 50–100 ta Easy/Medium masala.

**132. Portfolio uchun qanday loyiha qilish kerak?**
Bitta katta loyiha (e-commerce yoki admin panel) yetarli. Unda bo'lishi kerak: login va token, CRUD, pagination, filtr va qidiruv, RTK Query, formalar, savat, dark mode, responsive dizayn, testlar, deploy va yaxshi README. Hozirgi quiz loyihangizni ham TypeScript + RTK'ga o'tkazib, testlar qo'shib yaxshilashingiz mumkin.

**133. Har kuni nima qilish kerak?**
1–2 soat amaliyot qiling, rasmiy hujjatlarni o'qing, boshqalarning kodini o'qing, har bir yechim uchun "nega?" deb so'rang, ingliz tilini o'rganing. AI yozgan kodni tushunmasdan ko'chirmang.

**134. Suhbatda o'zingizni qanday tutish kerak?**
- Javob tartibi: qisqa ta'rif → misol → qachon ishlatiladi.
- Bilmasangiz: "Aniq bilmayman, lekin menimcha…" deb mantiqan fikr yuriting.
- Live-coding'da ovoz chiqarib fikrlang, avval oddiy yechimni yozing, keyin uni yaxshilang.
- O'z projectingizdan misollar keltiring.

**135. "O'zingiz haqingizda gapiring" savoliga qanday javob berish kerak?**
"Men X yildan beri frontend dasturchiman. Stack'im — React, TypeScript, Redux Toolkit. Oxirgi loyihamda [nima qildim]. Eng qiziq muammo — [qisqa hikoya]. Hozir [testing / Next.js]ni o'rganyapman."

**136. Oxirida intervyuerga qanday savollar berish kerak?**
Jamoa qanday tuzilgan? Code review va testlar bormi? Birinchi 3 oyda mendan nima kutiladi? O'sish uchun qanday imkoniyatlar bor?

**137. Eng muhim maslahat nima?**
Suhbatdan o'ta olmaslik — normal holat. Har suhbatdan keyin javob bera olmagan savollaringizni yozib oling va o'sha kuni o'rganing. 5–10 ta suhbatdan keyin savollar takrorlana boshlaydi.
