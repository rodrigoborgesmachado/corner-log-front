import "./AddSquareConfigurationModal.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../services/redux/loadingSlice";
import squareConfigApi from "../../../../services/apiServices/squareconfigurationApi";
import { toast } from "react-toastify";

const daysOfWeek = [
    { id: 1, name: "Domingo" },
    { id: 2, name: "Segunda" },
    { id: 3, name: "Terça" },
    { id: 4, name: "Quarta" },
    { id: 5, name: "Quinta" },
    { id: 6, name: "Sexta" },
    { id: 7, name: "Sábado" },   
];

const AddSquareConfigurationModal = ({ isOpen, onClose, onSubmit, squareCode }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        Daysofweek: [],
        starttime: "",
        endtime: "",
        observation: "",
        Price: "",
    });

    const clearInfo = () => {
        setFormData(
            {
                Daysofweek: [],
                starttime: "",
                endtime: "",
                observation: "",
                Price: "",
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (dayId) => {
        setFormData((prevState) => ({
            ...prevState,
            Daysofweek: prevState.Daysofweek.includes(dayId)
                ? prevState.Daysofweek.filter((day) => day !== dayId)
                : [...prevState.Daysofweek, dayId],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.Daysofweek.length) {
            toast.error("Selecione pelo menos um dia da semana.");
            return;
        }

        const payload = {
            squarecode: squareCode,
            ...formData,
            Price: parseFloat(formData.Price),
        };

        try {
            dispatch(setLoading(true));
            await squareConfigApi.create(payload);
            toast.success("Configuração adicionada com sucesso!");
            clearInfo();
            onSubmit();
            onClose();
        } catch (error) {
            toast.error("Erro ao salvar a configuração.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-register">
            <div className="modal-container-register">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <form onSubmit={handleSubmit} className="register-form">
                    <h2 className="form-title">Novo Horário</h2>

                    <div className="square-config-days">
                        <label className="square-config-label">Selecione os dias da semana:</label>
                        <div className="square-config-days-container">
                            {daysOfWeek.map((day) => (
                                <label key={day.id} className="square-config-day">
                                    <input
                                        type="checkbox"
                                        checked={formData.Daysofweek.includes(day.id)}
                                        onChange={() => handleCheckboxChange(day.id)}
                                    />
                                    {day.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="square-config-time">
                        <div className="square-config-group">
                            <label className="square-config-label">Horário de Início:</label>
                            <input
                                type="time"
                                name="starttime"
                                value={formData.starttime}
                                onChange={handleInputChange}
                                required
                                className="square-config-input"
                            />
                        </div>

                        <div className="square-config-group">
                            <label className="square-config-label">Horário de Término:</label>
                            <input
                                type="time"
                                name="endtime"
                                value={formData.endtime}
                                onChange={handleInputChange}
                                required
                                className="square-config-input"
                            />
                        </div>
                    </div>

                    <div className="square-config-group">
                        <label className="square-config-label">Preço:</label>
                        <input
                            type="number"
                            name="Price"
                            value={formData.Price}
                            onChange={handleInputChange}
                            required
                            step="0.01"
                            className="square-config-input"
                        />
                    </div>

                    <div className="square-config-group">
                        <label className="square-config-label">Observação:</label>
                        <textarea
                            name="observation"
                            value={formData.observation}
                            onChange={handleInputChange}
                            rows="4"
                            className="square-config-textarea"
                        />
                    </div>

                    <div className="option-next-register">
                        <button type="button" className="main-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="main-button">
                            Salvar
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default AddSquareConfigurationModal;
