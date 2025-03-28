import React, { useState, useEffect } from 'react';
import './EntityListPage.css';
import entityApi from '../../../services/apiServices/entityApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../services/configService';
import Pagination from '../../../components/common/Pagination/Pagination'; 
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../utils/functions';
import FilterComponent from '../../../components/admin/FilterComponent/FilterComponent';
import { maskCNPJ } from '../../../utils/masks';
import { useNavigate } from 'react-router-dom';
import EyeIcon from '../../../components/icons/EyeIcon';
import EditIcon from '../../../components/icons/EditIcon';

const EntityListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalItens, setTotalItens] = useState(0);
    const quantity = configService.getDefaultNumberOfItemsTable(); 
    const orderBy = "Created:Desc";

    useEffect(() => {
        const fetchItems = async () => {
            dispatch(setLoading(true));
            try {
                const response = await entityApi.getPaginated({ page, quantity, orderBy, term: searchTerm, startDate, endDate, include: "Users,Users.User,Squares" });

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
    }, [page, quantity, searchTerm, startDate, endDate, dispatch]);

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
            const response = await entityApi.export({ term: term, startDate, endDate });

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

    return (
    <div className="container-admin-page">
        <div className='title-with-options'>
            <h1>Empresas</h1>
            <button className='main-button' onClick={() => navigate('adicionar')}>Nova Empresa</button>
        </div>
        <div className='container-admin-page-filters div-with-border'>
            <h3>Filtros</h3>
            <FilterComponent placeHolder={'Nome'} showTermFilter={true} showStartDate={true} showEndDate={true} submitFilter={search} exportFunction={exportFunction}/>
        </div>
        <div className='container-admin-page-table div-with-border'>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Criação</th>
                        <th>Nome Fantasia</th>
                        <th>Nome</th>
                        <th>Documento</th>
                        <th>Atualização</th>
                        <th>Qt Quadras</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.Code}>
                        <td data-label='Criação'><span>{putDateOnPattern(item.Created)}</span></td>
                        <td data-label='Nome Fantasia'><span>{item.Tradename}</span></td>
                        <td data-label='Nome'><span>{item.Corporatename}</span></td>
                        <td data-label='Documento'><span>{maskCNPJ(item.Document)}</span></td>
                        <td data-label='Atualização'><span>{putDateOnPattern(item.Updated)}</span></td>
                        <td data-label='Qt. Quadras'><span>{item.Squares.length}</span></td>
                        <td className='flex-row align-end gap-default'>
                            <span className='option-link' onClick={() => navigate('editar/' + item.Code)}><EditIcon/></span>
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

export default EntityListPage;

