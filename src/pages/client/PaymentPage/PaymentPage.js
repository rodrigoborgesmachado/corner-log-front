import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../services/redux/loadingSlice";
import { toast } from "react-toastify";
import "./PaymentPage.css";
import productPaymentApi from "../../../services/apiServices/productPaymentApi";
import cashApi from "../../../services/apiServices/cashregisterApi";
import configService from "../../../services/configService";
import { putDateOnPattern } from "../../../utils/functions";
import OpenCashModal from '../../../components/client/Modals/OpenCashModal/OpenCashModal';
import CloseCashModal from '../../../components/client/Modals/CloseCashModal/CloseCashModal';
import SellProductModal from "../../../components/client/Modals/SellProductModal/SellProductModal";
import SelectQuantityModal from "../../../components/client/Modals/SelectQuantityModal/SelectQuantityModal";
import FilterComponent from "../../../components/admin/FilterComponent/FilterComponent";
import Pagination from "../../../components/common/Pagination/Pagination";
import squaresavingpaymentApi from "../../../services/apiServices/squaresavingpaymentsApi";
import AddSquarePaymentModal from "../../../components/client/Modals/AddSquarePaymentModal/AddSquarePaymentModal";

const PaymentPage = () => {
    const dispatch = useDispatch();
    const [isCashOpen, setIsCashOpen] = useState(false);
    const [squarePayments, setSquarePayments] = useState([]);
    const [productPayments, setProductPayments] = useState([]);

    // Square Pagination
    const [squarePage, setSquarePage] = useState(1);
    const [squareTotalPages, setSquareTotalPages] = useState(1);
    const [squareTotalItems, setSquareTotalItems] = useState(0);

    // Product Pagination
    const [productPage, setProductPage] = useState(1);
    const [productTotalPages, setProductTotalPages] = useState(1);
    const [productTotalItems, setProductTotalItems] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");
    const [isOpenCashModal, setIsOpenCashModal] = useState(false);
    const [isCloseCashModalOpen, setIsCloseCashModalOpen] = useState(false);
    const [isSellProductModalOpen, setIsSellProductModalOpen] = useState(false);
    const [isSelectQuantityModalOpen, setIsSelectQuantityModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAddSquarePaymentModalOpen, setIsAddSquarePaymentModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const quantity = configService.getDefaultNumberOfItemsTable();
    const orderBy = "Id:Desc";

    useEffect(() => {
        const loadSquarePayments = async () => {
            try {
                dispatch(setLoading(true));
                const cash = await cashApi.getCurrentCash();
                setIsCashOpen(!!cash);

                const response = await squaresavingpaymentApi.getPaginated({
                    page: squarePage,
                    quantity,
                    orderBy,
                    currentCash: true,
                    include: 'Payment,SquareSaving.Squareconfiguration.Square',
                });

                setSquarePayments(response.Results || []);
                setSquareTotalPages(response.TotalPages);
                setSquareTotalItems(response.TotalCount);
            } catch (error) {
                toast.error("Erro ao carregar dados de pagamentos de quadras.");
            } finally {
                dispatch(setLoading(false));
            }
        };

        loadSquarePayments();
    }, [dispatch, refresh, squarePage, quantity]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                dispatch(setLoading(true));
                const response = await productPaymentApi.getPaginated({
                    page: productPage,
                    quantity,
                    term: searchTerm,
                    orderBy,
                    include: "Payment,Product",
                    currentCash: true
                });

                setProductPayments(response.Results || []);
                setProductTotalPages(response.TotalPages);
                setProductTotalItems(response.TotalCount);
            } catch (error) {
                toast.error("Erro ao carregar os pagamentos de produtos.");
                setProductPayments([]);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchProducts();
    }, [dispatch, refresh, productPage, searchTerm, quantity]);

    const handleProductSearch = ({ term }) => {
        setSearchTerm(term);
        setProductPage(1);
    };

    const handleSquarePageChange = (newPage) => {
        if (newPage > 0 && newPage <= squareTotalPages) {
            setSquarePage(newPage);
        }
    };

    const handleProductPageChange = (newPage) => {
        if (newPage > 0 && newPage <= productTotalPages) {
            setProductPage(newPage);
        }
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setIsSelectQuantityModalOpen(true);
    };

    const handleConfirmQuantity = async (quantity) => {
        try {
            dispatch(setLoading(true));
            await productPaymentApi.create({
                Quantity: quantity,
                Paid: selectedProduct.Price * quantity,
                Observacao: "",
                Term: selectedProduct.Code
            });

            toast.success("Produto vendido com sucesso!");
            setRefresh(prev => !prev);
        } catch {
            toast.error("Erro ao vender o produto.");
        } finally {
            dispatch(setLoading(false));
            setIsSelectQuantityModalOpen(false);
            setSelectedProduct(null);
        }
    };

    const getWeekdayName = (day) => {
        const days = [
            "Domingo",
            "Segunda-feira",
            "Terça-feira",
            "Quarta-feira",
            "Quinta-feira",
            "Sexta-feira",
            "Sábado"
        ];
        return days[day-1] ?? "Dia inválido";
    };

    return (
        <div className="container-admin-page">
            <OpenCashModal isOpen={isOpenCashModal} onClose={() => setIsOpenCashModal(false)} onSubmit={() => setRefresh(prev => !prev)} />
            <CloseCashModal isOpen={isCloseCashModalOpen} onClose={() => setIsCloseCashModalOpen(false)} onSubmit={() => setRefresh(prev => !prev)} />
            <SellProductModal isOpen={isSellProductModalOpen} onClose={() => setIsSellProductModalOpen(false)} onSelect={handleProductSelect} />
            <SelectQuantityModal isOpen={isSelectQuantityModalOpen} onClose={() => setIsSelectQuantityModalOpen(false)} onConfirm={handleConfirmQuantity} />
            <AddSquarePaymentModal isOpen={isAddSquarePaymentModalOpen} onClose={() => setIsAddSquarePaymentModalOpen(false)} onSubmit={() => setRefresh(prev => !prev)} />

            <div className="title-with-options">
                <h1>Gerenciamento de Pagamentos</h1>
                <button className="main-button" onClick={() => setIsCashOpen(!isCashOpen ? setIsOpenCashModal(true) : setIsCloseCashModalOpen(true))}>
                    {isCashOpen ? "Fechar Caixa" : "Abrir Caixa"}
                </button>
            </div>

            <div className="payment-status">
                <strong>Status do Caixa:</strong>
                <span className={isCashOpen ? "text-green" : "text-red"}>{isCashOpen ? "Aberto" : "Fechado"}</span>
            </div>

            <div className="container-admin-page-table div-with-border">
                <div className="title-with-options">
                    <h2>🛒 Pagamentos de Produtos</h2>
                    <button className="main-button" disabled={!isCashOpen} onClick={() => setIsSellProductModalOpen(true)}>Adicionar Pagamento</button>
                </div>

                {isCashOpen && (
                    <div className="container-admin-page-filters">
                        <h3>Filtro</h3>
                        <FilterComponent
                            placeHolder="Produto"
                            showTermFilter={true}
                            submitFilter={handleProductSearch}
                        />
                    </div>
                )}

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Observação</th>
                            <th>Produto</th>
                            <th>Quantidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productPayments.map(p => (
                            <tr key={p.Code}>
                                <td data-label="Data">{putDateOnPattern(p.Created)}</td>
                                <td data-label="Valor">R$ {p.Payment.Paid.toFixed(2)}</td>
                                <td data-label="Observação">{p.Observation || "–"}</td>
                                <td data-label="Produto">{p.Product?.Description || "–"}</td>
                                <td data-label="Quantidade">{p.Quantity || "–"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <sub>Total de Itens: {productTotalItems}</sub>
                <Pagination page={productPage} totalPages={productTotalPages} onPageChange={handleProductPageChange} />
            </div>

            <div className="container-admin-page-table div-with-border">
                <div className="title-with-options">
                    <h2>💡 Pagamentos da Quadra</h2>
                    <button className="main-button" disabled={!isCashOpen} onClick={() => setIsAddSquarePaymentModalOpen(true)}>Adicionar Pagamento</button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Quadra</th>
                            <th>Dia</th>
                            <th>Horário</th>
                            <th>Observação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {squarePayments.map(p => (
                            <tr key={p.Code}>
                                <td data-label="Data">{putDateOnPattern(p.Created)}</td>
                                <td data-label="Valor">R$ {p.Payment.Paid.toFixed(2)}</td>
                                <td data-label="Quadra">{getWeekdayName(p.SquareSaving.Squareconfiguration.Dayofweek)}</td>
                                <td data-label="Dia">{p.SquareSaving.Squareconfiguration.Square.Name}</td>
                                <td data-label="Horário">{p.SquareSaving.Squareconfiguration.Starttime} - {p.SquareSaving.Squareconfiguration.Endtime}</td>
                                <td data-label="Observação">{p.Observation || "–"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <sub>Total de Itens: {squareTotalItems}</sub>
                <Pagination page={squarePage} totalPages={squareTotalPages} onPageChange={handleSquarePageChange} />
            </div>
        </div>
    );
};

export default PaymentPage;