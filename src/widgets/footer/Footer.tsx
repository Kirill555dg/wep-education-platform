export function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-4 sm:py-6 mt-4 sm:mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-blue-200 text-sm sm:text-base">© {new Date().getFullYear()} WEP. Все права защищены.</p>
      </div>
    </footer>
  );
}
