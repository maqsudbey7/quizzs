# 1. JavaScript — savol va javoblar

> Belgilar: 🟢 Junior darajasi · 🟡 Middle darajasi · 🔴 Qiyinroq / tez-tez "chalg'ituvchi" savol

---

## 1.1 Asoslar

### 🟢 1. `var`, `let`, `const` farqi nima?

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | function scope | block scope `{}` | block scope |
| Hoisting | ko'tariladi, qiymati `undefined` | ko'tariladi, lekin **TDZ** (Temporal Dead Zone) | TDZ |
| Qayta e'lon | mumkin | mumkin emas | mumkin emas |
| Qayta qiymat berish | mumkin | mumkin | mumkin emas |

```js
console.log(a); // undefined
var a = 1;

console.log(b); // ReferenceError: Cannot access 'b' before initialization (TDZ)
let b = 2;

const obj = { x: 1 };
obj.x = 2;      // ✅ mumkin — const faqat "bog'lanish"ni qotiradi, ob'ekt ichini emas
obj = {};       // ❌ TypeError
```

**Qo'shimcha:** `var` bilan `for` ichida `setTimeout` klassik muammo:
```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3 3 3
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 0 1 2
```
`let` har iteratsiya uchun yangi binding yaratadi.

---

### 🟢 2. JS'da qanday ma'lumot tiplari bor?

**Primitivlar (7 ta):** `string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`.
**Reference tip:** `object` (array, function, Date, Map, Set ham object).

- Primitivlar **qiymat bo'yicha** (by value) nusxalanadi.
- Object'lar **havola bo'yicha** (by reference) nusxalanadi.

```js
let a = { n: 1 };
let b = a;
b.n = 2;
console.log(a.n); // 2 — bitta ob'ektga ikkita havola
```

`typeof null === "object"` — bu tilning tarixiy xatosi.
`typeof function(){} === "function"`.
Array'ni tekshirish: `Array.isArray(x)`.

---

### 🟢 3. `==` va `===` farqi?

- `===` — tip va qiymatni tekshiradi, **tip o'zgartirmaydi** (strict).
- `==` — avval tiplarni bir-biriga keltiradi (type coercion).

```js
0 == ''          // true
0 == '0'         // true
'' == '0'        // false  (!)
null == undefined // true
null === undefined // false
NaN === NaN      // false → Number.isNaN(x) yoki Object.is(NaN, NaN)
```
Amaliyotda doim `===` ishlating. Yagona istisno: `x == null` — `null` va `undefined`ni birdaniga tekshirish.

---

### 🟢 4. `null` va `undefined` farqi?

- `undefined` — qiymat **berilmagan** (o'zgaruvchi e'lon qilingan, lekin qiymat yo'q; funksiya hech narsa qaytarmagan; ob'ektda bunday property yo'q).
- `null` — dasturchi **ataylab** "bo'sh" deb qo'ygan qiymat.

---

### 🟢 5. Truthy / falsy qiymatlar?

Falsy (8 ta): `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Qolgan hamma narsa truthy (`[]`, `{}`, `"0"`, `"false"` ham truthy!).

React'dagi klassik xato:
```jsx
{items.length && <List />}  // items bo'sh bo'lsa ekranga "0" chiqadi!
{items.length > 0 && <List />} // ✅
```

---

### 🟢 6. `??` va `||` farqi? `?.` nima?

- `a || b` — `a` **falsy** bo'lsa `b`.
- `a ?? b` — `a` faqat `null`/`undefined` bo'lsa `b`.
- `a?.b?.c` — optional chaining, oraliqda `null/undefined` bo'lsa xato bermay `undefined` qaytaradi.

```js
const count = 0;
count || 10  // 10  ❌ (0 to'g'ri qiymat edi)
count ?? 10  // 0   ✅
user?.address?.city
user.getName?.()
```

---

## 1.2 Funksiyalar, scope, closure

### 🟢 7. Hoisting nima?

Kod bajarilishidan oldin JS engine e'lonlarni (declaration) xotiraga "ko'taradi".
- `function` declaration — **to'liq** ko'tariladi (e'londan oldin chaqirish mumkin).
- `var` — faqat e'lon ko'tariladi, qiymati `undefined`.
- `let/const/class` — ko'tariladi, lekin TDZ'da bo'ladi.
- Function expression / arrow function — o'zgaruvchi qoidasiga bo'ysunadi.

```js
sayHi(); // ✅ ishlaydi
function sayHi() { console.log('hi'); }

sayBye(); // ❌ TypeError: sayBye is not a function (var) / ReferenceError (const)
var sayBye = () => console.log('bye');
```

---

### 🟡 8. Closure nima? Real misol keltiring.

**Closure** — funksiya o'zi yaratilgan joydagi (lexical) o'zgaruvchilarni, o'sha joy tugab ketgandan keyin ham "eslab qolishi".

```js
function createCounter() {
  let count = 0;               // tashqaridan yashirin (private)
  return {
    inc: () => ++count,
    get: () => count,
  };
}
const c = createCounter();
c.inc(); c.inc();
c.get(); // 2
```

**Qayerda ishlatiladi:**
- Private o'zgaruvchilar (encapsulation)
- `debounce`, `throttle`, `memoize`
- React hook'lar (`useState` ichkarida closure ustiga qurilgan)
- Event handler'lar, factory funksiyalar

**React'dagi "stale closure" muammosi:**
```jsx
const [count, setCount] = useState(0);
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // ❌ count har doim 0 bo'lib qoladi (eski closure)
  }, 1000);
  return () => clearInterval(id);
}, []);

