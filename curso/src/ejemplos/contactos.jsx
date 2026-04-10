import {
    useActionState,
    useEffect,
    useRef,
    useState,
    useTransition,
} from 'react'
import {
    ActionMessage,
    BtnAdd,
    BtnDelete,
    BtnEdit,
    BtnSearch,
    BtnView,
    ErrorMessage,
    ErrorMessageModal,
    Esperando,
    FormButtons,
    Paginator,
    ValidationMessage,
} from '../biblioteca'
import { isBefore } from 'validator'
import imgUserNotFoundFemale from '../assets/user-not-found-female.png'
import imgUserNotFoundMale from '../assets/user-not-found-male.png'

export default function Contactos() {
    const [isPending, startTransition] = useTransition()
    const [modo, setModo] = useState('list')
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
    })
    const [errorMsg, setErrorMsg] = useState('')
    const [listado, setListado] = useState([])
    const [elemento, setElemento] = useState({})
    const idOriginal = useRef(null)
    const [filtro, setFiltro] = useState('')
    const [actionState, searchAction, isSearching] = useActionState(
        async (previousState, formData) => {
            let queryParam = ''
            for (const key of formData.keys()) {
                if (formData.get(key))
                    queryParam += `&${key}=${formData.get(key)}`
            }
            if (queryParam) queryParam += '&_mode=include'
            setFiltro(queryParam)
            try {
                const resp = await fetch(
                    `http://localhost:4321/api/contactos?_page=${pagination.currentPage}&_rows=8&_sort=nombre,apellidos&_projection=id,tratamiento,nombre,apellidos${queryParam}`,
                )
                if (!resp.ok) {
                    return `${resp.status} - ${resp.statusText}`
                }
                const data = await resp.json()
                setListado(data.content)
                setPagination({
                    currentPage: data.number,
                    totalPages: data.totalPages,
                })
                if (!data.totalPages)
                    return 'No se han encontrado coincidencias'
                else if (queryParam)
                    return data.totalElements > 1
                        ? `Se han encontrado ${data.totalElements} coincidencias`
                        : 'Se ha encontrado 1 coincidencia'
            } catch (error) {
                return JSON.stringify(error)
            }
            return null // Sin errores
        },
        null, // Estado inicial del error
    )

    function load(pagina = 0) {
        startTransition(async () => {
            try {
                const resp = await fetch(
                    `http://localhost:4321/api/contactos?_page=${pagina}&_rows=8&_sort=nombre,apellidos&_projection=id,tratamiento,nombre,apellidos${filtro}`,
                )
                if (!resp.ok) {
                    setErrorMsg(`${resp.status} - ${resp.statusText}`)
                    return
                }
                const data = await resp.json()
                setListado(data.content)
                setPagination({
                    currentPage: data.number,
                    totalPages: data.totalPages,
                })
            } catch (error) {
                console.error(error)
            }
        })
    }
    function get(id, onCambiaModo) {
        startTransition(async () => {
            try {
                const resp = await fetch(
                    `http://localhost:4321/api/contactos/${id}`,
                )
                if (!resp.ok) {
                    setErrorMsg(`${resp.status} - ${resp.statusText}`)
                    return
                }
                const data = await resp.json()
                setElemento(data)
                onCambiaModo()
            } catch (error) {
                console.error(error)
            }
        })
    }
    function add() {
        setElemento({ id: 0, sexo: 'H' })
        setModo('add')
    }
    function edit(id) {
        get(id, () => {
            idOriginal.current = id
            setModo('edit')
        })
    }
    function view(id) {
        get(id, () => setModo('view'))
    }
    function remove(id) {
        if (confirm('¿Seguro?'))
            startTransition(async () => {
                const resp = await fetch(
                    `http://localhost:4321/api/contactos/${id}`,
                    { method: 'DELETE' },
                )
                if (!resp.ok) {
                    const error = await resp.json()
                    setErrorMsg(
                        `${resp.status} - ${resp.statusText}: ${JSON.stringify(error)}`,
                    )
                }
                load(pagination.currentPage)
            })
    }
    function cancel() {
        setModo('list')
        load(pagination.currentPage)
    }
    function send(data) {
        startTransition(async () => {
            const init = {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }
            let url = 'http://localhost:4321/api/contactos'
            switch (modo) {
                case 'add':
                    init.method = 'POST'
                    break
                case 'edit':
                    init.method = 'PUT'
                    url += '/' + idOriginal.current
                    break
                default:
                    return
            }
            const resp = await fetch(url, init)
            if (resp.ok) {
                cancel()
                return
            }
            const error = await resp.json()
            setErrorMsg(
                `${resp.status} - ${resp.statusText}: ${JSON.stringify(error)}`,
            )
        })
    }
    useEffect(() => {
        load(pagination.currentPage)
    }, [])

    //   if (isPending) return <Esperando />;
    let componente
    switch (modo) {
        case 'view':
            componente = <ContactosView elemento={elemento} onVolver={cancel} />
            break
        case 'add':
        case 'edit':
            componente = (
                <ContactosForm
                    elemento={elemento}
                    esNuevo={modo === 'add'}
                    onEnviar={e => send(e)}
                    onVolver={cancel}
                    // onBorrar={e => remove(e)}
                />
            )
            break
        default:
            componente = (
                <ContactosList
                    listado={listado}
                    onAdd={add}
                    onEdit={id => edit(id)}
                    onView={id => view(id)}
                    onDelete={id => remove(id)}
                    onPageChange={ev => load(ev)}
                    {...{
                        searchAction,
                        isSearching,
                        actionState,
                        ...pagination,
                    }}
                />
            )
            break
    }
    return (
        <>
            <title>Contactos</title>
            {isPending && <Esperando />}
            {modo !== 'list' && <h1>Contacto</h1>}
            <ErrorMessageModal
                msg={errorMsg}
                onClear={() => setErrorMsg(null)}
            />
            {componente}
        </>
    )
}

