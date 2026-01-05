export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm">
        © {new Date().getFullYear()} BookSwap · Built by{" "}
        <span className="font-semibold">
          Sayyed Saud & Shaikh Aman
        </span>
      </div>
    </footer>
  );
}
