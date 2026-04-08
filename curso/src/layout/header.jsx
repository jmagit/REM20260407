import imgLogo from '../assets/logo.png'

export function Header(props) {
    return (
        <header>
            <nav>
                <Menu
                    opciones={props.menu}
                    activo={props.activo}
                    onChanged={props.onMenuChange}
                />
            </nav>
        </header>
    )
}

function Menu({ opciones = [], activo, onChanged }) {
    const clickHandler = (index, ev) => {
        ev.preventDefault()
        // activo=index; NO
        if (onChanged) onChanged(index)
    }
    return (
        <>
            {opciones.map((item, index) => (
                <a
                    key={index}
                    className={activo === index ? 'link-success me-2' : 'me-2'}
                    href={item.url}
                    onClick={ev => clickHandler(index, ev)}
                    >
                    {item.texto}
                </a>
            ))}
        </>
    )
}
{/* <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">
      Navbar
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">
            Home
          </a>
        </li>
      </ul>
    </div>
  </div>
</nav> */}
