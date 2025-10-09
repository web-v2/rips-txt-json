function Footer() {
  return (
      <div className="flex flex-col md:flex-row justify-between items-center text-center gap-4 py-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} <span className="text-indigo-500 font-bold">Ing. Samir Vergara</span>. Todos los derechos reservados. Para mayor Información: <span className='text-red-500 font-bold'>+57 300 412 2688</span>
        </p>
        <div className="flex space-x-6 text-sm text-gray-500">
          <span className="font-bold">Versión 5.0</span>
        </div>
      </div>
  );
}

export default Footer;