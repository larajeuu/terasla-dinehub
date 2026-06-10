import { useState } from 'react';
import Modal from './Modal';

// Modal berisi form generik. `fields` mendefinisikan input yang ditampilkan.
// onSubmit(values) boleh async & boleh melempar error (pesannya akan tampil).
//
// field: { name, label, type?: 'text'|'textarea', placeholder?, required? }
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
            {f.type === 'textarea' ? (
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
