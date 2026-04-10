import './comunes.css'

export function Paginator({
    currentPage,
    totalPages,
    maxPagesVisibles = 10,
    onPageChange,
}) {
    if (totalPages < 2) return null
    const paginas = []
    let primeraPaginaVisible = 0
    let ultimaPaginaVisible = totalPages
    if (ultimaPaginaVisible > maxPagesVisibles) {
        const mitadDelNumeroDePaginasVisibles = Math.floor(maxPagesVisibles / 2)
        primeraPaginaVisible = Math.max(
            0,
            currentPage - mitadDelNumeroDePaginasVisibles + 1,
        )
        ultimaPaginaVisible = Math.min(
            totalPages,
            currentPage + mitadDelNumeroDePaginasVisibles,
        )
        // Ajustar el rango si está cerca del principio o del final
        if (ultimaPaginaVisible - primeraPaginaVisible < maxPagesVisibles) {
            if (primeraPaginaVisible === 0) {
                ultimaPaginaVisible = Math.min(
                    totalPages,
                    primeraPaginaVisible + maxPagesVisibles,
                )
            } else if (ultimaPaginaVisible === totalPages) {
                primeraPaginaVisible = Math.max(
                    1,
                    totalPages - maxPagesVisibles,
                )
            }
        }
    }
    let click = (number, ev) => {
        ev.preventDefault()
        if (onPageChange) onPageChange(number)
    }
    paginas.push(
        <li
            key="First"
            className={currentPage === 0 ? 'page-item disabled' : 'page-item'}
            aria-label="First">
            <a href="." className="page-link" onClick={click.bind(this, 0)}>
                &laquo;
            </a>
        </li>,
    )
    paginas.push(
        <li
            key="Previous"
            className={currentPage > 1 ? 'page-item' : 'page-item disabled'}
            aria-label="Previous">
            <a
                href="."
                className="page-link"
                onClick={click.bind(this, currentPage - 1)}>
                &lt;
            </a>
        </li>,
    )
    if (primeraPaginaVisible !== 0)
        // mostrar elipsis inicial
        paginas.push(
            <li
                key="Elipsis-Before"
                className="page-item disabled"
                aria-label="Elipsis">
                <a href="." className="page-link">
                    &hellip;
                </a>
            </li>,
        )
    for (let i = primeraPaginaVisible; i < ultimaPaginaVisible; i++)
        paginas.push(
            <li
                key={'Page-' + i}
                className={
                    i === currentPage ? 'page-item active' : 'page-item'
                }>
                <a
                    href="."
                    {...(i === currentPage ? { 'aria-current': 'page' } : {})}
                    className="page-link"
                    onClick={click.bind(this, i)}>
                    {i + 1}
                </a>
            </li>,
        )
    if (ultimaPaginaVisible < totalPages)
        // mostrar elipsis final
        paginas.push(
            <li
                key="Elipsis-After"
                className="page-item disabled"
                aria-label="Elipsis">
                <a href="." className="page-link">
                    &hellip;
                </a>
            </li>,
        )
    paginas.push(
        <li
            key="Next"
            className={
                currentPage < totalPages - 1
                    ? 'page-item'
                    : 'page-item disabled'
            }
            aria-label="Next">
            <a
                href="."
                className="page-link"
                onClick={click.bind(this, currentPage + 1)}>
                &gt;
            </a>
        </li>,
    )
    paginas.push(
        <li
            key="Last"
            className={
                currentPage < totalPages - 1
                    ? 'page-item'
                    : 'page-item disabled'
            }
            aria-label="Last">
            <a
                href="."
                className="page-link"
                onClick={click.bind(this, totalPages - 1)}>
                &raquo;
            </a>
        </li>,
    )
    //   console.log({
    //     primeraPaginaVisible,
    //     currentPage,
    //     ultimaPaginaVisible,
    //     totalPages,
    //   });
    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-end">{paginas}</ul>
        </nav>
    )
}
