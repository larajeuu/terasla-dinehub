const LoginHeader = () => {
  return (
    <div className="flex flex-col items-center gap-1 mb-8">
      <h1 className="text-4xl font-bold tracking-tight">
        <span
            className="text-white"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
            >
        Teras{' '}
        </span>
        <span
            style={{ color: '#C8961A', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
        >
    LA
  </span>
</h1>
      <p
        className="text-sm font-medium tracking-widest uppercase"
        style={{ color: 'rgba(200, 150, 26, 0.8)', fontFamily: "'Inter', sans-serif" }}
      >
        Merchant
      </p>
    </div>
  );
};

export default LoginHeader;