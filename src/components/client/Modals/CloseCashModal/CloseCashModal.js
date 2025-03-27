import './CloseCashModal.css';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../../services/redux/loadingSlice';
import cashApi from '../../../../services/apiServices/cashregisterApi';
import { toast } from 'react-toastify';

const CloseCashModal = ({ isOpen, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        Finalamount: '',
        Closingmessage: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            await cashApi.closeCash(form);
            toast.success('Caixa fechado com sucesso!');
            onSubmit(); // Refresh or reload data
            onClose();
        } catch (err) {
            toast.error('Erro ao fechar o caixa!');
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-register">
            <div className="modal-container-register">
                <button className="close-button" onClick={onClose}>&times;</button>
                <form onSubmit={handleSubmit} className="register-form">
                    <h2 className="form-title">Fechar Caixa</h2>

                    <div className="form-group-register">
                        <div className="form-group-inside">
                            <label>Valor Final (R$):</label>
                            <input
                                type="number"
                                name="Finalamount"
                                step="0.01"
                                min="0"
                                value={form.Finalamount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group-register">
                        <div className="form-group-inside">
                            <label>Mensagem de Fechamento:</label>
                            <textarea
                                name="Closingmessage"
                                rows="4"
                                value={form.Closingmessage}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group-register option-next-register">
                        <button type="button" className="main-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="main-button">
                            Confirmar Fechamento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CloseCashModal;
