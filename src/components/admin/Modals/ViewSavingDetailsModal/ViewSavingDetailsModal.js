import "./ViewSavingDetailsModal.css";
import React, { useState } from "react";
import { maskPhone } from "../../../../utils/masks";
import { toast } from "react-toastify";
import ConfirmModal from "../../../common/Modals/ConfirmModal/ConfirmModal";
import squaresavingApi from "../../../../services/apiServices/squaresavingApi";

const ViewSavingDetailsModal = ({ isOpen, onClose, saving, onDeleteSuccess }) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    if (!isOpen || !saving) return null;

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(saving.Responsibleemail);
        toast.success("E-mail copiado!");
    };

    const whatsappLink = `https://wa.me/${saving.Responsiblephone.replace(/\D/g, '')}`;

    const handleDeleteClick = () => {
        setIsConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        setIsConfirmOpen(false);
        try {
            await squaresavingApi.delete(saving.Code);
            toast.success("Reserva excluída com sucesso!");
            onDeleteSuccess();
            onClose();
        } catch (error) {
            toast.error("Erro ao excluir a reserva.");
        }
    };

    return (
        <div className="modal-backdrop-register">
            <div className="modal-container-register">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2 className="form-title">Detalhes da Reserva</h2>

                <div className="saving-info-group">
                    <label className="saving-info-label">Responsável:</label>
                    <span>{saving.Responsiblename || "Não informado"}</span>
                </div>

                <div className="saving-info-group">
                    <label className="saving-info-label">Telefone:</label>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="option-link clickable">
                        <span>
                            {maskPhone(saving.Responsiblephone)}
                            🔗
                        </span>
                    </a>
                </div>

                <div className="saving-info-group">
                    <label className="saving-info-label">E-mail:</label>
                    <span>{saving.Responsibleemail} <span className="clickable" onClick={handleCopyEmail}>📝</span></span>
                </div>

                <div className="saving-info-group">
                    <label className="saving-info-label">Data:</label>
                    <span>{saving.Date}</span>
                </div>

                <div className="saving-info-group">
                    <label className="saving-info-label">Observação:</label>
                    <span>{saving.Observation || "Sem observação"}</span>
                </div>

                <div className="option-next-register">
                    <button type="button" className="main-button danger" onClick={handleDeleteClick}>
                        Excluir Reserva
                    </button>
                    <button type="button" className="main-button" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Confirmar Exclusão"
                message="Deseja realmente excluir a reserva? Essa ação não poderá ser desfeita!"
                onYes={handleDeleteConfirm}
                onNo={() => setIsConfirmOpen(false)}
                yesLabel="Sim, Excluir"
                noLabel="Cancelar"
            />
        </div>
    );
};

export default ViewSavingDetailsModal;