// ✅ Yechim: funksional update
setCount(prev => prev + 1);
```

---

### 🟡 9. `this` qanday ishlaydi?

`this` funksiya **qanday chaqirilganiga** qarab aniqlanadi (arrow function bundan mustasno):

| Chaqirish | `this` |
|---|---|
| `obj.method()` | `obj` |
| `fn()` oddiy | `undefined` (strict mode) / `window` |
| `new Fn()` | yangi yaratilgan ob'ekt |
| `fn.call(ctx)`, `apply`, `bind` | `ctx` |
| Arrow function | **o'zining `this`i yo'q**, tashqi scope'dan oladi |
| DOM event handler (oddiy function) | `event.currentTarget` |

```js
const user = {
  name: 'Ali',
  regular() { return this.name; },
  arrow: () => this.name,          // ❌ tashqi this (module'da undefined)
  delayed() {
    setTimeout(() => console.log(this.name), 100); // ✅ arrow tashqi this'ni oladi → 'Ali'
  },
};

const fn = user.regular;
fn(); // undefined — chunki "obj." orqali chaqirilmadi (kontekst yo'qoldi)
```

---

### 🟡 10. `call`, `apply`, `bind` farqi?

```js
function greet(greeting, mark) { return `${greeting}, ${this.name}${mark}`; }
const u = { name: 'Vali' };

greet.call(u, 'Salom', '!');      // argumentlar alohida
greet.apply(u, ['Salom', '!']);   // argumentlar massivda
const bound = greet.bind(u, 'Salom'); // yangi funksiya qaytaradi, darhol chaqirmaydi
bound('?');
```

---

### 🟢 11. Arrow function va oddiy function farqi?

1. Arrow'da o'zining `this`i yo'q.
2. `arguments` ob'ekti yo'q (`...args` ishlating).
3. `new` bilan chaqirib bo'lmaydi (constructor emas).
4. `prototype` property'si yo'q.
5. Qisqa sintaksis, implicit return.

---

### 🟡 12. Higher-order function, pure function, currying nima?

- **Higher-order function** — funksiyani argument sifatida oladigan yoki funksiya qaytaradigan funksiya (`map`, `filter`, `debounce`).
- **Pure function** — bir xil kirishga doim bir xil natija, va **side effect yo'q** (tashqi narsani o'zgartirmaydi). Redux reducer'lar pure bo'lishi shart.
- **Currying** — `f(a, b, c)` → `f(a)(b)(c)`.

```js
const add = a => b => a + b;
const add5 = add(5);
add5(3); // 8
```

---

## 1.3 Asinxronlik — eng ko'p so'raladigan qism

### 🟡 13. Event Loop qanday ishlaydi?

JS — **bitta oqimli** (single-threaded). Asinxronlik brauzer (Web API) va navbatlar orqali amalga oshadi.

1. **Call Stack** — hozir bajarilayotgan funksiyalar.
2. **Web APIs** — `setTimeout`, `fetch`, DOM eventlar brauzer tomonida ishlaydi.
3. **Microtask queue** — `Promise.then/catch/finally`, `queueMicrotask`, `MutationObserver`, `await`dan keyingi kod.
4. **Macrotask (task) queue** — `setTimeout`, `setInterval`, I/O, UI eventlar.

**Qoida:** Stack bo'shaganda → **barcha microtask'lar** bajariladi → (kerak bo'lsa render) → **bitta macrotask** → yana barcha microtask'lar → …

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
queueMicrotask(() => console.log('4'));
console.log('5');
// 1 5 3 4 2
```

🔴 Qiyinroq:
```js
async function a() {
  console.log('A1');
  await b();
  console.log('A2');   // microtask
}
async function b() { console.log('B'); }

console.log('S');
setTimeout(() => console.log('T'), 0);
a();
new Promise(r => { console.log('P'); r(); }).then(() => console.log('Then'));
console.log('E');
// S A1 B P E A2 Then T
```
Tushuntirish: `new Promise` ichidagi executor **sinxron** ishlaydi. `await`dan keyingi qism microtask'ga tushadi.

