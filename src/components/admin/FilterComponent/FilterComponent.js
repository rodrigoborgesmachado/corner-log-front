import React, { useState } from "react";
import "./FilterComponent.css";

const FilterComponent = ({ 
    placeHolder, 
    showTermFilter, 
    showEntityFilter = false, 
    entityList = [], 
    submitFilter 
}) => {
    const [term, setTerm] = useState("");
    const [selectedEntity, setSelectedEntity] = useState("");

    const handleSubmit = () => {
        submitFilter({
            term: term || undefined,
            entityCode: selectedEntity || undefined,
        });
    };

    return (
        <div className="filter-container">
            <div className="filter-container-main">
                <div className="filter-itens">
                    <div className="filter-basic">
                        {showTermFilter && (
                            <div className="filter-basic-item">
                                <span>Filtro</span>
                                <input
                                    type="text"
                                    placeholder={placeHolder}
                                    className="main-input"
                                    value={term}
                                    onChange={(e) => setTerm(e.target.value)}
                                />
                            </div>
                        )}
                        {showEntityFilter && (
                            <div className="filter-basic-item">
                                <span>Empresa</span>
                                <select
                                    className="main-input"
                                    value={selectedEntity}
                                    onChange={(e) => setSelectedEntity(e.target.value)}
                                >
                                    <option value="">Selecione uma empresa</option>
                                    {entityList.map((entity) => (
                                        <option key={entity.Code} value={entity.Code}>
                                            {entity.Tradename}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div className="filter-buttons">
                    <button onClick={handleSubmit} className="main-button margin-top-default">
                        Filtrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterComponent;