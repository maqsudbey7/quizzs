# 4. Redux va Redux Toolkit — savol va javoblar

---

### 🟢 1. Redux nima va nima uchun kerak?

Redux — **global state**'ni bitta markaziy joyda (store) saqlash va uni **oldindan bashorat qilinadigan** tarzda o'zgartirish uchun kutubxona.

**3 tamoyil:**
1. **Single source of truth** — butun ilova state'i bitta store'da.
2. **State read-only** — faqat `action` dispatch qilish orqali o'zgaradi.
3. **O'zgarishlar pure funksiyalar (reducer) orqali** — `(state, action) => newState`.

**Data flow:** UI → `dispatch(action)` → `reducer` → yangi state → `useSelector` orqali UI yangilanadi.

---

### 🟢 2. Redux Toolkit (RTK) nima? Oddiy Redux'dan farqi?

RTK — Redux'ning **rasmiy, tavsiya etilgan** yozish usuli. Oddiy Redux'dagi boilerplate (action type konstantalar, action creator'lar, switch-case, qo'lda immutable update) muammolarini hal qiladi.

- `configureStore` — store'ni Redux DevTools va thunk middleware bilan avtomatik sozlaydi, development'da mutatsiya va serializatsiya tekshiruvlari.
- `createSlice` — reducer + action'larni birga yaratadi.
- **Immer** ichkarida — "mutatsiya" ko'rinishidagi kod yozasiz, aslida immutable update bo'ladi.
- `createAsyncThunk` — asinxron so'rovlar uchun.
- `createEntityAdapter` — normalizatsiyalangan ro'yxatlar.
- **RTK Query** — data fetching va caching.

---

### 🟢 3. Store sozlash va slice yozish

```ts
// features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem { id: number; title: string; price: number; qty: number }
interface CartState { items: CartItem[] }

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, 'qty'>>) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) existing.qty++;              // Immer tufayli "mutatsiya" xavfsiz
      else state.items.push({ ...action.payload, qty: 1 });
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clear: () => initialState,
  },
});

export const { addItem, removeItem, clear } = cartSlice.actions;
export default cartSlice.reducer;
```

```ts
// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: { cart: cartReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// app/hooks.ts — tiplangan hook'lar
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

```tsx
// main.tsx
<Provider store={store}><App /></Provider>
```

---

### 🟡 4. Immer qanday ishlaydi? Qanday xato qilish mumkin?

Immer `state`ning **Proxy** nusxasini (draft) beradi. Siz draft'ni o'zgartirasiz, Immer o'zgarishlarni kuzatib, **yangi immutable state** yaratadi (o'zgarmagan qismlar havolasi saqlanadi — structural sharing).

**Xato:** draft'ni o'zgartirish **va** bir vaqtda yangi qiymat qaytarish mumkin emas:
```ts
addTodo(state, action) {
  state.push(action.payload);
  return state;          // ❌ yoki mutatsiya, yoki return — ikkalasi emas
}
// ✅ yoki:
addTodo(state, action) { state.push(action.payload); }
// ✅ yoki:
addTodo(state, action) { return [...state, action.payload]; }
```
Yana: `state = newValue` — ishlamaydi (faqat lokal o'zgaruvchi qayta tayinlanadi). `return newValue` qiling.

---

### 🟡 5. `createAsyncThunk` qanday ishlaydi?

```ts
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: { page: number }, { rejectWithValue, signal }) => {
    try {
      const res = await api.get('/products', { params, signal });
      return res.data as Product[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Xatolik');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: { list: [] as Product[], status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed', error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,   (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload; })
      .addCase(fetchProducts.rejected,  (s, a) => { s.status = 'failed'; s.error = (a.payload as string) ?? a.error.message ?? null; });
  },
});
```
Thunk avtomatik 3 ta action yaratadi: `pending`, `fulfilled`, `rejected`.

Komponentda natijani kutish:
```ts
try {
  const data = await dispatch(fetchProducts({ page: 1 })).unwrap();
} catch (e) { toast.error(String(e)); }
```

**`reducers` vs `extraReducers`:** `reducers` — slice'ning **o'z** action'lari (avtomatik yaratiladi). `extraReducers` — **tashqi** action'larga javob (thunk'lar, boshqa slice action'lari).

---

### 🟡 6. Middleware nima?

Middleware — `dispatch` bilan reducer orasida turadigan qatlam: logging, asinxron logika (thunk), analytics, xatolarni ushlash.

```ts
const logger: Middleware = store => next => action => {
  console.log('dispatch', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

configureStore({
  reducer,
  middleware: (getDefault) => getDefault().concat(logger),
});
```
**Thunk** — action o'rniga **funksiya** dispatch qilish imkonini beradigan middleware.

---

### 🟡 7. Selector'lar va `createSelector` (memoizatsiya)

```ts
// Oddiy selector
export const selectCartItems = (s: RootState) => s.cart.items;

// Memoizatsiyalangan (reselect)
import { createSelector } from '@reduxjs/toolkit';
export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, i) => sum + i.price * i.qty, 0)
);
```

🔴 **Muhim muammo:** `useSelector` har action'dan keyin selector'ni ishga tushiradi va natijani `===` bilan solishtiradi. Agar selector har safar **yangi massiv/ob'ekt** qaytarsa — komponent **har bir dispatch'da** qayta render bo'ladi:
```ts
// ❌ filter har safar yangi massiv qaytaradi
const done = useSelector(s => s.todos.filter(t => t.done));
// ✅
const selectDone = createSelector([selectTodos], todos => todos.filter(t => t.done));
const done = useSelector(selectDone);
```

---

### 🟡 8. State normalizatsiyasi va `createEntityAdapter`

Nested/dublikat ma'lumot o'rniga — ma'lumotlar bazasidagi kabi `{ ids: [], entities: {} }`:

```ts
const usersAdapter = createEntityAdapter<User>();
const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({ status: 'idle' }),
  reducers: {
    userAdded: usersAdapter.addOne,
    userUpdated: usersAdapter.updateOne,  // { id, changes }
    usersReceived: usersAdapter.setAll,
  },
});
export const { selectAll, selectById } = usersAdapter.getSelectors((s: RootState) => s.users);
```
Foyda: id bo'yicha O(1) qidirish, bitta ma'lumotni bitta joyda yangilash, dublikat yo'q.

---

### 🟡 9. RTK Query nima? Thunk'dan nimasi yaxshi?

RTK Query — server ma'lumotlarini olish va **keshlash** uchun. `loading/error/data` state'larini, keshni, qayta so'rovni, dublikat so'rovlarni birlashtirishni avtomatik qiladi.

```ts
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Product'],
  endpoints: (b) => ({
    getProducts: b.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Product'],
    }),
    addProduct: b.mutation<Product, Partial<Product>>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Product'],      // qo'shilgandan keyin ro'yxat avtomatik qayta yuklanadi
    }),
  }),
});
export const { useGetProductsQuery, useAddProductMutation } = api;