function ContactosSearch({ pending, submitAction, status }) {
    const [elemento, setElemento] = useState({ nombre: '', apellidos: '' })
    const formSearch = useRef(null)
    const handleChange = ev => {
        const cmp = ev.target.name
        const value =
            ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value
        setElemento(prev => ({ ...prev, [cmp]: value }))
    }
    const handleReset = event => {
        setElemento({ nombre: '', apellidos: '' })
        // formSearch.current.reset() // no aplicable a componentes controlado
        Object.keys(elemento).forEach(
            control => (formSearch.current[control].value = ''),
        )
        formSearch.current.requestSubmit()
    }
    return (
        <form
            ref={formSearch}
            action={submitAction}
            noValidate
            className={
                'row gy-2 gx-2 align-items-start shadow p-1 mb-3 bg-body-tertiary rounded' +
                (pending ? ' opacity-50' : '')
            }>
            <div className="form-floating col-auto flex-fill">
                <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    placeholder=" "
                    className="form-control"
                    value={elemento.nombre}
                    onChange={handleChange}
                />
                <label htmlFor="nombre">Nombre:</label>
            </div>
            <div className="form-floating col-auto flex-fill">
                <input
                    type="text"
                    name="apellidos"
                    id="apellidos"
                    placeholder=" "
                    className="form-control"
                    value={elemento.apellidos}
                    onChange={handleChange}
                />
                <label htmlFor="apellidos">Apellidos:</label>
            </div>
            <div className="align-middle col-auto btn-group align-self-stretch">
                <BtnSearch label="Buscar" />
                <BtnDelete
                    label="Quitar"
                    withText={true}
                    onClick={handleReset}
                />
            </div>
            {status && <ActionMessage msg={status} />}
        </form>
    )
}

