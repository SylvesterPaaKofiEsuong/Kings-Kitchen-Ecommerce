import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ImageUpload({ value, onChange }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Simulate file upload or convert to Data URL for instant preview & persistence
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read image file.');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error uploading file.');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="field-label">Product Image</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Preview thumbnail */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-border bg-muted">
          {value ? (
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
              <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
            </div>
          )}
        </div>

        {/* Input & Upload Button */}
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste image URL (https://...)"
            className="field-input flex-1 text-xs"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFile}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="btn-outline shrink-0 py-2.5 px-3.5 text-[10px]"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                Upload File
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="border-l-2 border-destructive pl-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
