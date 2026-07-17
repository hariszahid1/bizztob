"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera } from "lucide-react";

type ProductInput = {
  id?: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string;
  isActive: boolean;
};

export function ProductForm({
  mode,
  product,
}: {
  mode: "create" | "edit";
  product?: ProductInput;
}) {
  const router = useRouter();
  const [name, setName] = useState(product?.name || "");
  const [category, setCategory] = useState(product?.category || "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [cost, setCost] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState(String(product?.stock ?? "0"));
  const [shortAlert, setShortAlert] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState(product?.sku || "");
  const [unit, setUnit] = useState(product?.unit || "pcs");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const body = {
      name,
      sku: sku || null,
      category: category || null,
      price: parseFloat(price) || 0,
      unit,
      stock: parseInt(stock, 10) || 0,
      imageUrl: imageUrl || null,
      isActive,
    };
    const url =
      mode === "create"
        ? "/api/distributor/products"
        : `/api/distributor/products/${product!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }
    router.push("/distributor/products");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href="#" className="btn-primary">
          Add Category
        </Link>
      </div>

      <form
        onSubmit={save}
        className="card p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h2>

          <div className="mt-4 relative aspect-square max-w-[380px] bg-orange-100 rounded-2xl overflow-hidden">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full grid place-items-center text-orange-300">
                <Camera className="h-12 w-12" />
              </div>
            )}
          </div>
          <div className="mt-2 max-w-[380px] flex justify-end">
            <button
              type="button"
              onClick={() => {
                const url = prompt("Paste image URL:", imageUrl);
                if (url !== null) setImageUrl(url);
              }}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              change image
            </button>
          </div>

          <div className="mt-6 max-w-[380px]">
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="SKU*"
              className="input"
            />
          </div>
        </div>

        <div className="space-y-4">
          <FloatingInput
            value={name}
            onChange={setName}
            placeholder="Product Name"
            required
          />
          <FloatingInput
            value={category}
            onChange={setCategory}
            placeholder="Category Name"
          />
          <FloatingInput
            value={price}
            onChange={setPrice}
            placeholder="Price"
            type="number"
            required
          />
          <FloatingInput
            value={cost}
            onChange={setCost}
            placeholder="Cost"
            type="number"
          />
          <FloatingInput
            value={discount}
            onChange={setDiscount}
            placeholder="Discount"
            type="number"
          />
          <FloatingInput
            value={stock}
            onChange={setStock}
            placeholder="Stock"
            type="number"
            required
          />
          <FloatingInput
            value={shortAlert}
            onChange={setShortAlert}
            placeholder="Short alert"
          />
          <div>
            <textarea
              className="input min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description...."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="active"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label htmlFor="active" className="text-sm text-slate-700">
              Active (visible in retailer market)
            </label>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Link href="/distributor/products" className="btn-secondary">
              Cancel
            </Link>
            <button className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : mode === "create" ? "Add" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function FloatingInput({
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      required={required}
      className="input"
    />
  );
}
