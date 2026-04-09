import React, { useRef, useState } from 'react'
import './calculadora.css'

const Pantalla = props => (
    <output className="Pantalla">
        {props.coma ? props.pantalla.replace(/\./g, ',') : props.pantalla}
    </output>
)
const Resumen = ({ coma, resumen }) => (
    <output className="Resumen">
        {coma ? resumen.replace(/\./g, ',') : resumen}
    </output>
)

const BtnCalcular = ({ texto, css, onClick }) => {
    const handleClick = () => {
        if (onClick) onClick(texto)
    }
    return (
        <button className={css} onClick={handleClick}>
            {texto}
        </button>
    )
}

export function Calculadora({
    init,
    coma = false,
    onChange,
}) {
    const [pantalla, setPantalla] = useState((init ?? '0').toString())
    const [resumen, setResumen] = useState(null)
    const acumulado = useRef(0)
    const operador = useRef('+')
    const limpiar = useRef(true)

    const inicia = () => {
        acumulado.current = 0
        operador.current = '+'
        limpiar.current = true
        setPantalla('0')
        setResumen(null)
    }

    const ponDigito = value => {
        if (typeof value !== 'string') {
            value = value.toString()
        }
        if (value.length !== 1 || value < '0' || value > '9') {
            console.error('No es un valor numérico.')
            return
        }
        if (limpiar.current || pantalla === '0') {
            setPantalla(value)
            limpiar.current = false
        } else {
            setPantalla(p => p + value)
        }
    }
    // eslint-disable-next-line no-unused-vars
    const ponOperando = value => {
        if (!Number.isNaN(parseFloat(value)) && parseFloat(value) == value) {
            setPantalla(value)
            limpiar.current = false
        } else {
            console.error('No es un valor numérico.')
        }
    }

    const ponComa = () => {
        if (limpiar.current) {
            if (!isFinite(acumulado.current) || isNaN(acumulado.current)) {
                return
            }
            setPantalla('0.')
            limpiar.current = false
        } else if (pantalla.indexOf('.') === -1) {
            setPantalla(p => p + '.')
        } else console.warn('Ya está la coma')
    }

    const borrar = () => {
        if (
            limpiar.current ||
            pantalla.length === 1 ||
            (pantalla.length === 2 && pantalla.startsWith('-'))
        ) {
            setPantalla(_p => '0')
            limpiar.current = true
        } else {
            setPantalla(p => p.substr(0, p.length - 1))
        }
    }

    const cambiaSigno = () => {
        setPantalla(p => (-p).toString())
        if (limpiar.current) {
            acumulado.current = -acumulado.current
        }
    }

    const calcula = value => {
        if ('+-*/='.indexOf(value) === -1) {
            console.error(`Operación no soportada: ${value}`)
            return
        }
        const operando = parseFloat(pantalla)
        switch (operador.current) {
            case '+':
                acumulado.current += operando
                break
            case '-':
                acumulado.current -= operando
                break
            case '*':
                acumulado.current *= operando
                break
            case '/':
                acumulado.current /= operando
                break
            case '=':
            default:
                break
        }
        // Con eval()
        // acumulado = eval (acumulado + operador.current + pantalla);
        // Number: double-precision IEEE 754 floating point.
        // 9.9 + 1.3, 0.1 + 0.2, 1.0 - 0.9
        const newPantalla = parseFloat(
            acumulado.current.toPrecision(15),
        ).toString()
        // newPantalla = acumulado.current.toString();
        const newResumen = value === '=' ? '' : `${newPantalla} ${value}`
        operador.current = value
        limpiar.current = true
        if (onChange) onChange(acumulado.current)
        setPantalla(newPantalla)
        setResumen(newResumen)
    }

    let cabecera = []
    if (resumen) {
        cabecera.push(<Resumen key="resumen" resumen={resumen} coma={coma} />)
    }
    cabecera.push(<Pantalla key="pantalla" pantalla={pantalla} coma={coma} />)
    return (
        <div className="Calculadora">
            <title>Calculadora</title>
            {/* <Resumen resumen={resumen} />
            <Pantalla pantalla={pantalla} coma={props.coma} /> */}
            {cabecera}
            <BtnCalcular css="btnOperar" texto="CE" onClick={inicia} />
            <BtnCalcular
                css="btnOperar col-2x2"
                texto={'\u21B6 BORRAR'}
                onClick={borrar}
            />
            <BtnCalcular css="btnOperar" texto="+" onClick={calcula} />
            {[7, 8, 9].map(item => (
                <BtnCalcular
                    key={'btn' + item}
                    css="btnDigito"
                    texto={item}
                    onClick={ponDigito}
                />
            ))}
            <BtnCalcular css="btnOperar" texto="-" onClick={calcula} />
            {[4, 5, 6].map(item => (
                <BtnCalcular
                    key={'btn' + item}
                    css="btnDigito"
                    texto={item}
                    onClick={ponDigito}
                />
            ))}
            <BtnCalcular css="btnOperar" texto="*" onClick={calcula} />
            {[1, 2, 3].map(item => (
                <BtnCalcular
                    key={'btn' + item}
                    css="btnDigito"
                    texto={item}
                    onClick={ponDigito}
                />
            ))}
            <BtnCalcular css="btnOperar" texto="/" onClick={calcula} />
            <BtnCalcular css="btnDigito" texto="±" onClick={cambiaSigno} />
            <BtnCalcular css="btnDigito" texto="0" onClick={ponDigito} />
            <BtnCalcular
                css="btnDigito"
                texto={coma ? ',' : '.'}
                onClick={ponComa}
            />
            <BtnCalcular css="btnOperar" texto="=" onClick={calcula} />
        </div>
    )
}
