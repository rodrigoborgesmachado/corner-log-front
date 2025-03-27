import './AddProductModal.css';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../services/redux/loadingSlice';
import productApi from '../../../services/apiServices/productApi';
import { toast } from 'react-toastify';

const AddProductModal = ({ isOpen, onClose, onSubmit, codeProduct = null }) => {
    const entityCode = useSelector((state) => state.auth.EntityCode);
    const dispatch = useDispatch();
    const [product, setProduct] = useState({
        Images: [],
        Entitycode: entityCode,
        Description: '',
        Quantitystock: '',
        Price: '',
        Observation: '',
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productApi.getByCode(codeProduct, {include: "ProductImage"});
                setProduct(response);
            } catch (error) {
                toast.error('Erro ao carregar o produto!');
            }
        };

        const fetchData = async () => {
            try {
                dispatch(setLoading(true));
                if (codeProduct) {
                    await fetchProduct();
                }
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchData();
    }, [codeProduct, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                newImages.push({ base64: reader.result });
                if (newImages.length === files.length) {
                    setProduct((prevState) => ({
                        ...prevState,
                        Images: [...prevState.Images, ...newImages],
                    }));
                }
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImageDelete = (index) => {
        setProduct((prevState) => ({
            ...prevState,
            Images: prevState.Images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(product);
        clear();
        onClose();
    };

    const clear = () => {
        setProduct({
            Images: [],
            Entitycode: entityCode,
            Description: '',
            Quantitystock: '',
            Price: '',
            Observation: '',
        });
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-register">
            <div className="modal-container-register">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className='form-group-register'>
                        <div className='form-group-inside'>
                            <label>Descrição:</label>
                            <input
                                type="text"
                                name="Description"
                                value={product.Description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='form-group-register'>
                        <div className='form-group-inside'>
                            <label>Quantidade em Estoque:</label>
                            <input
                                type="number"
                                name="Quantitystock"
                                value={product.Quantitystock}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='form-group-register'>
                        <div className='form-group-inside'>
                            <label>Preço:</label>
                            <input
                                type="number"
                                name="Price"
                                value={product.Price}
                                onChange={handleInputChange}
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div className='form-group-register'>
                        <div className='form-group-inside'>
                            <label>Observação:</label>
                            <textarea
                                name="Observation"
                                value={product.Observation}
                                onChange={handleInputChange}
                                rows="8"
                            />
                        </div>
                    </div>

                    <div className="form-group-register">
                        <div className='form-group-inside'>
                            <div className='add-image-option'>
                                <label>Imagens:</label>
                                <label className='main-button' onClick={handleButtonClick}>
                                    Adicionar
                                </label>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <div className="form-group-register form-group-inside">
                        <div className="image-preview-container">
                            {product.Images && product.Images.map((image, index) => (
                                <div key={index} className="image-preview">
                                    <img src={image.base64} alt={`Product ${index + 1}`} />
                                    <button type="button" onClick={() => handleImageDelete(index)}>
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group-register option-next-register">
                        <button className="main-button" type="button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button className="main-button" type="submit">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;