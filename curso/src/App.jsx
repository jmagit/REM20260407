import './App.css'
import { ErrorBoundary } from './biblioteca'
import { AuthContext, AuthDispatchContext, authReducer, Crud, defaultAuthContext, Demos, DemosHooks } from './ejemplos'
import Contactos from './ejemplos/contactos'
import Home from './ejemplos/home/home'
import { Calculadora } from './ejercicios'
import { Footer, Header } from './layout'
import React, { useReducer, useState } from 'react'

const opcionesDelMenu = [
    { texto: 'inicio', url: '/inicio', componente: <Home /> },
    { texto: 'demos', url: '/demos', componente: <Demos /> },
    {
        texto: 'calculadora',
        url: '/chisme/de/hacer/numeros',
        componente: <Calculadora coma />,
    },
    { texto: 'formularios', url: '/formularios', componente: <Crud /> },
    { texto: 'contactos', url: '/contactos', componente: <Contactos /> },
    { texto: 'async', url: '/async', componente: <DemosHooks /> },
    // {texto: '', url: '', componente: <></>},
]

function App() {
    const [seleccionado, setSeleccionado] = useState(0)
    const [auth, dispatch] = useReducer(authReducer, defaultAuthContext)

    return (
        <>
            <AuthContext.Provider value={auth}>
                <AuthDispatchContext.Provider value={dispatch}>
                    <Header
                        menu={opcionesDelMenu}
                        activo={seleccionado}
                        onMenuChange={opc => setSeleccionado(opc)}
                    />
                    <Cuerpo
                        titulo={<i>{opcionesDelMenu[seleccionado].texto}</i>}>
                        <ErrorBoundary>
                            {opcionesDelMenu[seleccionado].componente}
                        </ErrorBoundary>
                    </Cuerpo>
                    <Footer />
                </AuthDispatchContext.Provider>
            </AuthContext.Provider>
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
            <main
                className="container-fluid text-start"
                style={{ marginBottom: 60 }}>
                {children}
            </main>
        </>
    )
}

export default App
