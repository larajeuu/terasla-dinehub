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
    return code && label ? 'ok' : 'no-token';
  });

  useEffect(() => {
    const token = searchParams.get('t');
    if (!token) return;

    try {
      const { code: c, label: l } = decodeToken(token);
      setTable({ code: c, label: l });
      setStatus('ok');
      const next = new URLSearchParams(searchParams);
      next.delete('t');
      setSearchParams(next, { replace: true });
    } catch {
      setStatus('invalid');
    }
  }, [searchParams, setSearchParams, setTable]);

  return { status, code, label };
};

export default useQrLanding;
