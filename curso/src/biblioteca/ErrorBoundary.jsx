import React from 'react'

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
        this.cierra.bind(this)
    }
    // static getDerivedStateFromError(error) {  // Actualiza el estado para que el siguiente renderizado lo muestre
    //     return { hasError: true };
    // }
    componentDidCatch(error, info) {
        // También puedes registrar el error en un servicio de reporte de errores
        this.setState({ hasError: true, error: error, errorInfo: info })
    }
    cierra() {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        })
    }
    render() {
        if (this.state.hasError) {
            // Puedes renderizar cualquier interfaz de repuesto
            return (
                <div className="alert alert-danger alert-dismissible" role="alert">
                    <div className="d-flex align-items-center">
                        <svg
                            width={40}
                            height={40}
                            role="img"
                            aria-label="Danger:"
                            className={`bi flex-shrink-0 me-2 text-danger`}>
                            <use href="/notification-sprite.svg#exclamation-triangle-fill"></use>
                        </svg>
                        <h1 className="text-danger">ERROR</h1>
                    </div>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => this.cierra()}
                    />
                    <div>
                        {this.state.error && (
                            <p>
                                <strong>Error:</strong>{' '}
                                {this.state.error.toString()}
                            </p>
                        )}
                        {this.state.errorInfo && (
                            <>
                                <p>
                                    <strong>Error Info:</strong>
                                </p>
                                {this.state.errorInfo.componentStack
                                    .split('\n')
                                    .map((l, i) => (
                                        <div key={i}>{l}</div>
                                    ))}
                            </>
                        )}
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}
