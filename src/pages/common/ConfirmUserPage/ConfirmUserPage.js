import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../services/redux/loadingSlice";
import adminApi from "../../../services/apiServices/userApi";
import { toast } from "react-toastify";
import MessageModal from "../../../components/common/Modals/MessageModal/MessageModal";

const ConfirmUserPage = ({isRecover}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [token, setToken] = useState("");
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const guidToken = searchParams.get("token"); // Extract token from URL
        if (guidToken) {
            setToken(guidToken);
        } else {
            setMessage("Token inválido ou expirado.");
            setIsMessageOpen(true);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== verifyPassword) {
            toast.error("As senhas não coincidem.");
            return;
        }

        dispatch(setLoading(true));
        try {
            const response = await adminApi.confirmUser({
                password,
                verifypassword: verifyPassword,
                guid: token,
            });

            if (!response) {
                setMessage("O token expirou. Solicite um novo email de confirmação.");
                setIsMessageOpen(true);
            } else {
                toast.success(isRecover ? "Senha atualizada com sucesso!" : "Cadastro confirmado com sucesso!");
                navigate("/"); // Redirect to login
            }
        } catch (error) {
            toast.error("Erro ao confirmar o usuário.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="login-page-container">
            <MessageModal isOpen={isMessageOpen} click={() => navigate("/")} message={message} />
            <form className="login-page-form" onSubmit={handleSubmit}>
                <div className="login-page-form-group">

                    {
                        isRecover ? 
                        <div className="div-center margin-bottom-double-default flex-column">
                            <h1>Recuperação de senha</h1>
                            <p>Por favor, defina uma senha para acessar sua conta.</p>
                        </div>
                        :
                        <div className="div-center margin-bottom-double-default flex-column">
                            <h1>Bem-vindo!</h1>
                            <p>Por favor, defina uma senha para ativar sua conta.</p>
                        </div>

                    }

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

                    <div className="login-page-form-group">
                        <label htmlFor="verifyPassword" className="login-page-label">Confirmar Senha</label>
                        <input
                            type="password"
                            id="verifyPassword"
                            className="login-page-input"
                            value={verifyPassword}
                            onChange={(e) => setVerifyPassword(e.target.value)}
                            placeholder="Confirme sua senha"
                            required
                        />
                    </div>

                    <button type="submit" className="login-page-submit-button">Confirmar</button>
                </div>
            </form>
        </div>

    );
};

export default ConfirmUserPage;
