export function Esperando() {
    return (
        <>
            <div className="fondo-sombreado"></div>
            <div className="loader"></div>
            {/* <img className="ajax-wait" src={loadingImage} alt="Cargando ..." /> */}
        </>
    )
}
export function Fallback({ message = 'Esperando ...' }) {
    return (
        <div className="alert alert-primary d-flex align-items-center" role="alert">
            <img src={loadingImage} width={40} height={40} alt="Cargando ..." />
            <h1 className='ms-2'>{message}</h1>
        </div>
    )
}

export function ValidationMessage({ msg }) {
    if (msg) {
        return <output className="invalid-feedback">{msg}</output>
    }
    return null
}

export function ActionMessage({ msg }) {
    if (msg) {
        return <output className="errorMsg">{msg}</output>
    }
    return null
}

export function ErrorMessage({ msg, onClear }) {
    if (msg) {
        return (
            <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert">
                {msg}
                <button
                    type="button"
                    className="btn-close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={_e => onClear && onClear()}
                />
            </div>
        )
    }
    return null
}

export function ErrorMessageModal({ msg, tipo = 'error', onClear }) {
    let sufijo, simbolo, ariaLabel
    switch (tipo) {
        case 'warn':
            sufijo = 'warning'
            simbolo = 'exclamation-triangle-fill'
            ariaLabel = 'Warning'
            break
        case 'info':
            sufijo = 'primary'
            simbolo = 'info-fill'
            ariaLabel = 'Info'
            break
        case 'log':
            sufijo = 'success'
            simbolo = 'check-circle-fill'
            ariaLabel = 'Log'
            break
        default:
            sufijo = 'danger'
            simbolo = 'forbiben-circle-fill'
            ariaLabel = 'Danger'
            break
    }
    if (msg) {
        return (
            <>
                <div className="fondo-sombreado"></div>
                <div
                    tabIndex={-1}
                    className="modal fade show"
                    data-bs-backdrop="static"
                    aria-hidden="false"
                    style={{ display: 'block', zIndex: 9001 }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div
                                className={`modal-header bg-gradient text-white bg-${sufijo}`}>
                                <h5
                                    id="exampleModalLabel"
                                    className="modal-title">
                                    Notificaciones
                                </h5>
                                <button
                                    type="button"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    className="btn-close"
                                    onClick={_e => onClear && onClear()}
                                />
                            </div>
                            <div className="modal-body bg-light bg-gradient p-0">
                                <div
                                    role="alert"
                                    className={`m-0 p-3 alert alert-${sufijo} d-flex align-items-center rounded-0`}>
                                    <svg
                                        width={24}
                                        height={24}
                                        role="img"
                                        aria-label={ariaLabel}
                                        className={`bi flex-shrink-0 me-2 text-${sufijo}`}>
                                        <use
                                            href={`/notification-sprite.svg#${simbolo}`}></use>
                                    </svg>
                                    <div>{msg}</div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light bg-gradient">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={_e => onClear && onClear()}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return null
}

export function UlGlimmer({ lines = 4 }) {
    return (
        <ul>
            {[...'x'.repeat(lines)].map((_, index) => (
                <li key={index} className="glimmer" />
            ))}
        </ul>
    )
}
