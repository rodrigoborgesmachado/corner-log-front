import React, { useEffect, useState } from 'react';
import familyStatusApi from '../../../services/apiServices/userApi';
import './FilterComponent.css';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../../services/redux/loadingSlice';

const FilterComponent = ({ placeHolder, showTermFilter, showStartDate=false, showEndDate=false, showFamilyStatus=false, submitFilter, exportFunction }) => {
  const dispatch = useDispatch();
  const [term, setTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [familyStatusList, setFamilyStatusList] = useState([]);
  const [showMoreFilter, setShowMoreFilter] = useState(false);
  const [filter, setFilter] = useState({
    familyStatusId: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  };

  const handleSubmit = () => {
    submitFilter({
      term: term || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      familyStatusId: filter.familyStatusId || undefined,
    });
  };

  useEffect(() => {
    const fetchFamilyStatus = async () => {
        try {
            const response = await familyStatusApi.getAllFamilyStatuses();
            setFamilyStatusList(response);
        } catch (error) {
            toast.error('Erro ao carregar as marcas!');
        }
    };

    const fetchData = async () => {
        try {
            dispatch(setLoading(true));
            if(showFamilyStatus)
              await fetchFamilyStatus();
        } finally {
            dispatch(setLoading(false));
        }
    };

    fetchData();
  }, [showFamilyStatus, dispatch]);

  const exportReport = () => {
    exportFunction({
      term: term || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      familyStatusId: filter.familyStatusId || undefined,
    });
  };

  return (
    <div className="filter-container">
      <div className='filter-container-main'>
        <div className='filter-itens'>
          <div className='filter-basic'>
            {showTermFilter && (
              <div className='filter-basic-item'>
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
            {showStartDate && (
              <div className='filter-basic-item'>
                <span>Data Inicial</span>
                <input
                  type="date"
                  placeholder="Data Inicial"
                  className="main-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            )}
            {showEndDate && (
              <div className='filter-basic-item'>
                <span>Data Final</span>
                <input
                  type="date"
                  placeholder="Data Final"
                  className="main-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className='filter-buttons'>
          <button onClick={handleSubmit} className="main-button margin-top-default">
            Filtrar
          </button>
          {
            exportFunction && (
              <button onClick={exportReport} className="main-button margin-top-default">
                Exportar
              </button>
            )
          }

          {
            showFamilyStatus ? 
              <button onClick={() => setShowMoreFilter(prev => !prev)} className="main-button margin-top-default">
                {
                  showMoreFilter ? 
                  'Menos Filtros'
                  :
                  'Mais Filtros'
                }
              </button>
              : 
              <></>
          }
        </div>
      </div>

      {
        showMoreFilter &&
        <div className='filters-more'>
          {
            showFamilyStatus && 
            <div className="filters-more-item">
                <label>
                    Status:
                </label>

                <select
                    name="familyStatusId"
                    className="main-input"
                    value={filter.ModelCode}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Selecione o Status</option>
                    {familyStatusList.map((obj) => (
                        <option key={obj.Id} value={obj.Id}>
                            {obj.Description}
                        </option>
                    ))}
                </select>
            </div>
          }
        </div>
      }
    </div>
  );
};

export default FilterComponent;
