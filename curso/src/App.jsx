import './App.css'
import Home from './ejemplos/home/home'
import { Demos } from './ejemplos/demos'
import { Footer, Header } from './layout'

const opcionesDelMenu = [
  {texto: 'inicio', url: '/inicio', componente: <Home />},
  {texto: 'demos', url: '/demos', componente: <Demos />},
  // {texto: '', url: '', componente: <></>},
]
function App() {

  return (
    <>
      <Header menu={opcionesDelMenu} />
      <main>
        {/* <Home /> */}
        <Demos />
      </main>
      <Footer />
    </>
  )
}

export default App
