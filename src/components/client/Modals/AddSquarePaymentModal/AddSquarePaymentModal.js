// AddSquarePaymentModal.js
import React, { useEffect, useState } from "react";
import "./AddSquarePaymentModal.css";
import squaresavingApi from "../../../../services/apiServices/squaresavingApi";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoading } from "../../../../services/redux/loadingSlice";
import squaresavingpaymentApi from "../../../../services/apiServices/squaresavingpaymentsApi";

const AddSquarePaymentModal = ({ isOpen, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    const [savings, setSavings] = useState([]);
    const [form, setForm] = useState({
        Term: "",
        Paid: "",
        Observacao: ""
    });

    const clearForm = () => {
        setForm({
            Term: "",
            Paid: "",
            Observacao: ""
        });
    }

    useEffect(() => {
        if (!isOpen) return;

        const fetchSavings = async () => {
            try {
                dispatch(setLoading(true));

                const today = new Date().toISOString().split("T")[0];

                const response = await squaresavingApi.getCurrentSavings({
                    startDate: today,
                    endDate: today,
                    include: "Squareconfiguration.Square,Squaresavingpayment"
                });

                setSavings(response);
            } catch (error) {
                toast.error("Erro ao carregar horários disponíveis.");
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchSavings();
    }, [isOpen, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            await squaresavingpaymentApi.create(form);
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

    const getWeekdayName = (day) => {
        const days = [
            "Domingo",
            "Segunda-feira",
            "Terça-feira",
            "Quarta-feira",
            "Quinta-feira",
            "Sexta-feira",
            "Sábado"
        ];
        return days[day-1] ?? "Dia inválido";
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-register">
            <div className="modal-container-register">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2 className="form-title">Registrar Pagamento da Quadra</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="margin-bottom-default">
                        <label>Horário:</label>
                        <select
                            name="Term"
                            value={form.Term}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione um horário</option>
                            {savings.map((s) => (
                                <option key={s.Code} value={s.Code}>
                                    {`${s.Squareconfiguration?.Square?.Name ?? "Quadra"} (${getWeekdayName(s.Squareconfiguration.Dayofweek)} ${s.Squareconfiguration.Starttime} - ${s.Squareconfiguration.Endtime})`}
                                </option>
                            ))}
                        </select>
                    </div>

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
                        <label>Observação:</label>
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
