# 2. TypeScript — savol va javoblar

---

### 🟢 1. TypeScript nima va nima uchun kerak?

TypeScript — JavaScript'ning **statik tiplangan** superset'i. Kod JS'ga kompilyatsiya qilinadi; tiplar faqat **kompilyatsiya vaqtida** mavjud (runtime'da yo'q).

**Foydasi:**
- Xatolar runtime'da emas, kod yozish paytida ushlanadi (`undefined is not a function` kamayadi).
- IDE autocomplete, refactoring (nomini o'zgartirish butun loyihada xavfsiz).
- Kod o'z-o'zini hujjatlaydi — API qaytaradigan ma'lumot shakli aniq.
- Katta jamoada ishlash osonlashadi.

---

### 🟢 2. `type` va `interface` farqi?

```ts
interface User { id: number; name: string }
interface Admin extends User { role: 'admin' }

type Product = { id: number; title: string };
type ID = string | number;                // ✅ faqat type bilan
type Point = [number, number];            // ✅ tuple — faqat type
```

| | `interface` | `type` |
|---|---|---|
| Ob'ekt shakli | ✅ | ✅ |
| Union / intersection / primitiv alias | ❌ | ✅ |
| Declaration merging (ikki marta e'lon qilib birlashtirish) | ✅ | ❌ |
| Kengaytirish | `extends` | `&` (intersection) |

**Amaliy qoida:** ob'ekt/komponent props uchun ikkalasi ham bo'ladi — jamoadagi kelishuvga amal qiling. Union, mapped, conditional tiplar uchun `type`.

---

### 🟢 3. `any`, `unknown`, `never`, `void` farqi?

- `any` — tip tekshiruvini **o'chiradi**. Imkon qadar ishlatmang.
- `unknown` — "nima ekanini bilmayman", lekin ishlatishdan oldin **tekshirishga majbur qiladi**. `any`ning xavfsiz versiyasi.
- `void` — funksiya hech narsa qaytarmaydi.
- `never` — hech qachon sodir bo'lmaydigan qiymat (doim `throw` qiladigan funksiya, cheksiz sikl, exhaustive check).

```ts
function parse(json: string): unknown { return JSON.parse(json); }
const data = parse('{"a":1}');
data.a;                          // ❌ xato
if (typeof data === 'object' && data && 'a' in data) { /* ✅ */ }

try { ... } catch (e: unknown) {
  if (e instanceof Error) console.log(e.message);
}
```

---

### 🟡 4. Union va intersection?

```ts
type Status = 'idle' | 'loading' | 'success' | 'error'; // union (literal types)
type WithTimestamps = { createdAt: Date } & { updatedAt: Date }; // intersection
```

---

### 🟡 5. Type narrowing nima?

Union tipni tekshiruvlar orqali aniqroq tipga "toraytirish":

```ts
function format(v: string | number | Date) {
  if (typeof v === 'string') return v.toUpperCase();
  if (typeof v === 'number') return v.toFixed(2);
  return v.toISOString();               // bu yerda v: Date
}
```
Usullar: `typeof`, `instanceof`, `in`, equality (`===`), truthiness, **discriminated union**, **type guard**.

---

### 🟡 6. Discriminated union nima? Nega foydali?

Har bir variantda umumiy "teg" maydon (`type`, `status`, `kind`) bo'ladi:

```ts
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function render(s: RequestState<User[]>) {
  switch (s.status) {
    case 'success': return s.data.length;   // data faqat shu yerda mavjud
    case 'error':   return s.error;
    case 'loading': return 'Yuklanmoqda…';
    case 'idle':    return null;
    default: {
      const _exhaustive: never = s;         // yangi status qo'shilsa — compile xato
      return _exhaustive;
    }
  }
}
```
Bu `isLoading`, `isError`, `data` kabi alohida flag'lar bilan "imkonsiz holatlar" (loading=true va error bor) paydo bo'lishining oldini oladi.

---

### 🟡 7. Type guard (user-defined) qanday yoziladi?

```ts
interface Cat { meow(): void }
interface Dog { bark(): void }

function isCat(a: Cat | Dog): a is Cat {
  return 'meow' in a;
}
```

---

### 🟡 8. Generics nima? Misol.

Generics — tipni **parametr** sifatida berish; qayta ishlatiladigan, lekin tip-xavfsiz kod.

```ts
function first<T>(arr: T[]): T | undefined { return arr[0]; }
first([1, 2]);        // number | undefined
first(['a']);         // string | undefined

// Cheklov (constraint)
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
getProp({ name: 'Ali', age: 20 }, 'age');   // number
getProp({ name: 'Ali' }, 'foo');            // ❌ xato

// API javobi uchun
interface ApiResponse<T> { data: T; total: number; page: number }
async function api<T>(url: string): Promise<T> {
  const r = await fetch(url);
  return r.json() as Promise<T>;
}
const users = await api<ApiResponse<User[]>>('/users');
```

React'da generic komponent:
```tsx
type ListProps<T> = { items: T[]; render: (item: T) => React.ReactNode; getKey: (item: T) => string };
function List<T>({ items, render, getKey }: ListProps<T>) {
  return <ul>{items.map(i => <li key={getKey(i)}>{render(i)}</li>)}</ul>;
}
```

---

### 🟡 9. Utility type'lar — eng ko'p ishlatiladiganlari?

```ts
interface User { id: number; name: string; email: string; password: string }

Partial<User>              // hamma maydon ixtiyoriy — update formalar uchun
Required<User>             // hamma maydon majburiy
Readonly<User>             // o'zgartirib bo'lmaydi
Pick<User, 'id' | 'name'>  // faqat tanlanganlar
Omit<User, 'password'>     // tanlanganlarsiz — public user
Record<string, number>     // { [key: string]: number }
Record<Status, string>     // har bir status uchun matn — biror holat unutilsa xato
Exclude<'a'|'b'|'c', 'a'>  // 'b' | 'c'
Extract<'a'|'b', 'a'|'z'>  // 'a'
NonNullable<string | null> // string
ReturnType<typeof fn>      // funksiya qaytaradigan tip
Parameters<typeof fn>      // argumentlar tuple'i
Awaited<Promise<User>>     // User
```

---

### 🟡 10. `keyof`, `typeof`, indexed access?

```ts
const config = { api: 'https://...', timeout: 5000 };
type Config = typeof config;         // { api: string; timeout: number }
type ConfigKey = keyof Config;       // 'api' | 'timeout'
type Timeout = Config['timeout'];    // number

const ROLES = ['admin', 'user', 'guest'] as const;
type Role = typeof ROLES[number];    // 'admin' | 'user' | 'guest'
```

---

### 🔴 11. Mapped va conditional types?

```ts
// Mapped
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };

// Conditional
type IsString<T> = T extends string ? true : false;
type ElementType<T> = T extends (infer U)[] ? U : T;   // infer — tipni "ajratib olish"
ElementType<number[]>; // number
```

---

### 🟢 12. `enum` vs union literal?

```ts
enum Direction { Up, Down }                 // runtime'da ob'ekt yaratadi
type Direction2 = 'up' | 'down';            // runtime'da hech narsa yo'q
const Direction3 = { Up: 'up', Down: 'down' } as const;
type Direction3 = typeof Direction3[keyof typeof Direction3];
```
Zamonaviy loyihalarda ko'pincha **union literal** yoki **`as const` ob'ekt** afzal ko'riladi (bundle kichikroq, tree-shaking yaxshi).

---

### 🟡 13. `as` (type assertion) va `!` (non-null assertion) xavfi?

`as` va `!` — compiler'ga "men bilaman" deyish. Agar noto'g'ri bo'lsangiz — runtime xato. Iloji boricha narrowing ishlating.
```ts
const el = document.getElementById('root')!;   // agar yo'q bo'lsa — crash
const el2 = document.getElementById('root');
if (!el2) throw new Error('root topilmadi');   // ✅ aniqroq
```

`satisfies` (TS 4.9+) — tipni tekshiradi, lekin aniq (literal) tipni saqlab qoladi:
```ts
const routes = { home: '/', about: '/about' } satisfies Record<string, string>;
routes.home; // tip: string, lekin noto'g'ri kalit yozilsa xato
```

---

### 🟡 14. React + TypeScript: amaliy savollar

```tsx
// Props
type ButtonProps = {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>; // native atributlar (onClick, disabled...)

// Event'lar
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();

// State
const [user, setUser] = useState<User | null>(null);

// Ref
const inputRef = useRef<HTMLInputElement>(null);

// Custom hook qaytaradigan tuple
function useToggle(init = false) {
  const [v, set] = useState(init);
  const toggle = () => set(x => !x);
  return [v, toggle] as const;   // (boolean | () => void)[] emas, [boolean, () => void]
}
```

`React.FC` ishlatish shartmi? — Yo'q. Hozir ko'pchilik oddiy funksiya + props tipini afzal ko'radi.

---

### 🟢 15. `tsconfig.json`da muhim sozlamalar?

- `"strict": true` — **albatta yoqing** (`strictNullChecks`, `noImplicitAny` va boshqalar).
- `"noUncheckedIndexedAccess": true` — `arr[0]` tipi `T | undefined` bo'ladi.
- `"paths"` — `@/components/...` kabi alias'lar.
- `"target"`, `"module"`, `"jsx"`, `"lib"`.
