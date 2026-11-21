# 7. Live-coding masalalari (javoblari bilan)

> Maslahat: masalani yechishdan oldin **ovoz chiqarib** fikrlang, savol bering (edge case'lar), avval oddiy ishlaydigan variantni yozing, keyin yaxshilang.

---

### 1. `debounce`
```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### 2. `throttle`
```js
function throttle(fn, interval) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

### 3. `deepClone`
```js
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value);
  if (seen.has(value)) return seen.get(value);          // aylanma havolalar
  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);
  for (const key of Object.keys(value)) copy[key] = deepClone(value[key], seen);
  return copy;
}
```

### 4. `flatten` (massivni tekislash)
```js
const flatten = (arr) =>
  arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x), []);
flatten([1, [2, [3, [4]]]]); // [1,2,3,4]   (yoki arr.flat(Infinity))
```

### 5. `Promise.all`ni o'zingiz yozing
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((v) => {
        results[i] = v;                     // tartib saqlanadi
        if (++done === promises.length) resolve(results);
      }, reject);
    });
  });
}
```

### 6. `memoize`
```js
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}
```

### 7. `Function.prototype.bind` polyfill
```js
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  return function (...args) { return fn.apply(ctx, [...preset, ...args]); };
};
```

### 8. `Array.prototype.map` polyfill
```js
Array.prototype.myMap = function (cb, thisArg) {
  const res = [];
  for (let i = 0; i < this.length; i++) if (i in this) res[i] = cb.call(thisArg, this[i], i, this);
  return res;
};
```

### 9. Palindrom, anagram, eng ko'p uchragan belgi
```js
const isPalindrome = s => { const c = s.toLowerCase().replace(/[^a-z0-9]/g, ''); return c === [...c].reverse().join(''); };
const isAnagram = (a, b) => [...a].sort().join('') === [...b].sort().join('');
const mostFrequent = s => {
  const m = {}; let best = '';
  for (const ch of s) { m[ch] = (m[ch] || 0) + 1; if (!best || m[ch] > m[best]) best = ch; }
  return best;
};
```

### 10. Ikki son yig'indisi (Two Sum) — O(n)
```js
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
```

### 11. Ob'ektni chuqur solishtirish (`isEqual`)
```js
function isEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every(k => isEqual(a[k], b[k]));
}
```

### 12. Event Emitter
```js
class EventEmitter {
  #events = {};
  on(name, cb) { (this.#events[name] ??= []).push(cb); return () => this.off(name, cb); }
  off(name, cb) { this.#events[name] = (this.#events[name] || []).filter(f => f !== cb); }
  emit(name, ...args) { (this.#events[name] || []).forEach(cb => cb(...args)); }
  once(name, cb) { const off = this.on(name, (...a) => { off(); cb(...a); }); }
}
```

### 13. `retry` — muvaffaqiyatsiz so'rovni qayta urinish
```js
async function retry(fn, attempts = 3, delay = 500) {
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (e) {
      if (i === attempts - 1) throw e;
      await new Promise(r => setTimeout(r, delay * 2 ** i)); // exponential backoff
    }
  }
}
```

---

## React live-coding

### 14. Counter + Todo list (CRUD)
```tsx
type Todo = { id: string; text: string; done: boolean };

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos(prev => [...prev, { id: crypto.randomUUID(), text: text.trim(), done: false }]);
    setText('');
  };
  const toggle = (id: string) => setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: string) => setTodos(prev => prev.filter(t => t.id !== id));

  return (
    <>
      <form onSubmit={add}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Yangi vazifa" />
        <button>Qo'shish</button>
      </form>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
            </label>
            <button onClick={() => remove(t.id)}>✕</button>
          </li>
        ))}
      </ul>
      <p>Bajarilgan: {todos.filter(t => t.done).length}/{todos.length}</p>
    </>
  );
}
```

### 15. `useFetch` custom hook
```tsx
function useFetch<T>(url: string) {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: Error | null }>({
    data: null, loading: true, error: null,
  });

  useEffect(() => {
    const ctrl = new AbortController();
    setState(s => ({ ...s, loading: true, error: null }));
    fetch(url, { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data: T) => setState({ data, loading: false, error: null }))
      .catch(err => { if (err.name !== 'AbortError') setState({ data: null, loading: false, error: err }); });
    return () => ctrl.abort();
  }, [url]);

  return state;
}
```

### 16. Debounce'li qidiruv
```tsx
function Search() {
  const [q, setQ] = useState('');
  const debounced = useDebounce(q, 400);          // 03-react #17
  const { data, loading } = useFetch<Product[]>(`/api/products?q=${encodeURIComponent(debounced)}`);
  return (
    <>
      <input value={q} onChange={e => setQ(e.target.value)} />
      {loading ? <p>Qidirilmoqda…</p> : data?.map(p => <div key={p.id}>{p.title}</div>)}
    </>
  );
}
```

### 17. `useLocalStorage`
```tsx
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}
```

### 18. `useOnClickOutside` (modal/dropdown yopish)
```tsx
function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}
```

### 19. Pagination komponenti
```tsx
function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  return (
    <nav>
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <button key={p} aria-current={p === page} onClick={() => onChange(p)}>{p}</button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)}>›</button>
    </nav>
  );
}
```

### 20. Bu kodda nima xato? (code review savoli)
```jsx
function UserList({ users }) {
  const [filtered, setFiltered] = useState(users);           // 1
  const [q, setQ] = useState('');
  useEffect(() => {
    setFiltered(users.filter(u => u.name.includes(q)));      // 2
  });                                                        // 3
  return filtered.map((u, i) => <div key={i} onClick={() => { u.active = true; }}>{u.name}</div>); // 4,5
}
```
**Javob:**
1. `filtered` — derived state, alohida state kerak emas (props o'zgarsa yangilanmaydi ham).
2–3. Dependency array yo'q → har renderda ishlaydi → setState → cheksiz sikl.
4. `key={i}` — index key.
5. `u.active = true` — props'ni **mutatsiya** qilish, UI yangilanmaydi.

✅ To'g'ri:
```jsx
const filtered = useMemo(() => users.filter(u => u.name.toLowerCase().includes(q.toLowerCase())), [users, q]);
return filtered.map(u => <div key={u.id} onClick={() => onActivate(u.id)}>{u.name}</div>);
```
