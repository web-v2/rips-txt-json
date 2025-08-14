function Footer() {
  return (
      <div className="flex flex-col md:flex-row justify-between items-center text-center gap-4 py-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Samir Vergara. Todos los derechos reservados. Para mayor Información: <span className='text-red-500'>+57 300 412 2688</span>
        </p>
        <div className="flex space-x-6 text-sm text-gray-500">
          <span>Versión 2.0</span>
        </div>
      </div>
  );
}

export default Footer;