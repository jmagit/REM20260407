export function Header(props) {
    return (
        <header>
            <nav>
                <Menu opciones={props.menu} />
            </nav>
        </header>
    )
}

function Menu({opciones = []}) {
    return (
        <>
            {opciones.map((item, index) => (
                <a key={index} className='me-2' href={item.url}>{item.texto}</a>
            ))}
        </>
    )
}