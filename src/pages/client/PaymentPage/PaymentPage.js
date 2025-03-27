import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../services/redux/loadingSlice";
import paymentApi from "../../../services/apiServices/paymentApi";
import cashApi from "../../../services/apiServices/cashregisterApi";
import { toast } from "react-toastify";
import { putDateOnPattern } from "../../../utils/functions";
import "./PaymentPage.css";
import OpenCashModal from '../../../components/client/Modals/OpenCashModal/OpenCashModal';
import CloseCashModal from '../../../components/client/Modals/CloseCashModal/CloseCashModal';
import productPaymentApi from "../../../services/apiServices/productPaymentApi";
import SellProductModal from "../../../components/client/Modals/SellProductModal/SellProductModal";
import SelectQuantityModal from "../../../components/client/Modals/SelectQuantityModal/SelectQuantityModal";

const PaymentPage = () => {
    const dispatch = useDispatch();
    const [isCashOpen, setIsCashOpen] = useState(false);
    const [currentCash, setCurrentCash] = useState(false);
    const [squarePayments, setSquarePayments] = useState([]);
    const [productPayments, setProductPayments] = useState([]);
    const [isOpenCashModal, setIsOpenCashModal] = useState(false);
    const [isCloseCashModalOpen, setIsCloseCashModalOpen] = useState(false);
    const [isSellProductModalOpen, setIsSellProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSelectQuantityModalOpen, setIsSelectQuantityModalOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                dispatch(setLoading(true));
                const cash = await cashApi.getCurrentCash();
                setIsCashOpen(!!cash);
                setCurrentCash(cash);

                const payments = await paymentApi.getAllByCurrentCash();
                setSquarePayments(payments);

                const paymentProduct = await productPaymentApi.getAllByCurrentCash({include: 'Payment,Product'});
                setProductPayments(paymentProduct);
            } catch (error) {
                toast.error("Erro ao carregar os dados de pagamento.");
            } finally {
                dispatch(setLoading(false));
            }
        };

        loadData();
    }, [refresh, dispatch]);

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
                Observacao: '',
                Term: selectedProduct.Code
            });
    
            toast.success("Produto vendido com sucesso!");
            setRefresh(prev => !prev);
        } catch (error) {
            toast.error("Erro ao vender produto.");
        } finally {
            dispatch(setLoading(false));
            setIsSelectQuantityModalOpen(false);
            setSelectedProduct(null);
        }
    };

    return (
        <div className="container-admin-page">
            <OpenCashModal 
                isOpen={isOpenCashModal}
                onClose={() => setIsOpenCashModal(false)}
                onSubmit={() => setRefresh((prev) => !prev)}
            />
            <CloseCashModal 
                isOpen={isCloseCashModalOpen}
                onClose={() => setIsCloseCashModalOpen(false)}
                onSubmit={() => setRefresh((prev) => !prev)}
            />
            <SellProductModal 
                isOpen={isSellProductModalOpen}
                onClose={() => setIsSellProductModalOpen(false)}
                onSubmit={() => setRefresh((prev) => !prev)}
                onSelect={handleProductSelect}
            />
            <SelectQuantityModal
                isOpen={isSelectQuantityModalOpen}
                onClose={() => setIsSelectQuantityModalOpen(false)}
                onConfirm={handleConfirmQuantity}
            />
            <div className='title-with-options'>
                <h1>Gerenciamento de Pagamentos</h1>
                <button className='main-button' onClick={() => !isCashOpen ? setIsOpenCashModal(true) : setIsCloseCashModalOpen(true)}>{isCashOpen || currentCash ? "Fechar Caixa" : "Abrir Caixa"}</button>
            </div>
            <div className="payment-status">
                <strong>Status do Caixa:</strong> 
                <span className={isCashOpen ? "text-green" : "text-red"}>
                    {isCashOpen ? "Aberto" : "Fechado"}
                </span>
            </div>

            <div className="container-admin-page-table div-with-border">
                <div className='title-with-options'>
                    <h2>💡 Pagamentos da Quadras</h2>
                    <button className='main-button' disabled={!isCashOpen}>Adicionar Pagamento</button>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Observação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {squarePayments.map((p) => (
                            <tr key={p.Code}>
                                <td data-label="Data">{putDateOnPattern(p.Created)}</td>
                                <td data-label="Valor">R$ {p.Paid.toFixed(2)}</td>
                                <td data-label="Observação">{p.Observation || "–"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="container-admin-page-table div-with-border">
                <div className='title-with-options'>
                    <h2>🛒 Pagamentos de Produtos</h2>
                    <button className='main-button' disabled={!isCashOpen} onClick={() => setIsSellProductModalOpen(true)}>Adicionar Pagamento</button>
                </div>
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
                        {productPayments.map((p) => (
                            <tr key={p.Code}>
                                <td data-label="Data">{putDateOnPattern(p.Created)}</td>
                                <td data-label="Valor">R$ {p.Payment.Paid.toFixed(2)}</td>
                                <td data-label="Observação">{p.Observation || "–"}</td>
                                <td data-label="Produto">{p.Product.Description || "–"}</td>
                                <td data-label="Quantidade">{p.Quantity || "–"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentPage;
