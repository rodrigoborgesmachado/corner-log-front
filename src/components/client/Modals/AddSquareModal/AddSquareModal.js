import './AddSquareModal.css';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../../services/redux/loadingSlice';
import squareApi from '../../../../services/apiServices/squareApi';
import { toast } from 'react-toastify';

const AddSquareModal = ({ isOpen, onClose, onSubmit, codeSquare = null }) => {
    const entitycode = useSelector((state) => state.auth.entitycode);
    const dispatch = useDispatch();
    const [square, setSquare] = useState({
        Images: [],
        Entitycode: entitycode,
        Name: '',
        Observation: ''
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchSquare = async () => {
            try {
                const response = await squareApi.getByCode(codeSquare);
                setSquare(response);
            } catch (error) {
                toast.error('Erro ao carregar o produto!');
            }
        };

        const fetchData = async () => {
            try {
                dispatch(setLoading(true));
                if (codeSquare) {
                    await fetchSquare();
                }
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchData();
    }, [codeSquare, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSquare((prevState) => ({
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
                const base64String = reader.result;
                newImages.push({ base64: base64String });
                if (newImages.length === files.length) {
                    setSquare((prevState) => ({
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
        setSquare((prevState) => ({
            ...prevState,
            SquareImages: prevState.SquareImages.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(square);
        clear();
        onClose();
    };

    const clear = () => {
        setSquare({
            Images: [],
            Entitycode: entitycode,
            Name: '',
            Observation: ''
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
                            <div className='add-option-by-side'>
                                <label>
                                    Quadra:
                                </label>
                            </div>
                            <input
                                type="text"
                                name="Name"
                                value={square.Name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='form-group-register'>
                        <div className='form-group-inside'>
                            <label>
                                Observação:
                            </label>
                            <textarea
                                name="Observation"
                                value={square.Observation}
                                onChange={handleInputChange}
                                required
                                rows="8"
                            />
                        </div>
                    </div>

                    {
                        !codeSquare && 
                        <>
                            <div className="form-group-register">
                                <div className='form-group-inside'>
                                    <div className='add-image-option'>
                                        <label>
                                            Imagens:
                                        </label>
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
                                    {square.SquareImages && square.SquareImages.map((image, index) => (
                                        <div key={index} className="image-preview">
                                            <img src={image.base64} alt={`Square ${index + 1}`} />
                                            <button type="button" onClick={() => handleImageDelete(index)}>
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    }

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

export default AddSquareModal;
