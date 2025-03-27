import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import entityApi from "../../../services/apiServices/entityApi";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../services/redux/loadingSlice";
import { toast } from "react-toastify";
import './EntityCreatePage.css'
import { maskCEP, maskCNPJ, maskPhone } from "../../../utils/masks";

const EntityCreatePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { code } = useParams();
    const [formData, setFormData] = useState({
        document: "",
        email: "",
        phone: "",
        tradename: "",
        corporatename: "",
        street: "",
        neighborhood: "",
        number: "",
        postalcode: "",
        city: "",
        state: "",
        observation: ""
    });
    

    useEffect(() => {
        const fetchFamily =  async () => {
            dispatch(setLoading(true));
            try {
                const response = await entityApi.getByCode(code, {include: 'Users,Users.User,Squares,Entityimages'});
                
                setFormData({
                    document: response.Document || "",
                    email: response.Email || "",
                    phone: response.Phone || "",
                    tradename: response.Tradename || "",
                    corporatename: response.Corporatename || "",
                    street: response.Street || "",
                    neighborhood: response.Neighborhood || "",
                    number: response.Number || "",
                    postalcode: response.Postalcode || "",
                    city: response.City || "",
                    state: response.State || "",
                    observation: response.Observation || ""
                });
            } catch (error) {
                toast.error('Erro ao buscar os dados.');
            } finally {
                dispatch(setLoading(false));
            }
        }

        if(code)
            fetchFamily();
    }, [code, dispatch]);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));

        try {
            if(!code)
            {
                await entityApi.create(formData);
                toast.success("Empresa adicionada com sucesso!");
                navigate("/Empresas"); 
            }
            else
            {
                await entityApi.update(code, formData);
                toast.success("Família editada com sucesso!");
                navigate("/Empresas/" + code); 
            }
            
        } catch (error) {
            toast.error("Erro ao adicionar empresa. Verifique os dados e tente novamente.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="container-admin-page">
            <h1>Adicionar Empresa</h1>

            <form className="box form-register" onSubmit={handleSubmit}>
                <div className="flex-row wrap gap-default">
                    <div className="form-group">
                        <label>Nome Fantasia:</label>
                        <input type="text" name="tradename" value={formData.tradename} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Razão Social:</label>
                        <input type="text" name="corporatename" value={formData.corporatename} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Documento:</label>
                        <input type="text" name="document" value={maskCNPJ(formData.document)} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Celular:</label>
                        <input type="text" name="phone" value={maskPhone(formData.phone)} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Rua:</label>
                        <input type="text" name="street" value={formData.street} onChange={handleChange} required />
                    </div>
                </div>

                <div className="flex-row wrap gap-default">
                    <div className="form-group">
                        <label>Bairro:</label>
                        <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Número:</label>
                        <input type="text" name="number" value={formData.number} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>CEP:</label>
                        <input type="text" name="postalcode" value={maskCEP(formData.postalcode)} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Cidade:</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                </div>

                <div className="flex-row wrap gap-default">
                    <div className="form-group">
                        <label>Estado:</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Observação:</label>
                        <input type="text" name="observation" value={formData.observation} onChange={handleChange} />
                    </div>
                </div>

                <button type="submit" className="admin-button">{code ? 'Editar Empresa' : 'Adicionar Empresa'}</button>
            </form>
        </div>
    );
};

export default EntityCreatePage;