# useEffect Best Practices - DOs and DON'Ts

A comprehensive guide based on React team recommendations and Dan Abramov's guidelines.

## Core Principle

**useEffect is an escape hatch** - Use it only for synchronizing with external systems, not for coordinating React state updates.

---

## ❌ DON'T - Common Anti-Patterns

### 1. DON'T Use Effects to Transform Data for Rendering

**Bad:**
```tsx
function TodoList({ todos, filter }) {
  const [visibleTodos, setVisibleTodos] = useState([]);

  // ❌ Anti-pattern: Syncing state with useEffect
  useEffect(() => {
    setVisibleTodos(filterTodos(todos, filter));
  }, [todos, filter]);

  return <div>{visibleTodos.map(...)}</div>;
}
```

**Good:**
```tsx
function TodoList({ todos, filter }) {
  // ✅ Calculate directly during render
  const visibleTodos = filterTodos(todos, filter);

  return <div>{visibleTodos.map(...)}</div>;
}
```

---

### 2. DON'T Use Effects for Expensive Calculations

**Bad:**
```tsx
function ProductList({ products }) {
  const [sortedProducts, setSortedProducts] = useState([]);

  // ❌ Anti-pattern: Effect for computation
  useEffect(() => {
    setSortedProducts(expensiveSort(products));
  }, [products]);

  return <div>{sortedProducts.map(...)}</div>;
}
```

**Good:**
```tsx
function ProductList({ products }) {
  // ✅ Use useMemo for expensive calculations
  const sortedProducts = useMemo(
    () => expensiveSort(products),
    [products]
  );

  return <div>{sortedProducts.map(...)}</div>;
}
```

---

### 3. DON'T Use Effects to Handle User Events

**Bad:**
```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false);

  // ❌ Anti-pattern: Effect for event handling
  useEffect(() => {
    if (submitted) {
      toast.success('Form submitted!');
      setSubmitted(false);
    }
  }, [submitted]);

  return <button onClick={() => setSubmitted(true)}>Submit</button>;
}
```

**Good:**
```tsx
function Form() {
  // ✅ Handle in event handler
  function handleSubmit() {
    toast.success('Form submitted!');
    // Handle submission logic here
  }

  return <button onClick={handleSubmit}>Submit</button>;
}
```

---

### 4. DON'T Sync State Based on Props/State Changes

**Bad:**
```tsx
function UserProfile({ user }) {
  const [name, setName] = useState(user.name);

  // ❌ Anti-pattern: Syncing derived state
  useEffect(() => {
    setName(user.name);
  }, [user.name]);

  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
```

**Good:**
```tsx
function UserProfile({ user }) {
  // ✅ Use key prop to reset state, or control it from parent
  const [name, setName] = useState(user.name);

  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}

// Or use it with key:
<UserProfile key={user.id} user={user} />
```

---

### 5. DON'T Use Effects to Initialize State from Props

**Bad:**
```tsx
function Modal({ isOpen }) {
  const [show, setShow] = useState(false);

  // ❌ Anti-pattern: Effect for initial state
  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  return show ? <div>Modal</div> : null;
}
```

**Good:**
```tsx
function Modal({ isOpen }) {
  // ✅ Use lazy initializer or direct state
  const [show, setShow] = useState(() => isOpen);

  return show ? <div>Modal</div> : null;
}

// Or even simpler - just use the prop directly:
function Modal({ isOpen }) {
  return isOpen ? <div>Modal</div> : null;
}
```

---

### 6. DON'T Chain Effects (Effect → State → Effect)

**Bad:**
```tsx
function ShoppingCart({ items }) {
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  // ❌ Anti-pattern: Chained effects causing cascading renders
  useEffect(() => {
    setTotal(calculateTotal(items));
  }, [items]);

  useEffect(() => {
    setDiscount(calculateDiscount(total));
  }, [total]);

  return <div>Total: {total - discount}</div>;
}
```

**Good:**
```tsx
function ShoppingCart({ items }) {
  // ✅ Calculate everything in one pass
  const total = calculateTotal(items);
  const discount = calculateDiscount(total);

  return <div>Total: {total - discount}</div>;
}

// Or in event handler:
function ShoppingCart({ items }) {
  function handleCheckout() {
    const total = calculateTotal(items);
    const discount = calculateDiscount(total);
    processPayment(total - discount);
  }

  return <button onClick={handleCheckout}>Checkout</button>;
}
```

---

### 7. DON'T Use Effects with Missing Dependencies

**Bad:**
```tsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  // ❌ Anti-pattern: Missing dependency
  useEffect(() => {
    fetchResults(query).then(setResults);
  }, []); // Missing 'query' dependency
}
```

**Good:**
```tsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  // ✅ Include all dependencies
  useEffect(() => {
    fetchResults(query).then(setResults);
  }, [query]);
}
```

---

## ✅ DO - Valid Use Cases

### 1. DO Use Effects for External System Synchronization

**Good:**
```tsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    // ✅ Connecting to external chat service
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]);

  return <div>Connected to {roomId}</div>;
}
```

---

### 2. DO Use Effects for Fetching Data

**Good:**
```tsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Fetching from external API
    let cancelled = false;

    fetchUser(userId).then(data => {
      if (!cancelled) {
        setUser(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

---

### 3. DO Use Effects for Browser APIs

**Good:**
```tsx
function WindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // ✅ Subscribing to browser event
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div>{size.width} x {size.height}</div>;
}
```

---

### 4. DO Use Effects for Third-Party Integrations

**Good:**
```tsx
function MapWidget({ location }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // ✅ Initializing third-party library
    const map = new GoogleMap(mapRef.current);
    map.setCenter(location);

    return () => {
      map.destroy();
    };
  }, [location]);

  return <div ref={mapRef} />;
}
```

---

### 5. DO Use Effects for Analytics/Tracking

**Good:**
```tsx
function ProductPage({ productId }) {
  useEffect(() => {
    // ✅ Tracking page view
    analytics.track('product_viewed', { productId });
  }, [productId]);

  return <div>Product {productId}</div>;
}
```

---

## Quick Decision Tree

```
Do I need useEffect?
│
├─ Is it for transforming data?
│  └─ NO → Calculate during render
│
├─ Is it for expensive computation?
│  └─ NO → Use useMemo
│
├─ Is it for handling user events?
│  └─ NO → Use event handlers
│
├─ Is it for syncing state with props?
│  └─ NO → Use key prop or calculate during render
│
├─ Is it for connecting to external systems?
│  └─ YES → Use useEffect ✅
│
└─ Is it for browser APIs/subscriptions?
   └─ YES → Use useEffect ✅
```

---

## Performance Tips

1. **Always include cleanup functions** when subscribing to events or external systems
2. **Use dependency arrays correctly** - include all values used inside the effect
3. **Avoid object/array dependencies** - they cause unnecessary re-runs
4. **Consider custom hooks** - extract complex effects into reusable hooks
5. **Use React Query/SWR** - for data fetching instead of manual useEffect

---

## Summary

**useEffect should be rare.** Dan Abramov noted that Facebook's large codebase has only ~30 useEffect warnings. If you find yourself using many effects, you're likely doing something wrong.

**Remember:** Effects are for stepping outside React to synchronize with external systems. For everything else, there's probably a better way.

---

## Resources

- [React Docs: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Dan Abramov: A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)
- [TkDodo: Simplifying useEffect](https://tkdodo.eu/blog/simplifying-use-effect)
