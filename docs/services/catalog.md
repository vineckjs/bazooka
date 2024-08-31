# MS Catalog

### Expose

**trpc methods**

- getSections()
- getProductsBySection(sectionId: string)
- getFeaturedProducts()
- getRelatedProdudts(context)
- getAutocompletions(q: string)
- getSearch(q: string)

### rabbitmq

**listen**

- products.updateStock: productsService.updateStock
- // <queue>.<event>: <action>

### Entities

**product**

```ts
type Product {
  id: string
  title: string
}
```

**section**

```ts
type Section {
  id: string
  title: string
}
```

**merchant**

```ts
type Merchant {
  id: string
  name: string
}
```

**customer**

```ts
type Customer {
  id: string
  name: string
}
```
