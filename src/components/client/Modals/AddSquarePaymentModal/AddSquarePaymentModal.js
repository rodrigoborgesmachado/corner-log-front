// AddSquarePaymentModal.js
import React, { useState } from "react";
import "./AddSquarePaymentModal.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoading } from "../../../../services/redux/loadingSlice";
import squaresavingpaymentApi from "../../../../services/apiServices/squaresavingpaymentsApi";

const AddSquarePaymentModal = ({ isOpen, onClose, onSubmit, savingCode }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        Paid: "",
        Observacao: ""
    });

    const clearForm = () => {
        setForm({
            Paid: "",
            Observacao: ""
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            await squaresavingpaymentApi.create({
                ...form,
                Term: savingCode
            });
            toast.success("Pagamento registrado com sucesso!");
            onSubmit();
            clearForm();
            onClose();
        } catch (error) {
            toast.error("Erro ao registrar pagamento.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-register">
            <div className="modal-container-register">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2 className="form-title">Registrar Pagamento da Quadra</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="margin-bottom-default">
                        <label>Valor:</label>
                        <input
                            className="main-input"
                            type="number"
                            name="Paid"
                            value={form.Paid}
                            onChange={handleInputChange}
                            required
                            step="0.01"
                        />
                    </div>

                    <div className="margin-bottom-default">
                        <label>Nome:</label>
                        <textarea
                            name="Observacao"
                            value={form.Observacao}
                            onChange={handleInputChange}
                            rows={4}
                        />
                    </div>

                    <div className="form-group-register option-next-register">
                        <button type="button" className="main-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="main-button">
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSquarePaymentModal;
