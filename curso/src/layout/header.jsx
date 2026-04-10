import imgLogo from '../assets/logo.png'
import { Authentication } from '../ejemplos/authentication'

export function Header(props) {
    const menuClick = (indice, ev) => {
        ev.preventDefault()
        if (props.onMenuChange) props.onMenuChange(indice)
    }
    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a
                        className="navbar-brand"
                        href="/"
                        onClick={ev => menuClick(0, ev)}>
                        <img
                            src={imgLogo}
                            alt="Logotipo corporativo"
                            height={40}
                        />
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent">
                        <Menu
                            opciones={props.menu}
                            activo={props.activo}
                            onChanged={props.onMenuChange}
                        />
                        <Authentication />
                    </div>
                </div>
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
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {opciones.map((item, index) => (
                <li key={index} className="nav-item">
                    <a
                        className={
                            activo === index ? 'nav-link active' : 'nav-link'
                        }
                        href={item.url}
                        onClick={ev => clickHandler(index, ev)}>
                        {item.texto}
                    </a>
                </li>
            ))}
        </ul>
    )
}

// VERSION ORIGINAL

// export function Header(props) {
//     return (
//         <header>
//             <nav>
//                 <Menu
//                     opciones={props.menu}
//                     activo={props.activo}
//                     onChanged={props.onMenuChange}
//                 />
//             </nav>
//         </header>
//     )
// }

// function Menu({ opciones = [], activo, onChanged }) {
//     const clickHandler = (index, ev) => {
//         ev.preventDefault()
//         // activo=index; NO
//         if (onChanged) onChanged(index)
//     }
//     return (
//         <>
//             {opciones.map((item, index) => (
//                 <a
//                     key={index}
//                     className={activo === index ? 'link-success me-2' : 'me-2'}
//                     href={item.url}
//                     onClick={ev => clickHandler(index, ev)}
//                     >
//                     {item.texto}
//                 </a>
//             ))}
//         </>
//     )
// }
