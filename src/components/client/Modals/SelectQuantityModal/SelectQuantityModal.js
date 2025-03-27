// components/client/Modals/SelectQuantityModal/SelectQuantityModal.js
import React, { useState } from "react";
import "./SelectQuantityModal.css";

const SelectQuantityModal = ({ isOpen, onClose, onConfirm }) => {
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (quantity > 0) {
            onConfirm(quantity);
            setQuantity(1); // reset after use
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-register">
            <div className="modal-container-register">
                <button className="close-button" onClick={onClose}>&times;</button>
                <form onSubmit={handleSubmit} className="register-form">
                    <h2 className="form-title">Quantidade do Produto</h2>

                    <div className="form-group-register">
                        <div className="form-group-inside">
                            <label>Quantidade</label>
                            <input
                                type="number"
                                className="main-input"
                                min={1}
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="option-next-register">
                        <button className="main-button" type="button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button className="main-button" type="submit">
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SelectQuantityModal;