// store
configureStore({
  reducer: { [api.reducerPath]: api.reducer, cart: cartReducer },
  middleware: (gDM) => gDM().concat(api.middleware),
});

// komponent
const { data, isLoading, isError, refetch } = useGetProductsQuery();
const [addProduct, { isLoading: adding }] = useAddProductMutation();
```

**Qoida:** *Server state* (API'dan keladigan) → RTK Query / TanStack Query. *Client state* (UI holati, savat, filtr, theme) → slice.

---

### 🟡 10. Optimistic update qanday qilinadi?

Serverdan javob kutmasdan UI'ni darhol yangilash, xato bo'lsa — qaytarish:
```ts
toggleLike: b.mutation<void, { id: number }>({
  query: ({ id }) => ({ url: `/posts/${id}/like`, method: 'POST' }),
  async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
    const patch = dispatch(api.util.updateQueryData('getPosts', undefined, (draft) => {
      const p = draft.find(x => x.id === id);
      if (p) p.liked = !p.liked;
    }));
    try { await queryFulfilled; } catch { patch.undo(); }
  },
}),
```

---

### 🟡 11. Redux vs Context vs Zustand — qachon qaysi?

| | Context | Redux Toolkit | Zustand |
|---|---|---|---|
| Maqsad | Ma'lumot uzatish (DI) | Murakkab global state | Yengil global state |
| Re-render nazorati | Zaif (hamma consumer) | Yaxshi (selector) | Yaxshi (selector) |
| DevTools / time-travel | Yo'q | ✅ | Plagin orqali |
| Boilerplate | Kam | O'rtacha | Juda kam |
| Qachon | theme, til, auth user | Katta jamoa, murakkab biznes logika | Kichik/o'rta loyiha |

Suhbatda javob: "Hammasi uchun Redux kerak emas. Lokal state → `useState`. Server ma'lumotlari → RTK Query/React Query. Haqiqiy global client state → RTK yoki Zustand."

---

### 🟡 12. Redux Persist / state'ni saqlash?

`redux-persist` — store'ni `localStorage`ga saqlaydi va qayta yuklaydi. `whitelist` bilan faqat kerakli slice'larni (masalan `cart`, `auth`) saqlang. RTK bilan ishlatganda serializable check'dan `persist/PERSIST` kabi action'larni chiqarib tashlash kerak.

---

### 🟡 13. Nega reducer'da side effect (API, `Math.random`, `Date.now`) qilmaslik kerak?

Reducer **pure** bo'lishi shart — bir xil state+action → doim bir xil natija. Aks holda: time-travel debugging buziladi, test qilish qiyinlashadi, bashorat qilib bo'lmaydi. Random id kerak bo'lsa — `prepare` callback'da yarating:

```ts
addTodo: {
  reducer(state, action: PayloadAction<Todo>) { state.push(action.payload); },
  prepare(text: string) { return { payload: { id: nanoid(), text, done: false } }; },
},
```

---

### 🟡 14. Non-serializable qiymat ogohlantirishi nima?

Store'ga `Date`, `Map`, `Set`, `Promise`, class instance, funksiya qo'ymang — DevTools, persist va time-travel buziladi. `Date` o'rniga ISO string yoki timestamp saqlang.

---

### 🟡 15. `createListenerMiddleware` nima?

Saga/observable'ning yengil alternativasi — ma'lum action'dan keyin side effect bajarish:
```ts
const listener = createListenerMiddleware();
listener.startListening({
  actionCreator: logout,
  effect: async (_, api) => { localStorage.clear(); api.dispatch(cartSlice.actions.clear()); },
});
```
