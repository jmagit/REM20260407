import {
    lazy,
    Suspense,
    use,
    useDeferredValue,
    useEffect,
    useMemo,
    useOptimistic,
    useState,
    useTransition,
} from 'react'
import {
    ErrorMessage,
    ErrorMessageModal,
    Fallback,
    Paginator,
    UlGlimmer,
} from '../biblioteca'

const MuroLazy = lazy(() => delayForDemo(import('../ejercicios/muro')))

export function DemosHooks() {
    const [ejemplo, setEjemplo] = useState(0)
    const ejemplos = [
        { ejemplo: 'Notificaciones', componente: <Notificaciones /> },
        { ejemplo: 'Transiciones', componente: <Transiciones /> },
        { ejemplo: 'Optimistas y Deferred', componente: <TransicionesOptimistasDeferred /> },
        // { ejemplo: 'Deferred Value', componente: <DeferredValue /> },
        { ejemplo: 'Suspender', componente: <SuspenseWithUse /> },
        { ejemplo: 'Lazy', componente: <SuspenseWithLazy /> },
    ]
    return (
        <>
            <nav className="btn-group mb-3">
                {ejemplos.map((item, index) => (
                    <button
                        className="btn btn-outline-primary"
                        key={index}
                        onClick={() => setEjemplo(index)}>
                        {item.ejemplo}
                    </button>
                ))}
            </nav>
            <main>{ejemplos[ejemplo].componente}</main>
        </>
    )
}

