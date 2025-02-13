import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../../services/redux/authSlice";
import tokenApi from "../../../services/apiServices/tokenApi"; // Adjust the path based on your project structure
import "./LoginPage.css";
import { setLoading } from '../../../services/redux/loadingSlice';
import MessageModal from "../../../components/common/Modals/MessageModal/MessageModal";
import logo from '../../../assets/images/logo_orange.png';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState(""); // For email (admin) or CPF/CNPJ (client)
    const [password, setPassword] = useState(""); // For admin login
    const [error, setError] = useState("");
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [message, setMessage] = useState(false);
    const dispatch = useDispatch();

    const openMessageModal = () => {
        setIsMessageOpen(true);
    }

    const closeMessageModal = () => {
        setIsMessageOpen(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            let payload = { userName: identifier, password: password }; 
            const response = await tokenApi.getToken(payload);

            if(response.message)
            {
                setMessage(response.message);
                openMessageModal();
            }
            else{
                // Dispatch the login action to Redux
                dispatch(
                    login({
                        access_token: response.access_token,
                        name: response.name,
                        code: response.id,
                    })
                );
            }

        } catch (err) {
            setError("Falha na autenticação. Verifique seus dados e tente novamente.");
            console.error("Login failed:", err);
        }
        finally{
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="login-page-container">
            <MessageModal isOpen={isMessageOpen} click={closeMessageModal} message={message} />
            <form className="login-page-form" onSubmit={handleSubmit}>
                <div className="logo-class-img">
                    <img src={logo} alt="Logo" className="sidebar-logo" />
                </div>
                <div className="login-page-form-group">
                    <div className="login-page-form-group">
                        <label htmlFor="identifier" className="login-page-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="identifier"
                            className="login-page-input"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="Digite seu email"
                            required
                        />
                    </div>
                    <div className="login-page-form-group">
                        <label htmlFor="password" className="login-page-label">Senha</label>
                        <input
                            type="password"
                            id="password"
                            className="login-page-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                            required
                        />
                    </div>
                    {error && <p className="login-page-error-message">{error}</p>}
                    <p className="login-page-forgot-password">
                        <a href="/recuperar-senha">Esqueceu a senha?</a>
                    </p>
                    <button type="submit" className="login-page-submit-button">Acessar</button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
