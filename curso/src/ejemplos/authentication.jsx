import { use, useContext } from 'react'
import {
    AuthContext,
    AuthDispatchContext,
    loginAction,
    logoutAction,
} from './auth-context'

export function Authentication() {
    const auth = useContext(AuthContext)
    const dispatch = use(AuthDispatchContext)
    const handleLogin = user => {
        dispatch(loginAction(user.nombre, [], user.token))
    }
    const handleLogout = () => {
        dispatch(logoutAction())
    }
    return auth.isAuth ? (
        <ShowAuthentication {...auth} onLogout={handleLogout} />
    ) : (
        <LoginForm onLogin={handleLogin} />
    )
}
export function ShowAuthentication({ name, onLogout }) {
    const imgLogout = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            className="bi bi-box-arrow-right"
            viewBox="0 0 16 16">
            <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v2a.5.5 0 001 0v-2A1.5 1.5 0 009.5 2h-8A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h8a1.5 1.5 0 001.5-1.5v-2a.5.5 0 00-1 0z"
            />
            <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 000-.708l-3-3a.5.5 0 00-.708.708L14.293 7.5H5.5a.5.5 0 000 1h8.793l-2.147 2.146a.5.5 0 00.708.708z"
            />
        </svg>
    )
    return (
        <div className="d-flex">
            <span id="userData" className="navbar-text me-1">
                Hola {name}
            </span>
            <button
                type="button"
                title="desconectar"
                aria-label="enviar logout"
                onClick={onLogout}
                className="btn btn-outline-dark btn-sm">
                {imgLogout}
            </button>
        </div>
    )
}
export function LoginForm({ onLogin }) {
    const imgLogin = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-box-arrow-in-right"
            viewBox="0 0 16 16">
            <path
                fillRule="evenodd"
                d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"
            />
            <path
                fillRule="evenodd"
                d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
            />
        </svg>
    )
    const imgRegistrar = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-person-plus-fill"
            viewBox="0 0 16 16">
            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            <path
                fillRule="evenodd"
                d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
            />
        </svg>
    )
    return (
        <form className="form-inline d-flex align-self-center">
            <div role="group" aria-label="Login Form" className="input-group">
                <input
                    name="usr"
                    type="text"
                    required=""
                    minLength={4}
                    placeholder="Usuario"
                    autoComplete="username"
                    className="form-control-sm"
                    size={8}
                />
                <input
                    name="pwd"
                    type="password"
                    required=""
                    minLength={8}
                    placeholder="Contraseña"
                    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$"
                    autoComplete="current-password"
                    className="form-control-sm"
                    size={8}
                />
                <button
                    type="button"
                    title="enviar login"
                    onClick={() => onLogin({ nombre: 'demo' })}
                    className="btn btn-outline-dark btn-sm">
                    {imgLogin}
                </button>
                <button
                    type="button"
                    title="registrar usuario"
                    className="btn btn-outline-dark btn-sm">
                    {imgRegistrar}
                </button>
            </div>
        </form>
    )
}
