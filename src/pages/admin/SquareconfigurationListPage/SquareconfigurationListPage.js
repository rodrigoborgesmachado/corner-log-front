import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoading } from "../../../services/redux/loadingSlice";
import squareApi from "../../../services/apiServices/squareApi";
import squareConfigApi from "../../../services/apiServices/squareconfigurationApi";
import "./SquareconfigurationListPage.css";

const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const SquareconfigurationListPage = () => {
    const dispatch = useDispatch();
    const [squares, setSquares] = useState([]);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [configurations, setConfigurations] = useState({});

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

    const fetchConfiguration = async (squareCode) => {
        dispatch(setLoading(true));
        try {
            const response = await squareConfigApi.getBySquareCode(squareCode); 
            setConfigurations(response);
        } catch (err) {
            toast.error("Erro ao carregar a configuração da quadra.");
            setConfigurations({});
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSquareChange = (event) => {
        const squareCode = event.target.value;
        setSelectedSquare(squareCode);
        if (squareCode) fetchConfiguration(squareCode);
    };

    return (
        <div className="container-admin-page div-with-border">
            <h1 className="entity-title">Configuração de Quadra</h1>

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
                <div className="square-configurations">
                    {daysOfWeek.map((day, dayIndex) => (
                        <div key={dayIndex} className="config-card">
                            <h2>{day}</h2>
                            <div className="config-hours">
                                {Array.from({ length: 24 }, (_, hour) => {
                                    const isTaken = configurations[dayIndex]?.includes(hour);
                                    return (
                                        <div key={hour} className={`hour-block ${isTaken ? "taken" : "available"}`}>
                                            <label>{hour}:00 - {hour+1}:00</label>
                                            <label>{isTaken ? "Configurado" : "Livre"}</label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SquareconfigurationListPage;
