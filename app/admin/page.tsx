"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";

type AdminDestination = {
  id: string;
  code: string;
  name: string;
  category: string;
  region_id: string;
  latitude: number;
  longitude: number;
  status: string;
  version: number;
};

const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T | undefined> {
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Demo-User": "admin",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error?.message ?? `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined;
  return response.json() as Promise<T>;
}

const emptyForm = { name: "", category: "Alam", latitude: "-6.8000", longitude: "110.8400" };

export default function AdminPage() {
  const [items, setItems] = useState<AdminDestination[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<AdminDestination | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = () => adminFetch<{ items: AdminDestination[] }>("/api/v1/internal/destinations", { headers: { Accept: "application/json" } }).then((data) => setItems(data?.items ?? [])).catch((reason: Error) => setError(reason.message));
  useEffect(() => { void load(); }, []);

  function setField(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEdit(item: AdminDestination) {
    setEditing(item);
    setForm({ name: item.name, category: item.category, latitude: String(item.latitude), longitude: String(item.longitude) });
    setError(null);
    setMessage(null);
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      setError("Latitude harus antara -90 dan 90, longitude antara -180 dan 180.");
      return;
    }
    try {
      if (editing) {
        await adminFetch(`/api/v1/internal/destinations/${editing.id}`, {
          method: "PATCH",
          headers: { "If-Match": `\"${editing.id}:${editing.version}\"` },
          body: JSON.stringify({ name: form.name, category: form.category, location: { latitude, longitude }, change_reason: "Pembaruan melalui panel admin" }),
        });
        setMessage("Destinasi berhasil diperbarui.");
      } else {
        await adminFetch("/api/v1/internal/destinations", {
          method: "POST",
          headers: { "Idempotency-Key": `destination-${Date.now()}` },
          body: JSON.stringify({ code: `KDS-${Date.now()}`, name: form.name, category: form.category, region_id: "kudus", location: { latitude, longitude }, source_label: "Admin demo", dataset_version_id: "admin-demo-v1", change_reason: "Penambahan melalui panel admin" }),
        });
        setMessage("Destinasi berhasil ditambahkan.");
      }
      cancelEdit();
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }

  async function remove(item: AdminDestination) {
    if (!window.confirm(`Arsipkan ${item.name}? Data historis tetap dipertahankan.`)) return;
    setError(null);
    setMessage(null);
    try {
      await adminFetch(`/api/v1/internal/destinations/${item.id}`, { method: "DELETE", headers: { "If-Match": `\"${item.id}:${item.version}\"` } });
      setMessage("Destinasi berhasil diarsipkan.");
      await load();
    } catch (reason) {
      setError((reason as Error).message);
    }
  }

  return <AppShell activeNav="Admin"><section className="admin-page"><div className="eyebrow">Operations / Admin</div><h1 className="page-title">Data management</h1><p className="page-subtitle">Kelola katalog destinasi, termasuk koordinat geografis dan status publikasi.</p><div className="admin-grid"><form className="admin-card" onSubmit={submit}><h2>{editing ? "Edit destinasi" : "Tambah destinasi"}</h2><label htmlFor="destination-name">Nama destinasi</label><input id="destination-name" required value={form.name} onChange={(event) => setField("name", event.target.value)} placeholder="Contoh: Taman Demo Kudus" /><label htmlFor="destination-category">Kategori</label><select id="destination-category" value={form.category} onChange={(event) => setField("category", event.target.value)}><option>Alam</option><option>Religi</option><option>Sejarah</option><option>Budaya</option></select><div className="coordinate-grid"><label htmlFor="destination-latitude">Latitude<input id="destination-latitude" required type="number" step="any" min="-90" max="90" value={form.latitude} onChange={(event) => setField("latitude", event.target.value)} /></label><label htmlFor="destination-longitude">Longitude<input id="destination-longitude" required type="number" step="any" min="-180" max="180" value={form.longitude} onChange={(event) => setField("longitude", event.target.value)} /></label></div><div className="admin-form-actions"><button className="export-button" type="submit">{editing ? "Simpan perubahan" : "Simpan destinasi"}</button>{editing && <button className="admin-cancel" type="button" onClick={cancelEdit}>Batal</button>}</div>{message && <p role="status" className="admin-success">{message}</p>}{error && <p role="alert" className="admin-error">{error}</p>}</form><div className="admin-card"><div className="admin-card-heading"><h2>Katalog destinasi</h2><button type="button" className="admin-refresh" onClick={load}>Muat ulang</button></div><div className="admin-table-wrap"><table><thead><tr><th>Nama</th><th>Kategori</th><th>Koordinat</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.category}</td><td className="font-data">{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</td><td>{item.status}</td><td><div className="admin-row-actions"><button type="button" className="admin-edit" onClick={() => startEdit(item)}>Edit</button><button type="button" className="admin-delete" onClick={() => void remove(item)}>Delete</button></div></td></tr>)}</tbody></table>{items.length === 0 && <p className="admin-empty">Belum ada data admin atau API belum aktif.</p>}</div></div></div><p className="admin-note">Delete memakai soft delete/arsip agar observasi historis tetap aman. Mode demo menggunakan header X-Demo-User; aktifkan OIDC sebelum deployment produksi.</p></section></AppShell>;
}
