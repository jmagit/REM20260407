import { useRef, useState, useEffect } from 'react';

export function Demos() {
    const init = useRef(10)
    const [punto, setPunto] = useState({x: 0, y: 0});
    const [linea, setLinea] = useState({ini: {x: 0, y: 0}, fin: {x: 0, y: 0}});
    const [valor, setValor] = useState(init.current)
    const [activo, setActivo] = useState(true)
    const click = () => {
        setPunto({...punto, x: 1})
        let aux = {...punto}
        aux.x += 1;
        setPunto(aux)
        aux = {...linea}
        aux = {ini: {...linea.ini}, fin: {...linea.ini} }
        aux = JSON.parse(JSON.stringify(linea))
        a.ini.x = 10
        if(aux.ini.x === linea.ini.x) {}
        // prev
        setLinea(aux)
    }
    const parte = () => {
        let aux = {...punto}
        aux.x += 1;
        setPunto(prev => ({...prev, x: prev.x + 1}))
    }

    return (
        <div>
            <Contador init={init.current} delta={1} onChange={v => setValor(v)} />
            {/* <Contador /> */}
            <output>El valor actual es: {valor}</output><br/>
            <output>El init actual es: {init.current}</output>
            <input type='button' value="+" onClick={() => init.current++} />
            <Coordenadas activo={activo} />
            <input type='button' value="cambia" onClick={() => setActivo(prev => !prev)} />
        </div>
    )
}

function Contador({init=0, delta=1, onChange}) {
    const [count, setCount] = useState(init)

    function cambia(delta) {
        setCount(prev => {
            const aux = prev + delta
            if(onChange) onChange(aux)
            return aux
        })
        if(onChange) onChange()
    }
    const sube = () => { cambia(delta); cambia(delta); }
    const baja = () => cambia(-delta)

    return (
        <div>
            <input type='button' value="+" onClick={sube} />
            <output>{count}</output>
            <input type='button' value="-" onClick={baja} />
        </div>
    )
}

function Coordenadas(props) {
  const [coordenadas, setCoordenadas] = useState({ latitud: null, longitud: null});

  useEffect(() => {
    let watchId = window.navigator.geolocation.watchPosition(pos => {
      setCoordenadas({latitud: pos.coords.latitude, longitud: pos.coords.longitude })
    });
    return () => window.navigator.geolocation.clearWatch(watchId);
  }, [props.activo]);

  return coordenadas.latitud == null ? (<div>Cargando</div>) : (
      <div>
        <h1>Coordenadas</h1>
        <h2>Latitud: {coordenadas.latitud}</h2>
        <h2>Longitud: {coordenadas.longitud}</h2>
      </div>
    );
}