function ContactosList(props) {
    return (
        <>
            <ContactosSearch
                pending={props.isSearching}
                submitAction={props.searchAction}
                status={props.actionState}
            />
            <table className="table table-striped table-hover">
                <thead>
                    <tr className="table-info">
                        <th className="display-4">Lista de contactos</th>
                        <th className="text-end">
                            <BtnAdd
                                label="Añadir"
                                withText={true}
                                onClick={() => props.onAdd && props.onAdd()}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {props.listado.map(item => (
                        <tr key={item.id}>
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-link"
                                    onClick={() =>
                                        props.onView && props.onView(item.id)
                                    }>
                                    {item.tratamiento} {item.nombre}{' '}
                                    {item.apellidos}
                                </button>
                            </td>
                            <td className="align-middle text-end">
                                <div role="group" className="btn-group">
                                    <BtnView
                                        onClick={() =>
                                            props.onView &&
                                            props.onView(item.id)
                                        }
                                    />
                                    <BtnEdit
                                        onClick={() =>
                                            props.onEdit &&
                                            props.onEdit(item.id)
                                        }
                                    />
                                    <BtnDelete
                                        onClick={() =>
                                            props.onDelete &&
                                            props.onDelete(item.id)
                                        }
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Paginator
                currentPage={props.currentPage}
                totalPages={props.totalPages}
                maxPagesVisibles={10}
                onPageChange={props.onPageChange}
            />
        </>
    )
}
function ContactosView({ elemento, onVolver }) {
    const handleImageError = ev => {
        ev.target.src =
            elemento.sexo === 'H' ? imgUserNotFoundMale : imgUserNotFoundFemale
        ev.target.onError = null // Previene bucle infinito
    }
    return (
        <>
            <div className="row">
                <div className="col-xs-12 col-sm-6 col-md-6">
                    <div className="well well-sm">
                        <div className="row">
                            <div className="col-sm-6 col-md-4">
                                <img
                                    className="rounded"
                                    src={
                                        elemento.avatar ||
                                        (elemento.sexo === 'H'
                                            ? imgUserNotFoundMale
                                            : imgUserNotFoundFemale)
                                    }
                                    alt={`Foto de ${elemento.nombre} ${elemento.apellidos ?? ''}`}
                                    onError={handleImageError}
                                />
                            </div>
                            <div className="col-sm-6 col-md-8 vstack gap-0">
                                <h4>{`${elemento.tratamiento ?? ''} ${elemento.nombre} ${elemento.apellidos ?? ''}`}</h4>
                                {elemento.conflictivo && (
                                    <div>
                                        <small className="text-danger">
                                            ☣️ Persona conflictiva
                                        </small>
                                    </div>
                                )}
                                {elemento.telefono && (
                                    <div>☎️ {elemento.telefono}</div>
                                )}
                                {elemento.email && (
                                    <div>
                                        ✉️{' '}
                                        <a href={`mailto:${elemento.email}`}>
                                            {elemento.email}
                                        </a>
                                    </div>
                                )}
                                {elemento.telefono && (
                                    <div>
                                        🎂{' '}
                                        {new Date(
                                            elemento.nacimiento,
                                        ).toLocaleDateString()}
                                    </div>
                                )}
                                <input
                                    type="button"
                                    value="Volver"
                                    className="btn btn-secondary mt-1"
                                    onClick={() => onVolver && onVolver()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
function ContactosForm(props) {
    const [elemento, setElemento] = useState(props.elemento)
    const [invalid, setInvalid] = useState(false)
    const [errorsMsg, setErrorsMsg] = useState({})

    const form = useRef(null)

    useEffect(() => {
        let invalid = false
        let errorsMsg = {}
        for (let control of form.current.elements) {
            switch (control.name) {
                case 'nacimiento':
                    control.setCustomValidity(
                        control.value && !isBefore(control.value)
                            ? 'Debe ser una fecha pasada'
                            : '',
                    )
                    break
            }
            if (control.validationMessage) {
                invalid = true
                errorsMsg[control.name] =
                    control.validity.patternMismatch && control.dataset.pattern
                        ? control.dataset.pattern
                        : control.validationMessage
            }
        }
        setInvalid(invalid)
        setErrorsMsg(errorsMsg)
    }, [elemento])

    const handleChange = ev => {
        const cmp = ev.target.name
        const value =
            ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value
        setElemento(prev => ({ ...prev, [cmp]: value }))
    }
    return (
        <form
            ref={form}
            noValidate
            className={
                'row gy-2 gx-2 align-items-start' +
                (props.pending ? ' opacity-50' : '')
            }>
            <div className="form-floating col-md-2">
                <input
                    type="number"
                    name="id"
                    id="id"
                    required
                    min={0}
                    placeholder=" "
                    className={
                        props.esNuevo
                            ? 'form-control' +
                              (errorsMsg?.id ? ' is-invalid' : '')
                            : 'form-control-plaintext'
                    }
                    value={elemento.id}
                    onChange={handleChange}
                    readOnly={!props.esNuevo}
                />
                <label htmlFor="id">Código:</label>
                <ValidationMessage msg={errorsMsg?.id} />
            </div>
            <div className="form-floating col-md-2">
                <select
                    name="tratamiento"
                    id="tratamiento"
                    className="form-control form-select"
                    value={elemento.tratamiento}
                    onChange={handleChange}>
                    <option>Sr.</option>
                    <option>Sra.</option>
                    <option>Srta.</option>
                    <option>Dr.</option>
                    <option>Dra.</option>
                    <option>Ilmo.</option>
                    <option>Ilma.</option>
                    <option>Excmo.</option>
                    <option>Excma.</option>
                </select>
                <label htmlFor="tratamiento">Tratamiento:</label>
            </div>
            <div className="form-floating col-md-4">
                <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    required
                    minLength={2}
                    maxLength={50}
                    placeholder=" "
                    className={
                        'form-control' +
                        (errorsMsg?.nombre ? ' is-invalid' : '')
                    }
                    value={elemento.nombre}
                    onChange={handleChange}
                />
                <label htmlFor="nombre">Nombre:</label>
                <ValidationMessage msg={errorsMsg?.nombre} />
            </div>
            <div className="form-floating col-md-4">
                <input
                    type="text"
                    name="apellidos"
                    id="apellidos"
                    minLength={2}
                    maxLength={50}
                    placeholder=" "
                    className={
                        'form-control' +
                        (errorsMsg?.apellidos ? ' is-invalid' : '')
                    }
                    value={elemento.apellidos}
                    onChange={handleChange}
                />
                <label htmlFor="apellidos">Apellidos:</label>
                <ValidationMessage msg={errorsMsg?.apellidos} />
            </div>
            <div className="form-floating col-md-3 col-lg-2">
                <input
                    type="tel"
                    name="telefono"
                    id="telefono"
                    pattern="^(\d{3}\s){2}\d{3}$"
                    data-pattern="El formato debe ser: 555 999 999."
                    placeholder="555 999 999"
                    className={
                        'form-control' +
                        (errorsMsg?.telefono ? ' is-invalid' : '')
                    }
                    value={elemento.telefono}
                    onChange={handleChange}
                />
                <label htmlFor="telefono" className="form-label">
                    Teléfono:
                </label>
                <ValidationMessage msg={errorsMsg?.telefono} />
            </div>
            <div className="form-floating col-md-6 col-lg-4">
                <input
                    type="email"
                    name="email"
                    id="email"
                    maxLength={100}
                    placeholder=" "
                    className={
                        'form-control' + (errorsMsg?.email ? ' is-invalid' : '')
                    }
                    value={elemento.email}
                    onChange={handleChange}
                />
                <label htmlFor="email" className="form-label">
                    Correo:
                </label>
                <ValidationMessage msg={errorsMsg?.email} />
            </div>
            <div className="form-floating col-md-3 col-lg-2">
                <input
                    type="date"
                    name="nacimiento"
                    id="nacimiento"
                    placeholder=" "
                    className={
                        'form-control' +
                        (errorsMsg?.nacimiento ? ' is-invalid' : '')
                    }
                    value={elemento.nacimiento}
                    onChange={handleChange}
                />
                <label htmlFor="nacimiento" className="form-label">
                    F. Nacimiento:
                </label>
                <ValidationMessage msg={errorsMsg?.nacimiento} />
            </div>
            <div className="col-md-4 col-lg-2">
                <div className="col-form-label-sm d-inline d-lg-block">
                    Sexo:
                </div>
                <div className="ms-2 d-inline">
                    <div className="form-check form-check-inline">
                        <input
                            type="radio"
                            name="sexo"
                            id="sexo1"
                            className="form-check-input"
                            defaultChecked={elemento.sexo === 'H'}
                            value="H"
                            onChange={handleChange}
                        />
                        <label htmlFor="sexo1" className="form-check-label">
                            Hombre
                        </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            type="radio"
                            name="sexo"
                            id="sexo2"
                            className="form-check-input"
                            defaultChecked={elemento.sexo === 'M'}
                            value="M"
                            onChange={handleChange}
                        />
                        <label htmlFor="sexo2" className="form-check-label">
                            Mujer
                        </label>
                    </div>
                </div>
            </div>
            <div className="col-md-4 col-lg-2">
                <div className="col-form-label-sm d-inline d-lg-block">
                    Situación:
                </div>
                <div className="ms-2 form-check form-check-inline form-switch">
                    <input
                        type="checkbox"
                        id="conflictivo"
                        name="conflictivo"
                        className="form-check-input"
                        checked={elemento.conflictivo}
                        onChange={handleChange}
                    />
                    <label htmlFor="conflictivo" className="form-check-label">
                        Conflictivo
                    </label>
                </div>
            </div>
            <div className="form-floating col-md-12">
                <input
                    type="url"
                    name="avatar"
                    id="avatar"
                    maxLength={500}
                    placeholder=" "
                    className={
                        'form-control' +
                        (errorsMsg?.avatar ? ' is-invalid' : '')
                    }
                    value={elemento.avatar}
                    onChange={handleChange}
                />
                <label htmlFor="avatar" className="form-label">
                    Avatar:
                </label>
                <ValidationMessage msg={errorsMsg?.avatar} />
            </div>
            {/* <div className="mt-2 btn-group">
                <input
                    type="submit"
                    defaultValue="submit"
                    className="btn btn-success"
                    //   onClick={() => props.onVolver && props.onEnviar(elemento)}
                    disabled={invalid}
                />
                <input
                    type="button"
                    defaultValue="Enviar"
                    className="btn btn-success"
                    onClick={() => props.onVolver && props.onEnviar(elemento)}
                    disabled={invalid}
                />
                <input
                    className="btn btn-info"
                    type="button"
                    value="Volver"
                    onClick={() => props.onVolver && props.onVolver()}
                />
            </div> */}
            <div className="d-flex justify-content-end">
                <FormButtons
                    onSend={() => props.onVolver && props.onEnviar(elemento)}
                    sendDisabled={invalid}
                    onCancel={() => props.onVolver && props.onVolver()}
                    {...(!props.esNuevo && props.onBorrar
                        ? { onDelete: () => props.onBorrar(elemento.id) }
                        : {})}
                />
            </div>
        </form>
    )
}
