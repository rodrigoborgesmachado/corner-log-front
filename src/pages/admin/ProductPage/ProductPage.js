import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "../../../services/apiServices/productApi";
import productImageApi from "../../../services/apiServices/productImageApi";
import "./ProductPage.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setLoading } from "../../../services/redux/loadingSlice";
import AddProductModal from "../../../components/admin/Modals/AddProductModal/AddProductModal";
import AddIcon from "../../../components/icons/AddIcon";
import { putDateOnPattern } from "../../../utils/functions";

const ProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { code } = useParams();
    const [product, setProduct] = useState(null);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const fileInputRef = useRef(null);

    const openEditModal = () => setIsModalEditOpen(true);
    const closeEditModal = () => setIsModalEditOpen(false);

    useEffect(() => {
        const fetchProduct = async () => {
            dispatch(setLoading(true));
            try {
                const response = await productApi.getByCode(code, { include: "ProductImage" });
                setProduct(response);
            } catch (err) {
                toast.error("Erro ao carregar os dados do produto.");
                navigate('/');
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchProduct();
    }, [code, refresh, dispatch, navigate]);

    const updateProduct = async (productData) => {
        try {
            dispatch(setLoading(true));
            const response = await productApi.update(productData);
            toast.success(`${response.Description} atualizado com sucesso!`);
            setRefresh(prev => !prev);
        } catch (error) {
            toast.error('Erro ao atualizar o produto: ' + error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleImageDelete = async (code) => {
        try {
            dispatch(setLoading(true));
            await productImageApi.delete(code);
            toast.success('Imagem excluída com sucesso!');
            setRefresh(prev => !prev);
        } catch (error) {
            toast.error('Erro ao excluir imagem: ' + error.message);
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
                    await productImageApi.create({
                        code: product.Code,
                        Base64: reader.result,
                    });
                    toast.success('Imagem adicionada com sucesso!');
                    setRefresh(prev => !prev);
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

    if (!product) return <p className="info-empty">Carregando...</p>;

    return (
        <div className="container-admin-page div-with-border">
            <AddProductModal isOpen={isModalEditOpen} onClose={closeEditModal} onSubmit={updateProduct} codeProduct={code} />
            <div className='title-with-options'>
                <h1 className="info-title">{product.Description}</h1>
                <button className='main-button' onClick={openEditModal}>Editar</button>
            </div>

            <div className="info-details">
                <h2>Informações do Produto</h2>
                <div className="info-group">
                    <strong>Descrição:</strong> <p>{product.Description}</p>
                </div>
                <div className="info-group">
                    <strong>Preço:</strong> <p>R$ {product.Price.toFixed(2)}</p>
                </div>
                <div className="info-group">
                    <strong>Estoque:</strong> <p>{product.Quantitystock}</p>
                </div>
                <div className="info-group">
                    <strong>Observação:</strong> <p>{product.Observation || "Nenhuma"}</p>
                </div>
            </div>

            <div className="info-meta">
                <div className="flex-row gap-default">
                    <h2>Imagens do Produto</h2>
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
                <div className="product-images">
                    {product.ProductImage.map((image, index) => (
                        <div key={index} className='image-preview'>
                            <img src={image.Url} alt={`Produto ${index + 1}`} />
                            <button type="button" onClick={() => handleImageDelete(image.Code)}>Excluir</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="info-meta">
                <h2>Dados Adicionais</h2>
                <p><strong>Criado em:</strong> {putDateOnPattern(product.Created)}</p>
                <p><strong>Última atualização:</strong> {putDateOnPattern(product.Updated)}</p>
                <p><strong>Status:</strong> {product.IsActive ? "Ativo" : "Inativo"}</p>
            </div>
        </div>
    );
};

export default ProductPage;
