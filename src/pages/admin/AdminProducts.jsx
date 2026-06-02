import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "../../hooks/useToast";

const BLANK = {
  name: "",
  description: "",
  affiliate_link: "",
  category_id: "",
  store: "Amazon",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [images, setImages] = useState([]); // {src, type}
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  async function load() {
    const [p, c] = await Promise.all([
      supabase
        .from("products")
        .select("*,categories(name)")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setProducts(p.data || []);
    setCats(c.data || []);
  }
  useEffect(() => {
    load();
  }, []);

  function compress(src) {
    return new Promise((res) => {
      if (!src.startsWith("data:")) {
        res(src);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let w = img.width,
          h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) {
            h = Math.round((h * MAX) / w);
            w = MAX;
          } else {
            w = Math.round((w * MAX) / h);
            h = MAX;
          }
        }
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        res(c.toDataURL("image/jpeg", 0.92));
      };
      img.onerror = () => res(src);
      img.src = src;
    });
  }

  function addFiles(fileList) {
    const files = Array.from(fileList).slice(0, 5 - images.length);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const compressed = await compress(e.target.result);
        setImages((prev) =>
          prev.length < 5
            ? [...prev, { src: compressed, type: "upload" }]
            : prev,
        );
      };
      reader.readAsDataURL(file);
    });
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Product name required";
    if (!form.description.trim()) e.description = "Description required";
    if (!form.affiliate_link.trim())
      e.affiliate_link = "Affiliate link required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function save() {
    if (!validate()) return;
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      affiliate_link: form.affiliate_link.trim(),
      category_id: form.category_id || null,
      store: form.store,
      image_urls: images.map((i) => i.src),
    };
    if (editId) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editId);
      if (error) {
        toast("Failed to update", "error");
      } else {
        toast("Product updated!", "success");
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        toast("Failed to add", "error");
      } else {
        toast("Product added!", "success");
      }
    }
    setForm(BLANK);
    setEditId(null);
    setImages([]);
    setBusy(false);
    load();
  }

  function edit(p) {
    setForm({
      name: p.name,
      description: p.description || "",
      affiliate_link: p.affiliate_link || "",
      category_id: p.category_id || "",
      store: p.store || "Amazon",
    });
    setEditId(p.id);
    setImages((p.image_urls || []).map((s) => ({ src: s, type: "url" })));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function del(id) {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast("Product deleted");
    load();
  }
  const lastIndex = currentPage * productsPerPage;

  const firstIndex = lastIndex - productsPerPage;

  const currentProducts = products.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(products.length / productsPerPage);
  return (
    <div
      className="admin-mobile-stack"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        gap: 32,
        alignItems: "start",
      }}
    >
      {/* Form */}
      <div className="form-wrap">
        <div className="form-title">
          {editId ? "✏️ Edit Product" : "➕ Add New Product"}
        </div>

        <div className="form-group">
          <label className="form-label">Product Name *</label>
          <input
            className={"form-input" + (errors.name ? " error" : "")}
            placeholder="e.g. Smart WiFi Bulb"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            className={"form-textarea" + (errors.description ? " error" : "")}
            placeholder="Brief description…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && (
            <div className="form-error">{errors.description}</div>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Store</label>

          <select
            className="form-select"
            value={form.store}
            onChange={(e) =>
              setForm({
                ...form,
                store: e.target.value,
              })
            }
          >
            <option value="Amazon">Amazon</option>

            <option value="Flipkart">Flipkart</option>

            <option value="Myntra">Myntra</option>

            <option value="AJIO">AJIO</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">📷 Product Images (up to 5)</label>
          <div
            className={"img-upload-zone" + (drag ? " drag" : "")}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              addFiles(e.dataTransfer.files);
            }}
          >
            <div style={{ fontSize: 28 }}>📁</div>
            <div
              style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}
            >
              <strong style={{ color: "var(--accent)" }}>Tap to upload</strong>{" "}
              or drag &amp; drop
              <br />
              <span style={{ fontSize: 11 }}>
                JPG, PNG, WEBP · Auto-compressed · {5 - images.length} slots
                left
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>
          {images.length > 0 && (
            <div className="img-thumbs">
              {images.map((im, i) => (
                <div key={i} className="img-thumb">
                  <img src={im.src} alt="" />
                  {i === 0 && <div className="img-thumb-main">MAIN</div>}
                  <button
                    className="img-thumb-rm"
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Affiliate Link *</label>
          <input
            className={"form-input" + (errors.affiliate_link ? " error" : "")}
            placeholder="Paste affiliate link"
            value={form.affiliate_link}
            onChange={(e) =>
              setForm({ ...form, affiliate_link: e.target.value })
            }
          />
          {errors.affiliate_link && (
            <div className="form-error">{errors.affiliate_link}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">— Select Category —</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: "center" }}
            onClick={save}
            disabled={busy}
          >
            {busy ? "Saving…" : "Save Product"}
          </button>
          {editId && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setForm(BLANK);
                setEditId(null);
                setImages([]);
                setErrors({});
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="admin-list">
        <div className="admin-list-head">
          <h3>All Products ({products.length})</h3>
        </div>

        {products.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--muted)",
            }}
          >
            No products yet. Add your first one!
          </div>
        ) : (
          <>
            {currentProducts.map((p) => (
              <div key={p.id} className="admin-list-item">
                <div className="admin-item-img">
                  {p.image_urls?.[0] ? (
                    <img src={p.image_urls[0]} alt="" />
                  ) : (
                    "🛍️"
                  )}
                </div>

                <div className="admin-item-info">
                  <div className="admin-item-name">{p.name}</div>

                  <div className="admin-item-meta">
                    {p.categories?.name || "No category"}
                  </div>
                </div>

                <div className="admin-item-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => edit(p)}
                  >
                    ✏️
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => del(p.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {/* PAGINATION */}

            {totalPages > 1 && (
              <div className="admin-pagination-wrap">
                {/* PREV */}
                <button
                  className="admin-page-nav"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  &lt;
                </button>

                {/* PAGE NUMBERS */}
                <div className="admin-pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={currentPage === i + 1 ? "active" : ""}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {/* NEXT */}
                <button
                  className="admin-page-nav"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
