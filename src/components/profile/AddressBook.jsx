import React, { useState } from 'react';
import { Plus, Trash2, Edit3, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function AddressBook() {
  const { user, updateMe } = useAuth();
  const addresses = user?.saved_addresses || [];

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    recipient: '',
    phone: '',
    address: '',
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);

  const startAdd = () => {
    setEditId(null);
    setFormData({
      label: '',
      recipient: user?.full_name || '',
      phone: user?.phone || '',
      address: '',
    });
    setIsEditing(true);
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setFormData({
      label: item.label,
      recipient: item.recipient,
      phone: item.phone,
      address: item.address,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.address.trim()) return;

    setSaving(true);
    let nextList = [...addresses];

    if (editId) {
      nextList = nextList.map((a) => (a.id === editId ? { ...a, ...formData } : a));
    } else {
      const newEntry = {
        id: Math.random().toString(36).slice(2) + Date.now().toString(36),
        label: formData.label.trim() || 'Delivery Address',
        recipient: formData.recipient.trim() || user?.full_name || '',
        phone: formData.phone.trim() || user?.phone || '',
        address: formData.address.trim(),
      };
      nextList.push(newEntry);
    }

    try {
      await updateMe({ saved_addresses: nextList });
      setIsEditing(false);
      setEditId(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const nextList = addresses.filter((a) => a.id !== id);
    setSaving(true);
    try {
      await updateMe({ saved_addresses: nextList });
      setDeleteConfirmId(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-border bg-card p-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="kicker">Logistics</p>
          <h3 className="mt-1 font-display text-lg font-medium">Saved Delivery Addresses</h3>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={startAdd}
            className="btn-outline py-2 px-4 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Address
          </button>
        )}
      </div>

      {/* Editor Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="mt-6 border border-foreground/20 bg-secondary/30 p-5 space-y-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
            {editId ? 'Edit Address' : 'New Address'}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Label (e.g. Home, Office, Kitchen Studio) *</label>
              <input
                type="text"
                required
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Kitchen Studio — East Legon"
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Recipient Name</label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                placeholder="Kwame Mensah"
                className="field-input"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Recipient Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="024 412 3456"
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Full Address / Landmark *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="No. 14 boundary Road, East Legon, Accra"
                className="field-input"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-outline py-2 px-4 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2 px-5 text-xs"
            >
              {saving ? 'Saving…' : 'Save Address'}
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div className="mt-6">
        {addresses.length === 0 && !isEditing ? (
          <div className="border border-dashed border-border py-10 text-center">
            <MapPin className="mx-auto h-6 w-6 text-muted-foreground/60" strokeWidth={1.5} />
            <p className="mt-2 text-sm text-muted-foreground">
              No saved delivery addresses.
            </p>
            <button
              type="button"
              onClick={startAdd}
              className="mt-3 font-mono text-xs uppercase tracking-wider text-[#2D4B73] hover:underline"
            >
              + Add your first delivery location
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between border border-border p-4 transition-colors hover:border-foreground/30"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        aria-label="Edit address"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      {deleteConfirmId === item.id ? (
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive hover:underline"
                          >
                            Confirm
                          </button>
                          <span>/</span>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-muted-foreground hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                          aria-label="Delete address"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-foreground">{item.address}</p>
                  {(item.recipient || item.phone) && (
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {item.recipient} {item.phone ? `· ${item.phone}` : ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
