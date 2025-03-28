import React, { useState, useEffect } from 'react';
import './PaymentListPage.css';
import paymentApi from '../../../services/apiServices/paymentApi';
import { setLoading } from '../../../services/redux/loadingSlice';
import { useDispatch } from 'react-redux';
import configService from '../../../services/configService';
import Pagination from '../../../components/common/Pagination/Pagination'; 
import { toast } from 'react-toastify';
import { putDateOnPattern } from '../../../utils/functions';
import FilterComponent from '../../../components/admin/FilterComponent/FilterComponent';

const PaymentListPage = () => {
    const dispatch = useDispatch();
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
                const response = await paymentApi.getPaginated({ page, quantity, orderBy, term: searchTerm, startDate, endDate, include: "" });

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
            const response = await paymentApi.export({ term: term, startDate, endDate });

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
        <h1>Lista dos Itens</h1>
        <div className='container-admin-page-filters div-with-border'>
            <h3>Filtros</h3>
            <FilterComponent placeHolder={'Descrição'} showTermFilter={true} showStartDate={true} showEndDate={true} submitFilter={search} exportFunction={exportFunction}/>
        </div>
        <div className='container-admin-page-table div-with-border'>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Created</th>
                        <th>Updated</th>
                        <th>IsActive</th>
                        <th>IsDeleted</th>
                        <th>SquareSavingCode</th>
                        <th>Amount</th>
                        <th>PaymentDate</th>
                        <th>PaymentMethod</th>
                    </tr>
                </thead>
                <tbody>
                {items.map((item) => (
                    <tr key={item.Code}>
                        <td data-label='Code'><span>{item.Code}</span></td>
                        <td data-label='Created'><span>{putDateOnPattern(item.Created)}</span></td>
                        <td data-label='Updated'><span>{putDateOnPattern(item.Updated)}</span></td>
                        <td data-label='IsActive'><span>{item.IsActive}</span></td>
                        <td data-label='IsDeleted'><span>{item.IsDeleted}</span></td>
                        <td data-label='SquareSavingCode'><span>{item.SquareSavingCode}</span></td>
                        <td data-label='Amount'><span>{item.Amount}</span></td>
                        <td data-label='PaymentDate'><span>{putDateOnPattern(item.PaymentDate)}</span></td>
                        <td data-label='PaymentMethod'><span>{item.PaymentMethod}</span></td>
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

export default PaymentListPage;

