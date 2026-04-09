import { useEffect, useRef, useState } from 'react'
import { ActionMessage, ErrorMessageModal } from '../biblioteca'

export function Crud() {
    const [modo, setModo] = useState('list')
    const [elemento, setElemento] = useState()

    const addHandler = () => {
        setModo('add')
        setElemento({})
    }
    const editHandler = id => {
        setModo('edit')
        setElemento({
            id: 111,
            nombre: 'Pepito',
            apellidos: 'Grillo',
            edad: 18,
        })
    }
    const viewHandler = id => {
        setModo('view')
        setElemento({
            id: 111,
            nombre: 'Pepito',
            apellidos: 'Grillo',
            edad: 18,
        })
    }
    const deleteHandler = id => {
        alert('Borrado')
    }
    function cancel() {
        setModo('list')
    }
    function send(data) {
        // eslint-disable-next-line default-case
        switch (modo) {
            case 'add':
                alert(`POST ${JSON.stringify(data)}`)
                setModo('list')
                break
            case 'edit':
                alert(`PUT ${JSON.stringify(data)}`)
                setModo('list')
                break
        }
    }

    switch (modo) {
        case 'view':
            return <View elemento={elemento} onVolver={cancel} />
        case 'add':
        case 'edit':
            return (
                <Formulario
                    elemento={elemento}
                    esNuevo={modo === 'add'}
                    onEnviar={e => send(e)}
                    onVolver={cancel}
                />
            )
        default:
            return (
                <List
                    // onAdd={addHandler}
                    onEdit={id => editHandler(id)}
                    onView={id => viewHandler(id)}
                    onDelete={id => remove(id)}
                />
            )
    }
}

function List({ onAdd, onEdit, onView, onDelete }) {
    return (
        <div>
            <button type="button" onClick={onAdd}>
                Add
            </button>
            <button type="button" onClick={() => onEdit && onEdit(1)}>
                Edit
            </button>
            <button type="button" onClick={() => onView && onView(1)}>
                View
            </button>
        </div>
    )
}

function View({ elemento, onVolver }) {
    return (
        <div>
            <code> {JSON.stringify(elemento)}</code>
            <button type="button" onClick={onVolver}>
                Volver
            </button>
        </div>
    )
}

function Formulario(props) {
    const [elemento, setElemento] = useState(props.elemento)
    const [invalid, setInvalid] = useState(false)
    const [errorsMsg, setErrorsMsg] = useState({})
    const form = useRef(null)

    useEffect(() => {
        let invalid = false
        let errorsMsg = {}
        for (let control of form.current.elements) {
            switch (control.name) {
                case 'nombre':
                    control.setCustomValidity(
                        control.value !== control.value.toUpperCase()
                            ? 'Tiene que estar en mayúsculas'
                            : '',
                    )
                    break
                // case 'nacimiento':
                //     control.setCustomValidity(
                //         control.value && !isBefore(control.value)
                //             ? 'Debe ser una fecha pasada'
                //             : '',
                //     )
                //     break
            }
            if (control.validationMessage) {
                invalid = true
                errorsMsg[control.name] =
                    control.validity.patternMismatch && control.dataset.pattern
                        ? control.dataset.pattern
                        : control.validationMessage
            }
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInvalid(invalid)
        setErrorsMsg(errorsMsg)
    }, [elemento])

    const handleChange = ev => {
        const cmp = ev.target.name
        const value =
            ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value
        setElemento(prev => ({ ...prev, [cmp]: value }))
    }
    const sendClick = event => {
        event.preventDefault()
        if(props.onEnviar) props.onEnviar(elemento)
    }

    return (
        <form ref={form}>
            <div>
                <label className="form-label" htmlFor="id">
                    Código:
                </label>
                <input
                    type="number"
                    id="id"
                    name="id"
                    value={elemento.id}
                    required
                    onChange={handleChange}
                />
                <ActionMessage msg={errorsMsg?.id} />
            </div>
            <div>
                <label className="form-label" htmlFor="nombre">
                    Nombre:
                </label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={elemento.nombre}
                    required
                    minLength="2"
                    maxLength="10"
                    onChange={handleChange}
                />
                <ActionMessage msg={errorsMsg?.nombre} />
            </div>
            <div>
                <label className="form-label" htmlFor="nombre">
                    Apellidos:
                </label>
                <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={elemento.apellidos}
                    minLength="2"
                    maxLength="10"
                    onChange={handleChange}
                />
                <ActionMessage msg={errorsMsg?.apellidos} />
            </div>
            <div>
                <label className="form-label" htmlFor="nombre">
                    edad:
                </label>
                <input
                    type="number"
                    id="edad"
                    name="edad"
                    value={elemento.edad}
                    min="16"
                    max="67"
                    onChange={handleChange}
                />
                <ActionMessage msg={errorsMsg?.edad} />
            </div>
            <div>
                <button type="button" onClick={sendClick} disabled={invalid}>
                    Enviar
                </button>
                <button type="button" onClick={props.onVolver}>Volver</button>
            </div>
        </form>
    )
}
