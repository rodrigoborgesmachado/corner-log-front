import React, { useState, useEffect } from "react";
import './SellProductModal.css';
import productApi from "../../../../services/apiServices/productApi";
import configService from "../../../../services/configService";
import { setLoading } from "../../../../services/redux/loadingSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "../../../common/Pagination/Pagination";
import FilterComponent from "../../../admin/FilterComponent/FilterComponent";
import { putDateOnPattern } from "../../../../utils/functions";

const SellProductModal = ({ isOpen, onClose, onSelect }) => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const orderBy = "Created:Desc";

    useEffect(() => {
        if (!isOpen) return;

        const fetchProducts = async () => {
            try {
                dispatch(setLoading(true));
                const response = await productApi.getPaginated({
                    term: searchTerm,
                    page,
                    quantity,
                    orderBy,
                    include: 'ProductImage'
                });

                setProducts(response.Results || []);
                setTotalPages(response.TotalPages);
                setTotalItems(response.TotalCount);
            } catch (err) {
                toast.error("Erro ao carregar os produtos.");
                setProducts([]);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchProducts();
    }, [isOpen, quantity, searchTerm, page, dispatch]);

    const handleSearch = ({ term }) => {
        setSearchTerm(term);
        setPage(1); // Reset to page 1 on new search
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop-register">
            <div className="modal-container-register">
                <button className="close-button" onClick={onClose}>&times;</button>

                <h2 className="form-title">Selecionar Produto para Venda</h2>

                <div className="container-admin-page-filters div-with-border">
                    <FilterComponent
                        placeHolder="Descrição do Produto"
                        showTermFilter={true}
                        submitFilter={handleSearch}
                    />
                </div>

                <div className="container-admin-page-table div-with-border">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Preço</th>
                                <th>Estoque</th>
                                <th>Atualização</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.Code}>
                                        <td data-label="Nome">{product.Description}</td>
                                        <td data-label="Preço">R$ {product.Price.toFixed(2)}</td>
                                        <td data-label="Estoque">{product.Quantitystock}</td>
                                        <td data-label="Atualização">{putDateOnPattern(product.Updated)}</td>
                                        <td>
                                            <button
                                                className="main-button"
                                                onClick={() => {
                                                    onSelect(product);
                                                    onClose();
                                                }}
                                            >
                                                Selecionar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-results">Nenhum produto encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <sub>Total de Itens: {totalItems}</sub>
                    <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    );
};

export default SellProductModal;