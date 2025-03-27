import './AddUserModal.css';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../../services/redux/loadingSlice';
import { toast } from 'react-toastify';
import entityApi from '../../../../services/apiServices/entityApi';
import { maskPhone } from '../../../../utils/masks';

const AddUserModal = ({ isOpen, onClose, onSubmit, userData = null }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        Name: '',
        Phone: '',
        Email: '',
        Observation: '',
        EntityCode: ''
    });
    const [entityList, setEntityList] = useState([]);

    useEffect(() => {
        const fetchEntities = async () => {
            try {
                dispatch(setLoading(true));
                const response = await entityApi.getAll();
                setEntityList(response);
            } catch (error) {
                toast.error('Erro ao carregar as empresas!');
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchEntities();

        if (userData) {
            setUser(userData);
        }
    }, [dispatch, userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(user);
        clear();
        onClose();
    };

    const clear = () => {
        setUser({
            Name: '',
            Phone: '',
            Email: '',
            Observation: '',
            EntityCode: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-register">
            <div className="modal-container-register">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <form onSubmit={handleSubmit} className="register-form">

                    <div className="form-group-register">
                        <div className="form-group-inside">
                            <label>Nome:</label>
                            <input
                                type="text"
                                name="Name"
                                value={user.Name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group-register">
                        <div className="form-group-inside">
                            <label>Telefone:</label>
                            <input
                                type="tel"
                                name="Phone"
                                value={maskPhone(user.Phone)}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group-register">
                        <div className="form-group-inside">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="Email"
                                value={user.Email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group-register">
                        <div className="form-group-inside">
                            <label>Observação:</label>
                            <textarea
                                name="Observation"
                                value={user.Observation}
                                onChange={handleInputChange}
                                rows="4"
                            />
                        </div>
                    </div>

                    <div className="form-group-register">
                        <div className="form-group-inside">
                            <label>Entidade:</label>
                            <select
                                name="EntityCode"
                                value={user.EntityCode}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecione a Empresa</option>
                                {entityList.map((entity) => (
                                    <option key={entity.Code} value={entity.Code}>
                                        {entity.Tradename}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group-register option-next-register">
                        <button className="main-button" type="button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button className="main-button" type="submit">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
