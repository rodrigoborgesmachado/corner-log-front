import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import entityApi from "../../../services/apiServices/entityApi";
import "./EntityPage.css";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoading } from '../../../services/redux/loadingSlice';
import { maskCEP, maskCNPJ, maskPhone } from "../../../utils/masks";
import { putDateOnPattern } from "../../../utils/functions";

const EntityPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { code } = useParams(); 
    const [entity, setEntity] = useState(null);

    useEffect(() => {
        const fetchEntity = async () => {
            dispatch(setLoading(true));
            try {
                const response = await entityApi.getByCode(code);
                setEntity(response);
            } catch (err) {
                toast.error("Erro ao carregar os dados da entidade.");
                navigate('/');
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchEntity();
    }, [code, dispatch, navigate]);

    if (!entity) return <p className="info-empty">Carregando</p>;

    return (
        <div className="container-admin-page div-with-border">
            <h1 className="info-title">{entity.Corporatename}</h1>

            <div className="info-details">
                <h2>Informações</h2>
                <div className="info-group">
                    <strong>Nome Fantasia:</strong> <p>{entity.Tradename}</p>
                </div>
                <div className="info-group">
                    <strong>Documento:</strong> <p>{maskCNPJ(entity.Document)}</p>
                </div>
                <div className="info-group">
                    <strong>Email:</strong> <p>{entity.Email}</p>
                </div>
                <div className="info-group">
                    <strong>Telefone:</strong> <p>{maskPhone(entity.Phone)}</p>
                </div>
            </div>

            <div className="info-address">
                <h2>Endereço</h2>
                <p>{entity.Street}, {entity.Number}</p>
                <p>{entity.Neighborhood} - {entity.City}, {entity.State}</p>
                <p>CEP: {maskCEP(entity.Postalcode)}</p>
            </div>

            <div className="info-meta">
                <h2>Dados Adicionais</h2>
                <p><strong>Criado em:</strong> {putDateOnPattern(entity.Created)}</p>
                <p><strong>Última atualização:</strong> {putDateOnPattern(entity.Updated)}</p>
                <p><strong>Status:</strong> {entity.IsActive ? "Ativo" : "Inativo"}</p>
                <p><strong>Observação:</strong> {entity.Observation}</p>
            </div>
        </div>
    );
};

export default EntityPage;