---

### 🟢 14. Promise nima? Holatlari?

Promise — kelajakda keladigan natija uchun ob'ekt. Holatlari: `pending` → `fulfilled` yoki `rejected` (bir marta o'zgaradi, keyin "settled").

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('ok'), 1000);
});
p.then(v => console.log(v)).catch(e => console.error(e)).finally(() => console.log('tugadi'));
```

---

### 🟡 15. `Promise.all`, `allSettled`, `race`, `any` farqi?

| Metod | Qachon resolve | Qachon reject |
|---|---|---|
| `all` | **hammasi** muvaffaqiyatli | **birinchi** xato bo'lganda darhol |
| `allSettled` | hammasi tugaganda (natija: `{status, value/reason}`) | hech qachon |
| `race` | birinchi **tugagan** (muvaffaqiyatli yoki xato) | birinchi tugagan xato bo'lsa |
| `any` | birinchi **muvaffaqiyatli** | hammasi xato bo'lsa (`AggregateError`) |

Amaliy: dashboard'da 3 ta mustaqil so'rov → `Promise.all` (parallel, tezroq). Agar bittasi yiqilsa ham qolganini ko'rsatish kerak bo'lsa → `allSettled`. Timeout qilish uchun → `race`.

```js
const withTimeout = (p, ms) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), ms))]);
```

---

### 🟡 16. `async/await` nima? Xatoni qanday ushlaymiz?

`async/await` — Promise ustidagi sintaktik qulaylik. `async` funksiya doim Promise qaytaradi.

```js
async function loadUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`); // ❗ fetch 404/500 da reject qilmaydi!
    return await res.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}
```

🔴 Ketma-ket vs parallel:
```js
// ❌ sekin: 2 soniya
const a = await fetchA(); // 1s
const b = await fetchB(); // 1s

// ✅ tez: 1 soniya
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

🔴 `forEach` ichida `await` ishlamaydi (kutmaydi). `for...of` yoki `Promise.all(arr.map(...))` ishlating.

---

## 1.4 Ob'ektlar, prototype, class

### 🟡 17. Prototype va prototype chain nima?

Har bir ob'ektda yashirin `[[Prototype]]` havolasi bor (`Object.getPrototypeOf(obj)` / `__proto__`). Property topilmasa JS uni prototype zanjiri bo'ylab yuqoriga qidiradi, `null`gacha.

```js
const animal = { eats: true };
const rabbit = Object.create(animal);
rabbit.jumps = true;
rabbit.eats; // true — prototype'dan keldi

[].__proto__ === Array.prototype          // true
Array.prototype.__proto__ === Object.prototype // true
```

`class` — prototype'ga asoslangan meros uchun sintaktik qulaylik (syntactic sugar).

---

### 🟢 18. `class`da `extends`, `super`, private field'lar?

```js
class Animal {
  #secret = 'yashirin';            // haqiqiy private field
  static count = 0;
  constructor(name) { this.name = name; Animal.count++; }
  speak() { return `${this.name} ovoz chiqaradi`; }
}
class Dog extends Animal {
  constructor(name) { super(name); }   // super() this'dan oldin chaqirilishi shart
  speak() { return super.speak() + ': Vov!'; }
}
```

---

### 🟡 19. Shallow copy va deep copy farqi?

```js
const original = { a: 1, nested: { b: 2 } };

const shallow = { ...original };      // yoki Object.assign({}, original)
shallow.nested.b = 99;
original.nested.b; // 99 ❗ ichki ob'ekt umumiy

