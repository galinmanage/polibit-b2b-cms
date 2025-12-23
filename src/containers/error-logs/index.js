import Api from 'api/requests';
import { convertDateToTimeStamp, convertTimestampToDateTime, formatDate } from 'app/functions';
import useTranslations from 'app/hooks/useTranslations';
import { Button, FilterItem } from 'components';
import ExcelButton from 'components/excel-button';
import { EXCEL_EXPORT_KEY } from 'constants/export-to-excel';
import { useEffect, useState } from 'react';
import AnimatedInput from '../../components/forms/animated_input';
import './index.scss';

const DATE_TYPES = {
  fromDate: 'from_date',
  toDate: 'to_date',
};

const tableHeaders = [
  { text: 'cms_error_logs_column_lead_id', width: 80 },
  { text: 'cms_error_logs_column_content', width: 400 },
  { text: 'cms_error_logs_column_file', width: 250 },
  { text: 'cms_error_logs_column_function_name', width: 250 },
  { text: 'cms_error_logs_column_timestamp', width: 'auto' },
];

const ErrorLogsPage = () => {
  const translate = useTranslations();
  const [formSearch, setFormSearch] = useState({});
  const [formFilters, setFormFilters] = useState({});
  const [errorLogs, setErrorLogs] = useState([]);

  useEffect(() => {
    getErrorLogs();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    const newFormSearch = { ...formSearch };

    if (!value) {
      const { [name]: keyToRemove, ...rest } = newFormSearch;
      setFormSearch(rest);
      return;
    }

    newFormSearch[name] = value;
    setFormSearch(newFormSearch);
  };

  const getErrorLogs = (filters = {}, isExcel = 0) => {
    if (filters) {
      setFormFilters(filters);
    }

    const newFormSearch = {
      ...filters,
      ...(filters?.[DATE_TYPES.fromDate] && { [DATE_TYPES.fromDate]: convertDateToTimeStamp(filters?.[DATE_TYPES.fromDate], 'start') }),
      ...(filters?.[DATE_TYPES.toDate] && { [DATE_TYPES.toDate]: convertDateToTimeStamp(filters?.[DATE_TYPES.toDate], 'end') }),
      [EXCEL_EXPORT_KEY]: isExcel,
    };

    const onSuccess = (res) => {
      setErrorLogs(res.data.application_error);
    };

    const props = {
      onSuccess: onSuccess,
      payload: newFormSearch,
    };

    Api.getApplicationErrorsLog(props);
  };

  const resetQuery = (key) => {
    const newFormFiltersState = { ...formFilters };

    if (key in newFormFiltersState) {
      const { [key]: removedKey, ...restFilters } = newFormFiltersState;
      setFormFilters(restFilters);
      setFormSearch(restFilters);
      getErrorLogs(restFilters);
    }
  };

  const removeAll = () => {
    setFormFilters({});
    setFormSearch({});
    getErrorLogs({});
  };

  const getFilters = () => {
    if (Object.keys(formFilters).length === 0) {
      return [];
    }

    const filtersArr = [];

    if (formFilters) {
      Object.entries(formFilters).map(([key, value], index) => {
        if (!Array.isArray(value)) {
          const getValue = () => {
            if (key === DATE_TYPES.fromDate || key === DATE_TYPES.toDate) {
              return formatDate(value);
            }
          };

          filtersArr.push(<FilterItem key={index} text={translate('cms_error_logs_column_' + key) + ': ' + getValue()}
                                      onClick={() => resetQuery(key)} />);
        }
      });
    }

    if (filtersArr.length > 0) {
      filtersArr.push(<FilterItem key={'remove'} className={'filters-all'}
                                  text={translate('cms_error_logs_remove_all_filters')} onClick={removeAll} />);
    }

    return filtersArr;
  };

  const submitSearch = () => {
    if (Object.keys(formSearch).length === 0) {
      return;
    }

    getErrorLogs(formSearch);
  };

  const filtersElements = getFilters();
  const filtersWrapper = filtersElements?.length > 0 ? 'has-items' : '';

  return (
    <div className={'error-logs-page-wrapper'}>
      <div className={'filter-container'}>
        <div className={'filter-dates-container'}>
          <div className={'date'}>
            <span className={'date-headline'}>{translate('cms_error_logs_column_from_date')}</span>
            <AnimatedInput
              className={'custom-search-box'}
              name={DATE_TYPES.fromDate}
              type={'date'}
              value={formSearch[DATE_TYPES.fromDate]}
              onChange={onChange}
              {...(formSearch[DATE_TYPES.toDate] && { max: formSearch[DATE_TYPES.toDate] })}
            />
          </div>
          <div className={'date'}>
            <span className={'date-headline'}>{translate('cms_error_logs_column_to_date')}</span>
            <AnimatedInput
              className={'custom-search-box'}
              name={DATE_TYPES.toDate}
              type={'date'}
              value={formSearch[DATE_TYPES.toDate]}
              onChange={onChange}
              {...(formSearch[DATE_TYPES.fromDate] && { min: formSearch[DATE_TYPES.fromDate] })}
            />
          </div>
        </div>

        <Button onClick={submitSearch} className={'search-button'}>
          <span>{translate('cms_error_logs_filter_button')}</span>
        </Button>

        <ExcelButton data={formSearch} methodName="getApplicationErrorsLog" />
      </div>

      <div className={`filters-wrapper ${filtersWrapper}`}>
        <FilterItem phantom />
        {filtersElements}
      </div>

      <table className="table-wrapper">
        <thead>
        <tr className={'table-row header'}>
          {tableHeaders.map(({ text, width = 300 }, idx) => (
            <th key={`header-cell-${text}-${idx}`} className={`table-cell header size-${width}`}>
              {translate(text)}
            </th>
          ))}
        </tr>
        </thead>
        <tbody>
        {errorLogs?.length > 0 ? (
          errorLogs.map((log, idx) => {
            return (
              <tr className={'table-row'} key={`error-logs-table-${log.last_update}-${idx}`}>
                <td className={'table-cell'}>{log.lead_id}</td>
                <td className={'table-cell log-error-content'}>{log.message}</td>
                <td className={'table-cell'}>{log.file}</td>
                <td className={'table-cell'}>{log.function_name}</td>
                <td className={'table-cell date-time-cell'}>{convertTimestampToDateTime(log.last_update)}</td>
              </tr>
            );
          })
        ) : errorLogs ? (
          <tr className={'table-row no-result'}>
            <td colSpan={tableHeaders.length} className={'table-cell no-result'}>
              {translate('cms_tableData_noResult')}
            </td>
          </tr>
        ) : (
          <></>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default ErrorLogsPage;
