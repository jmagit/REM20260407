import './App.css'
import Home from './ejemplos/home/home'
import { Demos } from './ejemplos/demos'
import { Footer, Header } from './layout'
import React, { useState } from 'react'

const opcionesDelMenu = [
    { texto: 'inicio', url: '/inicio', componente: <Home /> },
    { texto: 'demos', url: '/demos', componente: <Demos /> },
    // {texto: '', url: '', componente: <></>},
]

function App() {
    const [seleccionado, setSeleccionado] = useState(0)

    return (
        <>
            <Header
                menu={opcionesDelMenu}
                activo={seleccionado}
                onMenuChange={opc => setSeleccionado(opc)}
            />
            <Cuerpo titulo={<i>{opcionesDelMenu[seleccionado].texto}</i>}>
                <ErrorBoundary>
                    {opcionesDelMenu[seleccionado].componente}
                </ErrorBoundary>
            </Cuerpo>
            <Footer />
        </>
    )
}

function Cuerpo({ titulo = 'Sin titulo', children }) {
    return [
        <h1>{titulo}</h1>,
        <main className="container-fluid">{children}</main>,
    ]
}
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }
    static getDerivedStateFromError(error) {
        // Actualiza el estado para que el siguiente renderizado lo muestre
        return { hasError: true }
    }
    componentDidCatch(error, info) {
        // También puedes registrar el error en un servicio de reporte de errores
        this.setState({ hasError: true, error: error, errorInfo: info })
    }
    render() {
        if (this.state.hasError) {
            // Puedes renderizar cualquier interfaz de repuesto
            return (
                <div className="alert alert-danger">
                    <h1>ERROR</h1>
                    {this.state.error && (
                        <p>
                            <strong>error:</strong>
                            {this.state.error.toString()}
                        </p>
                    )}
                    {this.state.errorInfo && (
                        <p>
                            <strong>errorInfo:</strong>
                            {this.state.errorInfo.componentStack}
                        </p>
                    )}
                </div>
            )
        }
        return this.props.children
    }
}

export default App
