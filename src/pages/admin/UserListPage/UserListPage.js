import React, { useState, useEffect } from 'react';
import './UserListPage.css';
import userApi from '../../../services/apiServices/userApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../services/configService';
import Pagination from '../../../components/common/Pagination/Pagination'; 
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../utils/functions';
import FilterComponent from '../../../components/admin/FilterComponent/FilterComponent';
import ConfirmModal from '../../../components/common/Modals/ConfirmModal/ConfirmModal';
import AddUserModal from '../../../components/admin/Modals/AddUserModal/AddUserModal';

const UserListPage = () => {
    const dispatch = useDispatch();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const [clientSelected, setClientSelected] = useState();
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const quantity = configService.getDefaultNumberOfItemsTable(); 
    const orderBy = "Created:Desc";

    const openRegisterModal = () => {
        setIsModalRegisterOpen(true);
    }

    const closeRegisterModal = () => {
        setIsModalRegisterOpen(false);
    }

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await userApi.getPaginated({ page, quantity, orderBy, term: searchTerm, startDate, endDate, include: "Userentity,Userentity.Entity" });

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
            const response = await userApi.export({ term: term, startDate, endDate });

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

    const deleteOption = (client) => {
        setClientSelected(client);
        setIsModalDeleteOpen(true);
    }

    const handleYesModalDelete = async (item) => {
        dispatch(setLoading(true));
        try {
            if(item.IsActive) {
                await userApi.inativateAdmin(item.Id);
            } else {
                await userApi.ativateAdmin(item.Id);
            }
            
            toast.success('Usuário atualizado com sucesso!');
            setRefresh(prev => !prev);
        } catch (error) {
            toast.error('Error updating client status:' + error);
        } finally {
            dispatch(setLoading(false));
            setIsModalDeleteOpen(false);
        }
    };
    
    const handleNoModalDelete = () =>{
        setIsModalDeleteOpen(false);
    };

    const createNewItem = async (item) =>{
        try{
            dispatch(setLoading(true));
            var response = await userApi.create(item);

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

    return (
    <div className="container-admin-page">
        <AddUserModal isOpen={isModalRegisterOpen} onClose={closeRegisterModal} onSubmit={createNewItem}/>
        <ConfirmModal
            isOpen={isModalDeleteOpen}
            title={'Atenção'}
            message={`Deseja realmente ${clientSelected?.IsActive ? 'desativar' : 'ativar'} o usuário ${clientSelected?.Email}?`}
            onYes={handleYesModalDelete}
            onNo={handleNoModalDelete}
            yesLabel="Sim"
            noLabel="Não"
            confirmData={clientSelected}
        />
        <div className='title-with-options'>
            <h1>Lista dos Usuários</h1>
            <button className='main-button' onClick={openRegisterModal}>Novo Usuário</button>
        </div>
        <div className='container-admin-page-filters div-with-border'>
            <h3>Filtros</h3>
            <FilterComponent placeHolder={'Descrição'} showTermFilter={true} showStartDate={true} showEndDate={true} submitFilter={search} exportFunction={exportFunction}/>
        </div>
        <div className='container-admin-page-table div-with-border'>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Data Criação</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Última Atualização</th>
                        <th>Entidade</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.Code}>
                        <td data-label='Criação'><span>{putDateOnPattern(item.Created)}</span></td>
                        <td data-label='Nome'><span>{item.Name}</span></td>
                        <td data-label='Email'><span>{item.Email}</span></td>
                        <td data-label='Atualização'><span>{putDateOnPattern(item.Updated)}</span></td>
                        <td data-label='Entidade'>
                            {
                                item.Userentity.map((entity, index) => {
                                    return(
                                        <span key={index}>{entity.Entity.Tradename}</span>
                                    )
                                })
                            }
                        </td>
                        <td data-label='Status'>
                            <button onClick={() => deleteOption(item)} 
                            className={item.IsActive ? 'item-active brighten-on-hover clickable' : 'item-inactive brighten-on-hover clickable'}>
                                {item.IsActive ? 'Ativo' : 'Inativo'}
                            </button>
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

export default UserListPage;

