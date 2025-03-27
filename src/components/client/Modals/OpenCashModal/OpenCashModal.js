import './OpenCashModal.css';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../../services/redux/loadingSlice';
import cashApi from '../../../../services/apiServices/cashregisterApi';
import { toast } from 'react-toastify';

const OpenCashModal = ({ isOpen, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        initialamount: '',
        initialmessage: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            await cashApi.create(form);
            toast.success('Caixa aberto com sucesso!');
            clearForm();
            onSubmit();
            onClose();
        } catch (err) {
            toast.error('Erro ao abrir o caixa!');
        } finally {
            dispatch(setLoading(false));
        }
    };

    const clearForm = () => {
        setForm({
            initialamount: '',
            initialmessage: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-register">
            <div className="modal-container-register">
                <button className="close-button" onClick={onClose}>&times;</button>
                <form onSubmit={handleSubmit} className="register-form">
                    <h2 className="form-title">Abrir Caixa</h2>

                    <div className="form-group-register">
                        <div className="form-group-inside">
                            <label>Valor Inicial (R$):</label>
                            <input
                                type="number"
                                name="initialamount"
                                step="0.01"
                                min="0"
                                value={form.initialamount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group-register">
                        <div className="form-group-inside">
                            <label>Mensagem Inicial:</label>
                            <textarea
                                name="initialmessage"
                                rows="4"
                                value={form.initialmessage}
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
                            Confirmar Abertura
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OpenCashModal;
