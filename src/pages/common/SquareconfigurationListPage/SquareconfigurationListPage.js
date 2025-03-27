import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoading } from "../../../services/redux/loadingSlice";
import squareApi from "../../../services/apiServices/squareApi";
import squareConfigApi from "../../../services/apiServices/squareconfigurationApi";
import "./SquareconfigurationListPage.css";
import AddSquareConfigurationModal from "../../../components/client/Modals/AddSquareConfigurationModal/AddSquareConfigurationModal";
import DeleteIcon from "../../../components/icons/DeleteIcon";
import ConfirmModal from "../../../components/common/Modals/ConfirmModal/ConfirmModal";

const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const SquareconfigurationListPage = () => {
    const dispatch = useDispatch();
    const [squares, setSquares] = useState([]);
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [configurations, setConfigurations] = useState([]);
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [deleteConfiguration, setDeleteConfiguration] = useState(false);
    const [deleteUniqueConfiguration, setDeleteUniqueConfiguration] = useState(false);

    const openRegisterModal = () => {
        setIsModalRegisterOpen(true);
    };

    const closeRegisterModal = () => {
        setIsModalRegisterOpen(false);
    };

    const openDeleteModal = (code) => {
        setDeleteConfiguration(code)
        setIsModalDeleteOpen(true);
    };

    const cancelDeleteModal = () => {
        openDeleteUniqueModal(deleteConfiguration);
        closeDeleteModal();
    };

    const closeDeleteModal = () => {
        setIsModalDeleteOpen(false);
    };

    const openDeleteUniqueModal = (code) => {
        setDeleteConfiguration(code)
        setDeleteUniqueConfiguration(true);
    };

    const closeDeleteUniqueModal = () => {
        setDeleteUniqueConfiguration(false);
        setDeleteConfiguration('');
    };

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
            setConfigurations([]);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDeleteConfiguration = async (configCode) => {
        dispatch(setLoading(true));
        try {
            await squareConfigApi.delete(configCode);
            toast.success("Configuração removida com sucesso!");
            closeDeleteUniqueModal();
            setDeleteConfiguration('');

            fetchConfiguration(selectedSquare);
        } catch (err) {
            toast.error("Erro ao remover a configuração.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleDeleteAllConfiguration = async (configCode) => {
        dispatch(setLoading(true));
        try {
            await squareConfigApi.deleteAllLike(configCode);
            toast.success("Configuração removida de todos os dias com sucesso!");
            closeDeleteModal();
            setDeleteConfiguration('');

            fetchConfiguration(selectedSquare);
        } catch (err) {
            toast.error("Erro ao remover a configuração.");
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
            <AddSquareConfigurationModal 
                isOpen={isModalRegisterOpen} 
                onClose={closeRegisterModal} 
                onSubmit={() => fetchConfiguration(selectedSquare)} 
                squareCode={selectedSquare} 
            />
            <ConfirmModal 
                confirmData={deleteConfiguration} 
                isOpen={isModalDeleteOpen} 
                message={"Deseja excluir o horário de todos os dias?"} 
                onNo={cancelDeleteModal} 
                onYes={handleDeleteAllConfiguration} 
                title={"Excluir Horário"} 
            />
            <ConfirmModal 
                confirmData={deleteConfiguration} 
                isOpen={deleteUniqueConfiguration} 
                message={"Deseja excluir apenas o horário?"} 
                onNo={closeDeleteUniqueModal} 
                onYes={handleDeleteConfiguration} 
                title={"Excluir Horário"} 
            />

            <div className="title-with-options">
                <h1 className="entity-title">Configuração de Quadra</h1>
                <button className="main-button" disabled={!selectedSquare} onClick={openRegisterModal}>Adicionar Horário</button>
            </div>

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
                    {daysOfWeek.map((day, dayIndex) => {
                        const dayConfigs = configurations.filter(config => config.Dayofweek === dayIndex + 1);

                        return (
                            <div key={dayIndex} className="config-card">
                                <h2>{day}</h2>
                                <div className="config-hours">
                                    {dayConfigs.length > 0 ? (
                                        dayConfigs.map(config => (
                                            <div key={config.Code} className="hour-block hour-block-free">
                                                <div className="config-header">
                                                    <h3>{config.Starttime} - {config.Endtime}</h3>
                                                    <button 
                                                        className="delete-button" 
                                                        onClick={() => openDeleteModal(config.Code)}
                                                    >
                                                        <DeleteIcon color="white"/>
                                                    </button>
                                                </div>
                                                <label>Valor: R$ {config.Price}</label>
                                                <label>{config.Observation || "Sem observação"}</label>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="hour-block available">
                                            <label>Nenhum horário configurado</label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SquareconfigurationListPage;
