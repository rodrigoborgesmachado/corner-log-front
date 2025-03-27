import "./AddSavingHourModal.css";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../services/redux/loadingSlice";
import squareSavingApi from "../../../../services/apiServices/squaresavingApi";
import { toast } from "react-toastify";
import { format, startOfWeek, addDays } from "date-fns";
import { maskPhone } from "../../../../utils/masks";

const AddSavingHourModal = ({ isOpen, onClose, onSubmit, configuration }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        Name: "",
        Email: "",
        Phone: "",
        Observation: "",
        Date: "",
        IsRecursively: false,
    });

    // Find the correct date based on the configuration's Dayofweek
    useEffect(() => {
        if (configuration) {
            const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday as first day
            const reservationDate = addDays(currentWeekStart, configuration.Dayofweek - 1); // Get the correct day
            
            setFormData(prevState => ({
                ...prevState,
                Date: format(reservationDate, "yyyy-MM-dd"),
            }));
        }
    }, [configuration]);

    const clearInfo = () => {
        setFormData({
            Name: "",
            Email: "",
            Phone: "",
            Observation: "",
            Date: format(new Date(), "yyyy-MM-dd"),
            IsRecursively: false,
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            SquareConfiguratuionCode: configuration?.Code,
            ...formData,
        };

        try {
            dispatch(setLoading(true));
            await squareSavingApi.create(payload);
            toast.success("Reserva adicionada com sucesso!");
            clearInfo();
            onSubmit();
            onClose();
        } catch (error) {
            toast.error("Erro ao salvar a reserva.");
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
                    <h2 className="form-title">Nova Reserva</h2>

                    {/* Configuration Details */}
                    {configuration && (
                        <div className="saving-config-details">
                            <h3 className="saving-config-title">Detalhes da Configuração</h3>
                            <p><strong>Quadra:</strong> {configuration.Square.Name}</p>
                            <p><strong>Horário:</strong> {configuration.Starttime} - {configuration.Endtime}</p>
                            <p><strong>Valor:</strong> R$ {configuration.Price}</p>
                            <p><strong>Observação:</strong> {configuration.Observation || "Sem observação"}</p>
                        </div>
                    )}

                    <div className="saving-group">
                        <label className="saving-label">Nome:</label>
                        <input
                            type="text"
                            name="Name"
                            value={formData.Name}
                            onChange={handleInputChange}
                            required
                            className="saving-input"
                        />
                    </div>

                    <div className="saving-group">
                        <label className="saving-label">Email:</label>
                        <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleInputChange}
                            required
                            className="saving-input"
                        />
                    </div>

                    <div className="saving-group">
                        <label className="saving-label">Telefone:</label>
                        <input
                            type="tel"
                            name="Phone"
                            value={maskPhone(formData.Phone)}
                            onChange={handleInputChange}
                            required
                            className="saving-input"
                        />
                    </div>

                    <div className="saving-group">
                        <label className="saving-label">Data:</label>
                        <input
                            type="date"
                            name="Date"
                            value={formData.Date}
                            onChange={handleInputChange}
                            required
                            className="saving-input"
                            min={format(new Date(), "yyyy-MM-dd")} // Prevent past dates
                        />
                    </div>

                    <div className="saving-group">
                        <label className="saving-label">Observação:</label>
                        <textarea
                            name="Observation"
                            value={formData.Observation}
                            onChange={handleInputChange}
                            rows="4"
                            className="saving-textarea"
                        />
                    </div>

                    <div className="saving-group-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="IsRecursively"
                                checked={formData.IsRecursively}
                                onChange={handleInputChange}
                            />
                            Repetir Semanalmente
                        </label>
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

export default AddSavingHourModal;