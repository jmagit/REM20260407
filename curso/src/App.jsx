import './App.css'
import { ErrorBoundary } from './biblioteca'
import { Demos } from './ejemplos'
import Home from './ejemplos/home/home'
import { Calculadora } from './ejercicios'
import { Footer, Header } from './layout'
import React, { useState } from 'react'

const opcionesDelMenu = [
    { texto: 'inicio', url: '/inicio', componente: <Home /> },
    { texto: 'demos', url: '/demos', componente: <Demos /> },
    { texto: 'calculadora', url: '/chisme/de/hacer/numeros', componente: <Calculadora coma /> },
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
    // MALA PRACTICA
    // return [
    //     <h1>{titulo}</h1>,
    //     <main className="container-fluid">{children}</main>,
    // ]
    return (
        <>
            <h1>{titulo}</h1>
            <main className="container-fluid text-start" style={{ marginBottom: 50 }}>{children}</main>
        </>
    )
}

export default App
