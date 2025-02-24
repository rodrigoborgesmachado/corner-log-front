import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoading } from "../../../services/redux/loadingSlice";
import squareApi from "../../../services/apiServices/squareApi";
import squareConfigApi from "../../../services/apiServices/squareconfigurationApi";
import squareSavingApi from "../../../services/apiServices/squaresavingApi";
import "./SquaresavingListPage.css";
import { format, addDays, subDays } from "date-fns";

const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const SquaresavingListPage = () => {
    const dispatch = useDispatch();
    const [squares, setSquares] = useState([]);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [configurations, setConfigurations] = useState([]);
    const [savings, setSavings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchSquares = async () => {
            dispatch(setLoading(true));
            try {
                const response = await squareApi.getAll();
                setSquares(response);
            } catch (err) {
                toast.error("Erro ao carregar as quadras.");
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchSquares();
    }, [dispatch]);

    const fetchConfigurationAndSavings = async (squareCode, date) => {
        dispatch(setLoading(true));
        try {
            const formattedDate = format(date, "yyyy-MM-dd");
            const dayOfWeek = date.getDay() + 1; // Convert JavaScript 0-6 (Sunday-Saturday) to 1-7
    
            const configResponse = await squareConfigApi.getBySquareCode(squareCode);
            const filteredConfig = configResponse.filter(config => config.Dayofweek === dayOfWeek);
    
            const savingsResponse = await squareSavingApi.getBySquareAndDate(squareCode, {
                startDate: formattedDate,
                endDate: formattedDate
            });
    
            setConfigurations(filteredConfig);
            setSavings(savingsResponse);
        } catch (err) {
            toast.error("Erro ao carregar os dados.");
            setConfigurations([]);
            setSavings([]);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSquareChange = (event) => {
        const squareCode = event.target.value;
        setSelectedSquare(squareCode);

        if (squareCode) {
            fetchConfigurationAndSavings(squareCode, selectedDate);
        }
    };

    const handleDateChange = (direction) => {
        const newDate = direction === "next" ? addDays(selectedDate, 1) : subDays(selectedDate, 1);
        setSelectedDate(newDate);

        if (selectedSquare) {
            fetchConfigurationAndSavings(selectedSquare, newDate);
        }
    };

    return (
        <div className="container-admin-page div-with-border">
            <h1 className="entity-title">Reservas de Horário</h1>

            <div className="form-group">
                <label>Selecione a Quadra:</label>
                <select className="main-input" onChange={handleSquareChange} value={selectedSquare || ""}>
                    <option value="">Escolha uma quadra</option>
                    {squares.map((square) => (
                        <option key={square.Code} value={square.Code}>
                            {square.Name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedSquare && (
                <div className="date-navigation">
                    <button className="main-button" onClick={() => handleDateChange("prev")}>← Dia Anterior</button>
                    <h2>{format(selectedDate, "dd/MM/yyyy")} - {daysOfWeek[selectedDate.getDay()]}</h2>
                    <button className="main-button" onClick={() => handleDateChange("next")}>Próximo Dia →</button>
                </div>
            )}

            <div className="square-configurations-items">
                {selectedSquare && (
                    <div className="config-card">
                        <div className="config-hours-saving">
                            {configurations.length > 0 ? (
                                configurations.map(config => {
                                    const saving = savings.find(saving => saving.Squareconfigurationcode === config.Code);
                                    let statusClass = "hour-block-free"; // Default: Free

                                    if (saving) {
                                        switch (saving.Status) {
                                            case 0: // Pending
                                                statusClass = "hour-block-pending";
                                                break;
                                            case 1: // Accepted (Booked)
                                                statusClass = "hour-block-booked";
                                                break;
                                            case 2: // Denied
                                                statusClass = "hour-block-denied";
                                                break;
                                            default:
                                                statusClass = "hour-block-free";
                                        }
                                    }

                                    return (
                                        <div key={config.Code} className={`hour-block ${statusClass}`}>
                                            <h3>{config.Starttime} - {config.Endtime}</h3>
                                            <label>Valor: R$ {config.Price}</label>
                                            <label>{config.Observation || "Sem observação"}</label>
                                            <span className="status">
                                                {saving ? (
                                                    saving.Status === 0 ? "Pendente" : 
                                                    saving.Status === 1 ? "Reservado" : 
                                                    "Negado"
                                                ) : "Disponível"}
                                            </span>
                                            {
                                                saving && 
                                                <span>
                                                    Responsável: {saving.Responsiblename}
                                                </span>
                                            }
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="hour-block unavailable">
                                    <label>Nenhum horário configurado</label>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SquaresavingListPage;
