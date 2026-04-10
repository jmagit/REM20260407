import React, { useEffect, useState, useTransition } from 'react'
import {
    ErrorMessage,
    Esperando,
    Paginator,
} from '../biblioteca'
// import { Paginator } from 'primereact/paginator';

function Ficha(props) {
    // {"id":"0","author":"Alejandro Escamilla","width":5000,"height":3333,"url":"","download_url":"","visible":false}
    return (
        <div className="card m-1" style={{ width: '14rem' }}>
            {props.visible && (
                <img
                    src={props.download_url}
                    className="card-img-top"
                    alt={`Foto ${props.id} de ${props.author}`}
                    onClick={() => props.onVer && props.onVer(props.id)}
                />
            )}
            <div className="card-body">
                <h5 className="card-title">{props.author}</h5>
                {!props.visible && (
                    <div className="card-text">
                        <p>
                            Dimensión: {props.width}x{props.height}
                        </p>
                        <p>
                            <a
                                href={props.url}
                                target="_blank"
                                rel="noreferrer"
                                title={`Saber mas de la foto ${props.id}`}>
                                Saber mas
                            </a>
                        </p>
                        <input
                            type="button"
                            value="Ver foto"
                            className="btn btn-primary"
                            onClick={() => props.onVer && props.onVer(props.id)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default function Muro() {
    const [loading, startLoading] = useTransition()
    const [errorMsg, setErrorMsg] = useState('')
    const [listado, setListado] = useState([])
    const [pagina, setPagina] = useState(1)
    const [rows, setRows] = useState(20)
    const totalRecords = 1000

    useEffect(() => {
        startLoading(async () => {
            setErrorMsg('')
            fetch(
                `https://picsum.photos/v2/list?page=${pagina}&limit=${rows}`,
            ).then(
                resp => {
                    if (resp.ok) {
                        resp.json()
                            .then(data => {
                                setListado(
                                    data.map(item => ({
                                        ...item,
                                        visible: false,
                                    })),
                                )
                            })
                            .catch(err =>
                                setErrorMsg(`Error formato del body: ${err}`),
                            )
                    } else {
                        // Error de petición
                        console.error(`${resp.status} - ${resp.statusText}`)
                        setErrorMsg(`${resp.status} - ${resp.statusText}`)
                    }
                },
                err => {
                    // Error de cliente
                    setErrorMsg('Error de petición')
                    console.error(err)
                },
            )
        })
    }, [pagina, rows])

    function load(pagina = 0, filas = 20) {
        setPagina(pagina)
        setRows(filas)
    }
    function mostrar(indice) {
        // listado[indice].visible = !listado[indice].visible;
        // setListado([...listado])
        setListado(
            listado.map((item, index) =>
                indice === index ? { ...item, visible: !item.visible } : item,
            ),
        )
    }

    if (loading) return <Esperando />
    return (
        <div>
            {errorMsg && (
                <ErrorMessage msg={errorMsg} onClear={() => setErrorMsg('')} />
            )}
            <title>Muro</title>
            <main className="container-fluid">
                <div className="d-flex flex-row align-items-start">
                    <select
                        className="form-select"
                        aria-label="Default rows numbers"
                        value={rows}
                        onChange={ev => setRows(ev.target.value)}
                        >
                        {[10, 20, 30, 75, 100].map(item => (
                            <option key={item} value={item}>
                                {item} imágenes
                            </option>
                        ))}
                    </select>
                    <Paginator
                        currentPage={pagina - 1}
                        totalPages={Math.ceil(totalRecords / rows)}
                        maxPagesVisibles={10}
                        onPageChange={ev => load(ev + 1, rows)}
                    />
                </div>
                <div className="row">
                    {listado.map((item, index) => (
                        <Ficha
                            key={item.id}
                            {...item}
                            onVer={() => mostrar(index)}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}
