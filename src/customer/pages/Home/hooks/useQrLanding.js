import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useTableStore from '../../../../store/tableStore';

const decodeToken = (token) => {
  const pad = '='.repeat((4 - (token.length % 4)) % 4);
  const b64 = (token + pad).replace(/-/g, '+').replace(/_/g, '/');
  const json = atob(b64);
  const parsed = JSON.parse(json);
  if (typeof parsed.code !== 'string' || typeof parsed.label !== 'string') {
    throw new Error('Token payload missing code/label');
  }
  return { code: parsed.code, label: parsed.label };
};

const useQrLanding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const code = useTableStore((s) => s.code);
  const label = useTableStore((s) => s.label);
  const setTable = useTableStore((s) => s.setTable);

  const [status, setStatus] = useState(() => {
    if (searchParams.get('t')) return 'pending';
    if (searchParams.get('scan') === 'expired') return 'expired';
    return code && label ? 'ok' : 'no-token';
  });

  useEffect(() => {
    // Kode QR tidak valid / kadaluarsa (BE redirect dengan ?scan=expired).
    if (searchParams.get('scan') === 'expired') {
      setStatus('expired');
      const next = new URLSearchParams(searchParams);
      next.delete('scan');
      setSearchParams(next, { replace: true });
      return;
    }

    const token = searchParams.get('t');
    if (!token) return;

    const next = new URLSearchParams(searchParams);
    next.delete('t');
    try {
      const { code: c, label: l } = decodeToken(token);
      setTable({ code: c, label: l });
      setStatus('ok');
    } catch {
      setStatus('invalid');
    } finally {
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams, setTable]);

  return { status, code, label };
};

export default useQrLanding;
