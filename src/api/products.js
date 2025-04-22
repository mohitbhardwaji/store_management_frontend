export async function fetchProducts() {
    const res = await fetch('https://dummyjson.com/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.products; // returns an array
  }
  