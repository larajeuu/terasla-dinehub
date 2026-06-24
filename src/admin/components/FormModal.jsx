import { useRef, useState } from 'react';
import Modal from './Modal';

// Field gambar: pratinjau + tombol pilih file. `upload(file)` async → URL string,
// yang disimpan ke values[name]. Jika tidak ada gambar, nilai tetap '' (kosong)
// sehingga FE customer memakai tampilan dummy/gradien sebagai fallback.
const ImageField = ({ value, onChange, upload, placeholder }) => {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const url = await upload(file);
      onChange(url);
    } catch (ex) {
      setErr(ex?.response?.data?.detail || 'Gagal mengunggah gambar');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-20 h-14 rounded-lg overflow-hidden border flex items-center justify-center shrink-0"
           style={{ borderColor: '#e5e7eb', background: '#f9fafb' }}>
        {value
          ? <img src={value} alt="" className="w-full h-full object-cover" />
          : <span className="text-[10px] text-gray-400">Dummy</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                  style={{ background: '#1D3A27' }}>
            {busy ? 'Mengunggah...' : (value ? 'Ganti Gambar' : 'Pilih Gambar')}
          </button>
          {value && (
            <button type="button" onClick={() => onChange('')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border"
                    style={{ borderColor: '#e5e7eb', color: '#475569' }}>
              Hapus
            </button>
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-1 truncate">{err || placeholder || 'JPG/PNG/WebP, maks 5MB'}</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
    </div>
  );
};

// Modal berisi form generik. `fields` mendefinisikan input yang ditampilkan.
// onSubmit(values) boleh async & boleh melempar error (pesannya akan tampil).
//
// field: { name, label, type?: 'text'|'textarea'|'image', placeholder?, required?, upload? }
const FormModal = ({ title, fields, initialValues = {}, submitLabel = 'Simpan', onSubmit, onClose }) => {
  const [values, setValues] = useState(() => {
    const init = {};
    fields.forEach((f) => { init[f.name] = initialValues[f.name] ?? ''; });
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const setField = (name, val) => setValues((prev) => ({ ...prev, [name]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = fields.find((f) => f.required && !String(values[f.name] ?? '').trim());
    if (missing) {
      setError(`${missing.label} wajib diisi`);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal menyimpan data');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl border text-sm outline-none focus:border-gray-400';

  return (
    <Modal title={title} onClose={submitting ? () => {} : onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              {f.label}{f.required && ' *'}
            </label>
            {f.type === 'image' ? (
              <ImageField
                value={values[f.name]}
                onChange={(url) => setField(f.name, url)}
                upload={f.upload}
                placeholder={f.placeholder}
              />
            ) : f.type === 'textarea' ? (
              <textarea
                value={values[f.name]}
                onChange={(e) => setField(f.name, e.target.value)}
                placeholder={f.placeholder}
                rows={2}
                className={inputCls}
                style={{ borderColor: '#e5e7eb' }}
              />
            ) : (
              <input
                type="text"
                value={values[f.name]}
                onChange={(e) => setField(f.name, e.target.value)}
                placeholder={f.placeholder}
                className={inputCls}
                style={{ borderColor: '#e5e7eb' }}
              />
            )}
          </div>
        ))}
        {error && (
          <div className="text-xs rounded-lg px-3 py-2" style={{ background: '#fef2f2', color: '#b91c1c' }}>
            {error}
          </div>
        )}
        <div className="flex gap-2 justify-end mt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-sm font-semibold border disabled:opacity-50"
            style={{ borderColor: '#e5e7eb', color: '#475569' }}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: '#C8961A' }}
          >
            {submitting ? 'Menyimpan...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
