import { useRef, useState, useEffect } from 'react'
import { ErrorBoundary } from '../biblioteca'
import { Calculadora } from '../ejercicios'
import { Authentication } from './authentication'

export function Demos() {
    const init = useRef(10)
    const [punto, setPunto] = useState({ x: 0, y: 0 })
    const [linea, setLinea] = useState({
        ini: { x: 0, y: 0 },
        fin: { x: 0, y: 0 },
    })
    const [valor, setValor] = useState(init.current)
    const [activo, setActivo] = useState(true)
    const click = () => {
        setPunto({ ...punto, x: 1 })
        let aux = { ...punto }
        aux.x += 1
        setPunto(aux)
        aux = { ...linea }
        aux = { ini: { ...linea.ini }, fin: { ...linea.ini } }
        aux = JSON.parse(JSON.stringify(linea))
        a.ini.x = 10
        if (aux.ini.x === linea.ini.x) {
        }
        // prev
        setLinea(aux)
    }
    const parte = () => {
        let aux = { ...punto }
        aux.x += 1
        setPunto(prev => ({ ...prev, x: prev.x + 1 }))
    }

    return (
        <div>
            <title>Demos</title>
            {/* <ErrorBoundary>Punto: {punto.x}</ErrorBoundary>
            <input type="button" value="null" onClick={() => setPunto(null)} />
            <input
                type="button"
                value="not null"
                onClick={() => setPunto({ x: 0, y: 0 })}
            /> */}
            <Contador
                init={init.current}
                delta={1}
                onChange={v => setValor(v)}
            />
            <output>El valor actual es: {valor}</output>
            <Calculadora init={init.current} onChange={v => setValor(v)} />
            <br />
            <output>El init actual es: {init.current}</output>
            <input type="button" value="+" onClick={() => init.current++} />
            {/* <Coordenadas activo={activo} /> */}
            <div>
                <input
                    type="button"
                    value={activo ? 'desactivar' : 'activar'}
                    onClick={() => setActivo(prev => !prev)}
                />
                <VideoPlayer
                    isPlaying={activo}
                    src="https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4"
                />
            </div>
        </div>
    )
}

function Contador({ init = 0, delta = 1, onChange }) {
    const [count, setCount] = useState(init)

    function cambia(delta) {
        setCount(prev => {
            let aux = prev + delta
            if (onChange) onChange(aux)
            return aux
        })
    }
    const sube = () => {
        cambia(delta)
        cambia(delta)
    }
    const baja = () => cambia(-delta)

    return (
        <div>
            <input type="button" value="+" onClick={sube} />
            <output>{count}</output>
            <input type="button" value="-" onClick={baja} />
        </div>
    )
}

function Coordenadas(props) {
    const [coordenadas, setCoordenadas] = useState({
        latitud: null,
        longitud: null,
    })

    // useEffect(
    //     () => {
    //         window.navigator.geolocation.getCurrentPosition(pos => {
    //             setCoordenadas({
    //                 latitud: pos.coords.latitude,
    //                 longitud: pos.coords.longitude,
    //             })
    //         })
    //     }
    // )

    useEffect(() => {
        let watchId = window.navigator.geolocation.watchPosition(pos => {
            setCoordenadas({
                latitud: pos.coords.latitude,
                longitud: pos.coords.longitude,
            })
        })
        return () => window.navigator.geolocation.clearWatch(watchId)
    }, [props.activo])

    return (
        <div>
            <h1>Coordenadas</h1>
            {coordenadas?.latitud == null ? (
                <div className="alert alert-warning">Cargando ...</div>
            ) : (
                <>
                    <h2>Latitud: {coordenadas.latitud}</h2>
                    <h2>Longitud: {coordenadas.longitud}</h2>
                </>
            )}
        </div>
    )
}

// https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4
// https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4
function VideoPlayer({ src, isPlaying }) {
    const refVideo = useRef(null)
    const refPause = useRef(null)

    useEffect(() => {
        refPause.current.focus()
    }, [])

    useEffect(() => {
        if (isPlaying) {
            refVideo.current.play()
        } else {
            refVideo.current.pause()
        }
    }, [isPlaying])

    const play = () => refVideo.current.play()
    const pause = () => refVideo.current.pause()

    return (
        <div>
            <div className="btn-group">
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={play}>
                    play
                </button>
                <button
                    ref={refPause}
                    type="button"
                    className="btn btn-warning"
                    onClick={pause}>
                    pause
                </button>
                <Authentication />
            </div>
            <div>
                <video ref={refVideo} src={src} />
            </div>
        </div>
    )
}
