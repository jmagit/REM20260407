export function Footer() {
  return (
    <footer className="fixed-bottom d-flex flex-wrap justify-content-between align-items-center p-2 mt-4 me-0 border-top bg-light">
      <div className="col-md-4 d-flex align-items-center">
        <span className="mb-3 mb-md-0 text-body-secondary">
          &copy; {new Date().getFullYear()} Todos los derechos reservados
        </span>
      </div>
    </footer>
  );
}