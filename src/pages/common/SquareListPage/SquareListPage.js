import React, { useState, useEffect } from 'react';
import './SquareListPage.css';
import squareApi from '../../../services/apiServices/squareApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch, useSelector } from 'react-redux';
import configService from '../../../services/configService';
import Pagination from '../../../components/common/Pagination/Pagination'; 
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../utils/functions';
import FilterComponent from '../../../components/admin/FilterComponent/FilterComponent';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../../../components/icons/EditIcon';
import EyeIcon from '../../../components/icons/EyeIcon';
import AddSquareModal from '../../../components/client/Modals/AddSquareModal/AddSquareModal';

const SquareListPage = () => {
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
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
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await squareApi.getPaginated({ page, quantity, orderBy, term: searchTerm, startDate, endDate, include: "Entity,Entity.Entityimages" });

                setItems(response.Results);
                setTotalPages(response.TotalPages);
                setTotalItens(response.TotalCount);
            } catch (error) {
                toast.error('Erro ao buscar os itens.');
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchItems();
    }, [page, quantity, searchTerm, startDate, endDate, refresh, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const search = ({term, startDate, endDate} = {}) => {
        setSearchTerm(term);
        setStartDate(startDate);
        setEndDate(endDate);
    }

    const exportFunction = async ({term}) => {
        try {
            dispatch(setLoading(true));
            const response = await squareApi.export({ term: term, startDate, endDate });

            if (response.Status === 200 && response.Object) {
                window.open(response.Object, "_blank");
                toast.success('Relatório gerado com sucesso!');
            } else {
                toast.error('Erro ao gerar o relatório');
            }
        } catch (error) {
            toast.error('Erro ao gerar o relatório');
        }
        finally{
            dispatch(setLoading(false));
        }
    };

    const createNewItem = async (square) =>{
        try{
            dispatch(setLoading(true));
            var response = await squareApi.create(square);

            toast.success(response.Name + ' criado com sucesso!');
            setRefresh((prev) => !prev);
        }
        catch(error){
            toast.error('Error: ' + error);
        }
        finally{
            dispatch(setLoading(false));
        }
    }

    const updateItem = async (square) =>{
        try{
            dispatch(setLoading(true));
            var response = await squareApi.update(editCode, square);

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
        <AddSquareModal isOpen={isModalRegisterOpen} onClose={closeRegisterModal} onSubmit={createNewItem}/>
        <AddSquareModal isOpen={isModalEditOpen} onClose={closeEditModal} onSubmit={updateItem} codeSquare={editCode}/>
        {
            isAdmin ?
            <h1>Quadras</h1>
            :
            <div className='title-with-options'>
                <h1>Quadras</h1>
                <button className='main-button' onClick={openRegisterModal}>Nova Quadra</button>
            </div>
        }
        <div className='container-admin-page-filters div-with-border'>
            <h3>Filtros</h3>
            <FilterComponent placeHolder={'Descrição'} showTermFilter={true} showStartDate={true} showEndDate={true} submitFilter={search} exportFunction={exportFunction}/>
        </div>
        <div className='container-admin-page-table div-with-border'>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Criação</th>
                        <th>Empresa</th>
                        <th>Nome</th>
                        <th>Atualização</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.Code}>
                        <td data-label='Criação'><span>{putDateOnPattern(item.Created)}</span></td>
                        <td data-label='Empresa'><span>{item.Entity.Tradename}</span></td>
                        <td data-label='Nome'><span>{item.Name}</span></td>
                        <td data-label='Atualização'><span>{putDateOnPattern(item.Updated)}</span></td>
                        <td className='flex-row align-end gap-default'>
                            <span className='option-link' onClick={() => openEditModal(item.Code) }><EditIcon/></span>
                            <span className='option-link' onClick={() => navigate('' + item.Code)}><EyeIcon/></span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <sub>Total de Itens: {totalItens}</sub>
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    </div>
    );
};

export default SquareListPage;

