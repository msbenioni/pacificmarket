export default function PortalShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* soft premium glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#00c4cc]/10 blur-3xl" />
        <div className="absolute top-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-[#c9a84c]/10 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
