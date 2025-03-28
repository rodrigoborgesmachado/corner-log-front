import React, { useState, useEffect } from "react";
import "./ProductListPage.css";
import productApi from "../../../services/apiServices/productApi";
import entityApi from "../../../services/apiServices/entityApi";
import { setLoading } from "../../../services/redux/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import configService from "../../../services/configService";
import Pagination from "../../../components/common/Pagination/Pagination";
import { toast } from "react-toastify";
import FilterComponent from "../../../components/admin/FilterComponent/FilterComponent";
import { putDateOnPattern } from "../../../utils/functions";
import AddProductModal from "../../../components/client/Modals/AddProductModal/AddProductModal";
import EditIcon from "../../../components/icons/EditIcon";
import { useNavigate } from "react-router-dom";
import EyeIcon from "../../../components/icons/EyeIcon";

const ProductListPage = () => {
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const entityCode = useSelector((state) => state.auth.EntityCode);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [entities, setEntities] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(isAdmin ? null : entityCode);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [editCode, setEditCode] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const quantity = configService.getDefaultNumberOfItemsTable();
    const orderBy = "Created:Desc";

    const openRegisterModal = () => {
        setIsModalRegisterOpen(true);
    }

    const closeRegisterModal = () => {
        setIsModalRegisterOpen(false);
    }

    const openEditModal = (code) => {
        setEditCode(code);
        setIsModalEditOpen(true);
    }

    const closeEditModal = () => {
        setEditCode('');
        setIsModalEditOpen(false);
    }

    useEffect(() => {
        const fetchProducts = async (entityCode) => {
            dispatch(setLoading(true));
            try {
                const response = await productApi.getPaginated({ entityCode, page: 1, quantity, orderBy, include: 'ProductImage' });
                setProducts(response.Results || []);
                setTotalPages(response.TotalPages);
                setTotalItems(response.TotalCount);
                setPage(1);
            } catch (err) {
                toast.error("Erro ao carregar os produtos.");
                setProducts([]);
            } finally {
                dispatch(setLoading(false));
            }
        };

        const fetchEntities = async () => {
            dispatch(setLoading(true));
            try {
                if(isAdmin)
                {
                    const response = await entityApi.getAll();
                    setEntities(response);
                }
                else
                    fetchProducts(entityCode);
            } catch (err) {
                toast.error("Erro ao carregar as entidades.");
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchEntities();
    }, [refresh, dispatch, entityCode, isAdmin, quantity]);

    const fetchProductsByEntity = async (entityCode, term = "", newPage = 1) => {
        dispatch(setLoading(true));
        try {
            const response = await productApi.getPaginated({ entityCode, page: newPage, quantity, orderBy, term, include: 'ProductImage' });
            setProducts(response.Results || []);
            setTotalPages(response.TotalPages);
            setTotalItems(response.TotalCount);
            setPage(newPage);
        } catch (err) {
            toast.error("Erro ao carregar os produtos.");
            setProducts([]);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleSearch = ({ term, entityCode }) => {
        setSearchTerm(term);
        setSelectedEntity(entityCode);

        if (entityCode) {
            fetchProductsByEntity(entityCode, term);
        } else {
            setProducts([]);
            setTotalPages(1);
            setTotalItems(0);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
            if (selectedEntity) {
                fetchProductsByEntity(selectedEntity, searchTerm, newPage);
            }
        }
    };

    const createNewItem = async (product) =>{
        try{
            dispatch(setLoading(true));
            var response = await productApi.create(product);

            toast.success(response.Description + ' criado com sucesso!');
            fetchProductsByEntity(selectedEntity);
        }
        catch(error){
            toast.error('Error: ' + error);
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    const updateItem = async (product) =>{
        try{
            dispatch(setLoading(true));
            var response = await productApi.update(editCode, product);

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

    return (
        <div className="container-admin-page">
            <AddProductModal isOpen={isModalRegisterOpen} onClose={closeRegisterModal} onSubmit={createNewItem}/>
            <AddProductModal isOpen={isModalEditOpen} onClose={closeEditModal} onSubmit={updateItem} codeProduct={editCode}/>
            <div className='title-with-options'>
                <h1>Lista de Produtos</h1>
                <button className='main-button' onClick={openRegisterModal}>Novo Produto</button>
            </div>

            <div className="container-admin-page-filters div-with-border">
                <h3>Filtros</h3>
                <FilterComponent
                    placeHolder={"Descrição do Produto"}
                    showTermFilter={true}
                    submitFilter={handleSearch}
                    entityList={entities}
                    showEntityFilter={isAdmin}
                />
            </div>

            <div className="container-admin-page-table div-with-border">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Última Atualização</th>
                            <th>Preço</th>
                            <th>Estoque</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.Code}>
                                    <td data-label="">
                                        <div className="gap-default align-center">
                                            {product.ProductImage?.length > 0 && product.ProductImage[0].Url && (
                                                <img
                                                    src={product.ProductImage[0].Url}
                                                    alt={product.Description}
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td data-label="Nome">{product.Description}</td>
                                    <td data-label="Atualização">{putDateOnPattern(product.Updated)}</td>
                                    <td data-label="Preço">R$ {product.Price.toFixed(2)}</td>
                                    <td data-label="Estoque">{product.Quantitystock}</td>
                                    <td className='align-end gap-default'>
                                        <span className='option-link' onClick={() => openEditModal(product.Code) }><EditIcon/></span>
                                        <span className='option-link' onClick={() => navigate('' + product.Code)}><EyeIcon/></span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-results">
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <sub>Total de Itens: {totalItems}</sub>
                <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default ProductListPage;