function Notificaciones() {
    const [errorMsg, setErrorMsg] = useState({})
    return (
        <>
            <ErrorMessageModal
                {...errorMsg}
                onClear={() => setErrorMsg(null)}
            />
            <div className="btn-group">
                <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => {
                        setErrorMsg({ msg: 'es un error' })
                    }}>
                    error
                </button>
                <button
                    className="btn btn-warning"
                    type="button"
                    onClick={() =>
                        setErrorMsg({ msg: 'es un warn', tipo: 'warn' })
                    }>
                    warn
                </button>
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() =>
                        setErrorMsg({ msg: 'es un info', tipo: 'info' })
                    }>
                    info
                </button>
                <button
                    className="btn btn-success"
                    type="button"
                    onClick={() =>
                        setErrorMsg({ msg: 'es un log', tipo: 'log' })
                    }>
                    log
                </button>
            </div>
        </>
    )
}
function Transiciones() {
    const [pagina, setPagina] = useState(0)
    const [isPending, startTransition] = useTransition()
    const [listado, setListado] = useState([])
    const [errorMsg, setErrorMsg] = useState('')
    const [url, setUrl] = useState('https://picsum.photos')
    const fetchData = page =>
        startTransition(async () => {
            setErrorMsg('')
            try {
                const resp = await delayForDemo(
                    fetch(`${url}/v2/list?page=${page + 1}&limit=10`),
                )
                if (!resp.ok) {
                    setErrorMsg(
                        `Error respuesta: ${resp.status} - ${resp.statusText}`,
                    )
                    return
                }
                const data = await resp.json()
                setListado(data)
            } catch (error) {
                setErrorMsg(`Error de petición: ${error.message}`)
            }
        })

    useEffect(() => {
        fetchData(0)
    }, [])

    const pageChange = page => {
        setPagina(page)
        setErrorMsg('')
        fetchData(page)
    }

    return (
        <>
            <ErrorMessage msg={errorMsg} onClear={() => setErrorMsg('')} />
            <div className="d-flex">
                <input
                    className="form-control"
                    type="url"
                    value={url}
                    onChange={ev => setUrl(ev.target.value)}
                />
                <Paginator
                    currentPage={pagina}
                    totalPages={100}
                    maxPagesVisibles={10}
                    onPageChange={pageChange}
                />
            </div>
            {isPending ? (
                <UlGlimmer lines={8} />
            ) : (
                <ul>
                    {listado.map(item => (
                        <li key={item.id}>
                            <a href={item.url}>
                                {item.author} ({item.id})
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}
function TransicionesOptimistasDeferred() {
    const opciones = [5, 10, 20, 30, 50]
    const [rows, setRows] = useState(20)
    const [resultado, setResultado] = useState('(sin resultado)')
    const [errorMsg, setErrorMsg] = useState('')
    const [isPending, startTransition] = useTransition()
    const [optimisticState, generateNextState] = useOptimistic(
        resultado,
        (currentState, optimisticValue) => {
            return optimisticValue // combina y devuelve el nuevo estado con el valor optimista
        },
    )
    const totalRows = 200
    const deferredResultado = useDeferredValue(resultado, '(sin consultar)')

    const consultar = () => {
        setErrorMsg('')
        startTransition(async () => {
            generateNextState(`${Math.ceil(totalRows / rows)} (optimista)`)
            const resp = await delayForDemo(
                fetch(
                    `http://localhost:4321/api/contactos?_page=count&_rows=${rows}`,
                ),
            )
            if (!resp.ok) {
                setErrorMsg(`${resp.status} - ${resp.statusText}`)
                return
            }
            // {"pages": 11,"rows": 101}
            const data = await resp.json()
            setResultado(`${data.pages} (definitivo)`)
        })
    }
    const cambiar = ev => {
        const value = ev.target.value
        setRows(value)
        setErrorMsg('')
        startTransition(async () => {
            const resp = await delayForDemo(
                fetch(
                    `http://localhost:4321/api/contactos?_page=count&_rows=${value}`,
                ),
            )
            if (!resp.ok) {
                setErrorMsg(`${resp.status} - ${resp.statusText}`)
                return
            }
            // {"pages": 11,"rows": 101}
            const data = await resp.json()
            setResultado(`${data.pages} (definitivo)`)
        })
    }

    return (
        <>
            <h2>Transiciones optimistas y en diferido</h2>
            <div className="d-flex flex-row align-items-center gx-2 gy-2">
                <label className="me-2">Rows:</label>
                <input
                    className="me-2"
                    type="number"
                    value={rows}
                    onChange={ev => setRows(ev.target.value)}
                />
                <input
                    className="me-2"
                    type="button"
                    value="optimista"
                    onClick={consultar}
                />
                <label className="me-2">Deferred (onChange):</label>
                <select
                    className="me-2"
                    value={rows}
                    onChange={cambiar}>
                    {opciones.map(item => (
                        <option key={item}>{item}</option>
                    ))}
                </select>
                {isPending && (
                    <span className="me-2 text-success">Consultando ...</span>
                )}
                {errorMsg && (
                    <output
                        className="me-2 text-danger"
                        style={{ color: 'red' }}>
                        ERROR: {errorMsg}
                    </output>
                )}
            </div>
            <h5 className="mt-2">Resultados:</h5>
            <dl className="list-inline">
                <dt>rows</dt>
                <dd>{rows}</dd>
                <dt>state</dt>
                <dd>{isPending ? 'Consultando ...' : resultado}</dd>
                <dt>optimistic</dt>
                <dd>{optimisticState}</dd>
                <dt>deferred</dt>
                <dd>{deferredResultado}</dd>
            </dl>
        </>
    )
}

function DeferredValue() {
    const opciones = [5, 10, 20, 30, 50]
    const [rows, setRows] = useState(20)
    const deferredRows = useDeferredValue(rows)

    return (
        <>
            <div className="d-flex flex-row align-items-center gx-2 gy-2">
                <label className="me-2">Rows:</label>
                <select
                    className="me-2"
                    value={rows}
                    onChange={ev => {
                        setRows(ev.target.value)
                    }}>
                    {opciones.map(item => (
                        <option key={item}>{item}</option>
                    ))}
                </select>
                <DeferredValueResult rows={deferredRows} />
            </div>
        </>
    )
}

function DeferredValueResult({ rows }) {
    const items = useMemo(() => {
        const list = []
        for (let i = 0; i < rows; i++) {
            list.push(
                <li key={i}>
                    Resultado {i} de {rows}
                </li>,
            )
        }
        return list
    }, [rows])

    return <ul className="opacity-50 transition-opacity">{items}</ul>
}

// function DeferredValue() {
//     const opciones = [5, 10, 20, 30, 50]
//     const [rows, setRows] = useState(20)
//     const deferredRows = useDeferredValue(rows)

//     return (
//         <>
//             <div className="d-flex flex-row align-items-center gx-2 gy-2">
//                 <label className="me-2">Rows:</label>
//                 <select
//                     className="me-2"
//                     value={rows}
//                     onChange={ev => {
//                         setRows(ev.target.value)
//                     }}>
//                     {opciones.map(item => (
//                         <option key={item}>{item}</option>
//                     ))}
//                 </select>
//             {/* <Suspense
//                 fallback={
//                     <Fallback message="⌛ Actualizando el componente..." />
//                 }> */}
//                 <DeferredValueResult rows={rows} />
//             {/* </Suspense>{' '} */}
//             </div>
//         </>
//     )
// }

// function deferredValue(rows) {
//       return new Promise(resolve =>
//             setTimeout(() => {
//                 const list = []
//                 for (let i = 0; i < rows; i++) {
//                     list.push(
//                         <li key={i}>
//                             Resultado {i} de {rows}
//                         </li>,
//                     )
//                 }
//                 resolve(list)
//             }, 1000),
//         )
// }

// function DeferredValueResult({ rows }) {
//     // const items = useMemo(() => {
//     //     const list = []
//     //     for (let i = 0; i < rows; i++) {
//     //         list.push(
//     //             <li key={i}>
//     //                 Resultado {i} de {rows}
//     //             </li>,
//     //         )
//     //     }
//     //     return list
//     // }, [rows])
//     const [promesa, setPromesa] = useState(async () => await deferredValue(rows), [rows])
//     const items = use(promesa)
//     if(items)
//         return <ul className="opacity-50 transition-opacity">{items}</ul>
//     return <UlGlimmer />
// }

function SuspenseWithUse() {
    const [messagePromise, setMessagePromise] = useState(null)
    const [show, setShow] = useState(false)
    function downloadOK() {
        setMessagePromise(fetchMessageOK())
        setShow(true)
    }
    function downloadKO() {
        setMessagePromise(fetchMessageKO())
        setShow(true)
    }

    if (show) {
        return (
            <>
                <MessageContainer messagePromise={messagePromise} />
                <button className="btn btn-info" onClick={() => setShow(false)}>
                    Reset
                </button>
            </>
        )
    } else {
        return (
            <>
                <button className="btn btn-success" onClick={downloadOK}>
                    Descargar mensaje
                </button>
                <button className="btn btn-danger" onClick={downloadKO}>
                    Fallar mensaje
                </button>
            </>
        )
    }
}

function MessageContainer({ messagePromise }) {
    return (
        <Suspense
            fallback={<Fallback message="⌛ Descargando el mensaje..." />}>
            <Message messagePromise={messagePromise} />
        </Suspense>
    )
}

function Message({ messagePromise }) {
    const content = use(messagePromise)
    return (
        <div class="alert alert-warning" role="alert">
            <strong>Mensaje:</strong> {content}
        </div>
    )
}

function fetchMessageOK() {
    return new Promise(resolve =>
        setTimeout(resolve, 1000, '✅ Promesa resuelta'),
    )
}
function fetchMessageKO() {
    return new Promise((resolve, reject) => setTimeout(reject, 1000)).catch(
        () => {
            return '❌ Promesa rechazada'
        },
    )
}

function SuspenseWithLazy() {
    return (
        <>
            <h2>Carga perezosa</h2>
            <Suspense
                fallback={
                    <Fallback message="⌛ Descargando el componente..." />
                }>
                <MuroLazy />
            </Suspense>{' '}
        </>
    )
}

function delayForDemo(promise, ms = 2000) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    }).then(() => promise)
}