const deep = structuredClone(original); // ✅ zamonaviy usul (Date, Map, Set ham qo'llab-quvvatlanadi)
// JSON.parse(JSON.stringify(obj)) — funksiya, undefined, Date, Map'ni buzadi
```

React/Redux'da state'ni o'zgartirganda shallow copy yetarli emas bo'lishi mumkin — nested darajalarni ham nusxalash kerak (yoki Immer ishlatish).

---

### 🟢 20. Array metodlari: qaysilari massivni o'zgartiradi (mutate)?

- **Mutatsiya qiladi:** `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`.
- **Yangi massiv qaytaradi:** `map`, `filter`, `slice`, `concat`, `flat`, `toSorted`, `toReversed`, `toSpliced`, `with` (ES2023).

React state'da **faqat ikkinchi guruhni** ishlating:
```js
setItems(prev => [...prev].sort(...)); // yoki prev.toSorted(...)
```

`reduce` misol — guruhlash:
```js
const byCategory = products.reduce((acc, p) => {
  (acc[p.category] ??= []).push(p);
  return acc;
}, {});
// yoki: Object.groupBy(products, p => p.category)
```

---

### 🟡 21. `Map` va `Object`, `Set` va `Array` farqi?

- `Map` — kalit har qanday tip bo'lishi mumkin (ob'ekt, funksiya), tartib saqlanadi, `size` bor, tez-tez qo'shish/o'chirishda tezroq.
- `Set` — faqat unikal qiymatlar. `[...new Set(arr)]` — dublikatlarni olib tashlash.
- `WeakMap/WeakSet` — kalitlar faqat ob'ekt, garbage collector ularni tozalashi mumkin (memory leak bo'lmaydi). Masalan DOM element'ga metadata bog'lash.

---

### 🟢 22. Destructuring, spread, rest?

```js
const { name, age = 18, address: { city } = {} } = user;
const [first, , third, ...rest] = arr;
const merged = { ...defaults, ...options };
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }
```

---

## 1.5 Brauzer va DOM

### 🟡 23. Event bubbling, capturing, delegation?

Event 3 bosqichda tarqaladi: **capturing** (yuqoridan pastga) → **target** → **bubbling** (pastdan yuqoriga).

- `e.stopPropagation()` — tarqalishni to'xtatadi.
- `e.preventDefault()` — brauzerning standart harakatini bekor qiladi (form submit, link o'tish).
- `e.target` — haqiqatda bosilgan element; `e.currentTarget` — handler ilingan element.

**Event delegation** — 1000 ta `<li>`ga 1000 ta handler o'rniga ota elementga bitta handler:
```js
list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (li) console.log(li.dataset.id);
});
```
React ham ichkarida delegation ishlatadi (root'da).

---

### 🟡 24. `debounce` va `throttle` farqi?

- **Debounce** — oxirgi chaqiruvdan keyin N ms jimlik bo'lsa ishlaydi. *Misol:* qidiruv inputi.
- **Throttle** — N ms ichida ko'pi bilan 1 marta ishlaydi. *Misol:* scroll, resize, mousemove.

Implementatsiyasi → [07-live-coding.md](./07-live-coding.md).

---

### 🟢 25. `localStorage`, `sessionStorage`, cookie farqi?

| | localStorage | sessionStorage | Cookie |
|---|---|---|---|
| Hajm | ~5–10MB | ~5MB | ~4KB |
| Yashash muddati | o'chirilguncha | tab yopilguncha | `Expires/Max-Age` |
| Serverga yuboriladimi | yo'q | yo'q | **ha, har so'rovda** |
| JS'dan o'qish | ha | ha | ha (agar `HttpOnly` bo'lmasa) |

Token saqlash: eng xavfsiz — `HttpOnly; Secure; SameSite` cookie (XSS orqali o'g'irlab bo'lmaydi). `localStorage`dagi token XSS'ga zaif.

---

## 1.6 Qo'shimcha muhim savollar

### 🟡 26. ES Modules va CommonJS farqi?
- ESM: `import/export`, statik (tree-shaking mumkin), asinxron yuklanadi, brauzer va zamonaviy Node.
- CJS: `require/module.exports`, dinamik, sinxron, eski Node.

### 🟡 27. Garbage collection va memory leak?
JS "mark-and-sweep" algoritmi bilan erishib bo'lmaydigan ob'ektlarni tozalaydi. Leak sabablari:
- tozalanmagan `setInterval`, event listener'lar
- global o'zgaruvchilar
- closure'da katta ma'lumotni ushlab qolish
- o'chirilgan DOM element'ga havola saqlash

React'da: `useEffect` cleanup funksiyasini yozmaslik — eng keng tarqalgan sabab.

### 🟡 28. `Object.freeze` vs `const`?
`const` — o'zgaruvchini qayta tayinlashni taqiqlaydi. `Object.freeze` — ob'ekt property'larini o'zgartirishni taqiqlaydi (lekin **shallow**).

### 🟡 29. Generator va iterator nima?
```js
function* ids() { let i = 0; while (true) yield i++; }
const g = ids(); g.next().value; // 0
```
`Symbol.iterator`ni amalga oshirgan har qanday ob'ekt `for...of` bilan aylanadi. Redux-Saga generator'larga asoslangan.

### 🔴 30. Nima chiqadi?
```js
console.log([] + []);        // ""
console.log([] + {});        // "[object Object]"
console.log(1 + '2' - 1);    // 11   ("12" - 1)
console.log('5' * '2');      // 10
console.log(0.1 + 0.2 === 0.3); // false → Math.abs(a-b) < Number.EPSILON
console.log(typeof NaN);     // "number"
console.log([1,2,3].map(parseInt)); // [1, NaN, NaN] — parseInt(value, index) radix sifatida
```
