import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import squareApi from "../../../services/apiServices/squareApi";
import squareImageApi from "../../../services/apiServices/squareImageApi";
import "./SquarePage.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoading } from "../../../services/redux/loadingSlice";
import { maskCEP, maskCNPJ, maskPhone } from "../../../utils/masks";
import { putDateOnPattern } from "../../../utils/functions";
import AddSquareModal from "../../../components/client/Modals/AddSquareModal/AddSquareModal";
import AddIcon from "../../../components/icons/AddIcon";

const SquarePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { code } = useParams(); 
    const [square, setSquare] = useState(null);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const fileInputRef = useRef(null);

    const openEditModal = () => {
        setIsModalEditOpen(true);
    }

    const closeEditModal = () => {
        setIsModalEditOpen(false);
    }

    useEffect(() => {
        const fetchSquare = async () => {
            dispatch(setLoading(true));
            try {
                const response = await squareApi.getByCode(code, {include: 'Entity,Entity.Entityimages,SquareImages'});
                setSquare(response);
            } catch (err) {
                toast.error("Erro ao carregar os dados da quadra.");
                navigate('/');
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchSquare();
    }, [code, refresh, dispatch, navigate]);

    const updateItem = async (square) =>{
        try{
            dispatch(setLoading(true));
            var response = await squareApi.update(code, square);

            toast.success(response.Name + ' atualizado com sucesso com sucesso!');
            setRefresh((prev) => !prev);
        }
        catch(error){
            toast.error('Error: ' + error);
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    const handleImageDelete = async (code) => {
        try {
          dispatch(setLoading(true));
          
          await squareImageApi.delete(code);

          toast.success('Excluído com sucesso!');
          setRefresh((prev) => !prev);
        } catch (error) {
          toast.error('Houve erro ao excluir: ' + error.message);
        } finally {
          dispatch(setLoading(false));
        }
    };

    const handleAddImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    dispatch(setLoading(true));
                    const base64String = reader.result;
                    await squareImageApi.create({
                        Entitycode: square.Code,
                        Base64: base64String,
                    });

                    toast.success('Imagem adicionada com sucesso!');
                    
                    setRefresh((prev) => !prev);
                } catch (error) {
                    toast.error('Erro ao adicionar imagem: ' + error.message);
                } finally {
                    dispatch(setLoading(false));
                }
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!square) return <p className="info-empty">Carregando</p>;

    return (
        <div className="container-admin-page div-with-border">
            <AddSquareModal isOpen={isModalEditOpen} onClose={closeEditModal} onSubmit={updateItem} codeSquare={code}/>
            <div className='title-with-options'>
                <h1 className="info-title">{square.Name}</h1>
                <button className='main-button' onClick={openEditModal}>Editar</button>
            </div>

            <div className="info-details">
                <h2>Informações da Quadra</h2>
                <div className="info-group">
                    <strong>Nome:</strong> <p>{square.Name}</p>
                </div>
                <div className="info-group">
                    <strong>Observação:</strong> <p>{square.Observation || "Nenhuma"}</p>
                </div>
            </div>

            {square.Entity && (
                <div className="info-address">
                    <h2>Entidade Relacionada</h2>
                    <div className="info-group">
                        <strong>Nome Fantasia:</strong> <p>{square.Entity.Tradename}</p>
                    </div>
                    <div className="info-group">
                        <strong>Razão Social:</strong> <p>{square.Entity.Corporatename}</p>
                    </div>
                    <div className="info-group">
                        <strong>Documento:</strong> <p>{maskCNPJ(square.Entity.Document)}</p>
                    </div>
                    <div className="info-group">
                        <strong>Email:</strong> <p>{square.Entity.Email || "Não informado"}</p>
                    </div>
                    <div className="info-group">
                        <strong>Telefone:</strong> <p>{square.Entity.Phone ? maskPhone(square.Entity.Phone) : "Não informado"}</p>
                    </div>
                </div>
            )}

            <div className="info-address">
                <h2>Endereço</h2>
                <p>{square.Entity.Street}, {square.Entity.Number}</p>
                <p>{square.Entity.Neighborhood} - {square.Entity.City}, {square.Entity.State}</p>
                <p>CEP: {maskCEP(square.Entity.Postalcode)}</p>
            </div>

            <div className="info-meta">
                <div className="flex-row gap-default">
                    <h2>Imagens da Quadra</h2>
                    <div className='clickable' onClick={handleAddImageClick}>
                        <AddIcon />
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <div className="square-images">
                    {square.SquareImages.map((image, index) => (
                        <div className='image-preview'>
                            <img src={image.Url} alt={`${square.Name} - Imagem ${index + 1}`} />
                            <button type="button" onClick={() => handleImageDelete(image.Code)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="info-meta">
                <h2>Dados Adicionais</h2>
                <p><strong>Criado em:</strong> {putDateOnPattern(square.Created)}</p>
                <p><strong>Última atualização:</strong> {putDateOnPattern(square.Updated)}</p>
                <p><strong>Status:</strong> {square.IsActive ? "Ativo" : "Inativo"}</p>
            </div>
        </div>
    );
};

export default SquarePage;
