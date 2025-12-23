import Api from 'api/requests';
import { conditionalClassName } from 'app/functions';
import useDropdownData from 'app/hooks/useDropdownData';
import useTranslations from 'app/hooks/useTranslations';
import { ReactComponent as AddIcon } from 'assets/icons/add.svg';
import { Button, Dropdown, FilterItem, SearchBox } from 'components';
import ExcelButton from 'components/excel-button';
import { EXCEL_EXPORT_KEY } from 'constants/export-to-excel';
import popupTypes from 'constants/popup-types';
import ROUTES from 'constants/routes';
import userStatusType from 'constants/userStatusType';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../redux/actions';
import UserEntry from './components/user-entry';
import './index.scss';

const statusFilters = [
  {
    text: 'cms_users_page_button_all_options',
    type: userStatusType.ALL,
  },
  {
    text: 'cms_users_page_button_active_option',
    type: userStatusType.ACTIVE,
  },
  {
    text: 'cms_users_page_button_not_active_option',
    type: userStatusType.INACTIVE,
  },
];

const UsersPage = (props) => {
  const searchRef = useRef();
  const dispatch = useDispatch();
  const translate = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const usersData = useSelector(store => store.usersData);
  const permissionDropdownData = useDropdownData(getPermissionsData());

  useEffect(() => {
    Api.getUsers({ payload: { [EXCEL_EXPORT_KEY]: 0 } });
  }, []);

  function getPermissionsData() {
    // * CREATE AN OBJECT WITH KEY/VALUE PAIRS REPRESENTING THE BITWISE DATA
    let permissionsObj = {};
    Object.values(ROUTES.ROOT.subs).map((sub) => (permissionsObj = { ...permissionsObj, [sub.permissions]: sub.text }));

    return permissionsObj;
  }

  const onSearchSubmit = (value) => {
    setSearchQuery(value);
  };

  const onFilterChange = (name, value) => {
    if (name === 'permissions' && value === 0) {
      // * IF PERMISSIONS IS UPDATED, BUT EQUAL TO 0 (EMPTY) => REMOVE IT FROM FILTERS
      setFilters((prev) => {
        const { permissions, ...rest } = prev;
        return rest;
      });

      return;
    }

    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getFilters = () => {
    const res = [];
    if (searchQuery) {
      const resetQuery = () => {
        setSearchQuery('');
        searchRef.current?.reset();
      };
      res.push(
        <FilterItem
          key={`users-page-filters-search-query`}
          text={translate('cms_usersPage_filterItem_search') + ' ' + translate(searchQuery)}
          onClick={resetQuery}
        />,
      );
    }

    if (filters) {
      Object.entries(filters).map(([key, value], index) => {
        if (!Array.isArray(value)) {
          let textValue = null;

          if (key === 'status') {
            textValue = statusFilters[value].text;
          } else if (key === 'permissions') {
            let permissionsFiltersText = [];
            Object.entries(permissionDropdownData()).forEach(([bitwiseValue, optionText]) => {
              if (value & bitwiseValue) {
                permissionsFiltersText.push(optionText);
              }
            });

            textValue = [permissionsFiltersText.join(', ')];
          }

          const resetQuery = () => {
            const newState = { ...filters };

            if (key in newState) {
              const { [key]: removedKey, ...rest } = newState;
              setFilters(rest);
            }
          };

          res.push(
            <FilterItem
              key={index}
              text={translate('cms_usersPage_column_' + key) + ': ' + translate(textValue)}
              onClick={resetQuery}
            />,
          );
        }
      });
    }

    if (res.length > 0) {
      const removeAll = () => {
        setSearchQuery('');
        searchRef.current?.reset();
        setFilters({ status: [], permissions: [] });
      };
      res.push(
        <FilterItem
          className={'filters-all'}
          key={`users-page-filters-all`}
          text={translate('cms_users_page_filter_item_remove_all')}
          onClick={removeAll}
        />,
      );
    }
    return res;
  };

  const onAddUserHandler = () => {
    dispatch(Actions.addPopup({
      type: popupTypes.NEW_USER,
      payload: {},
    }));
  };

  const filteredData = filterDropdowns(filterData(usersData, searchQuery), filters, permissionDropdownData());
  const filtersElements = getFilters();
  const filtersWrapper = filtersElements.length > 0 ? 'has-items' : '';
  return (
    <div className={'users-page-wrapper'}>
      <div className="top-area">
        <Button
          className={'users-add-user-button'}
          onClick={onAddUserHandler}
        >
          {translate('cms_usersPage_button_addUser')}
          <span className={'add-user-button-icon-wrapper'}>
                        <AddIcon className={'add-user-icon'} />
                    </span>
        </Button>
        <Dropdown
          value={parseInt(filters.status) >= 0 ? filters.status : ''}
          name={'status'}
          options={statusFilters}
          onChange={onFilterChange}
          className={'dropdown-filter status'}
          placeholder={translate('cms_users_page_button_is_active')}
        />
        <Dropdown
          bitwise
          value={filters.permissions}
          name={'permissions'}
          options={permissionDropdownData()}
          onChange={onFilterChange}
          className={'dropdown-filter status'}
          placeholder={translate('cms_users_page_button_permissions')}
        />
        <SearchBox
          ref={searchRef}
          placeholder={translate('cms_usersPage_searchBox_placeholder')}
          onSubmit={onSearchSubmit}
        />

        <ExcelButton methodName="getUsers" />
      </div>
      <div className={`filters-wrapper${conditionalClassName(filtersWrapper)}`}>
        <FilterItem phantom />
        {filtersElements}
      </div>
      <table className={'table-wrapper'}>
        <thead>
        <tr className={'table-row header'}>
          <th className={'table-cell header size-150'}>{translate('cms_userspage_column_fullname')}</th>
          <th className={'table-cell header size-100'}>{translate('cms_usersPage_column_id')}</th>
          <th className={'table-cell header size-100'}>{translate('cms_usersPage_column_phone')}</th>
          <th className={'table-cell header size-675'}>{translate('cms_usersPage_column_permissions')}</th>
          <th className={'table-cell header size-155'}>{translate('cms_lead_page_permissions_marketers_header')}</th>
          <th className={'table-cell header size-175'}>{translate('cms_usersPage_column_actions')}</th>
        </tr>
        </thead>
        <tbody>
        {filteredData.length > 0 ? filteredData.map((user) => {
          return (
            <UserEntry
              key={`user-entry-${user.full_name}-${user.id}`}
              disabled={user.active === 0}
              full_name={user.full_name}
              is_active={user.active}
              id={user.id}
              id_user={user.id_user}
              phone={user.phone}
              email={user.email}
              bitwise={user.bitwise}
              lead_bitwise={user.lead_bitwise ?? ''}
              marketers={user.marketer ?? ''}
            />
          );
        }) : (
          <tr className="table-row no-result">
            <td colSpan={6} className={'table-cell no-result'}>
              {translate('cms_tableData_noResult')}
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;

function filterData(data, query) {
  const parsedData = JSON.parse(JSON.stringify(data));
  let filteredData = parsedData.filter((user) => user.full_name.toLowerCase().includes(query.toLowerCase()));
  if (filteredData.length > 0) {
    return filteredData;
  }
  filteredData = parsedData.filter((user) => user.id_user.includes(query));
  if (filteredData.length > 0) {
    return filteredData;
  }
  filteredData = parsedData.filter((user) => user.phone.includes(query));
  if (filteredData.length > 0) {
    return filteredData;
  }
  return [];
}

function filterDropdowns(data, filters, permissionDropdownData = {}) {
  let filteredData = JSON.parse(JSON.stringify(data));

  if (parseInt(filters.status) >= 0) {
    let lookForStatus = undefined;

    switch (filters.status) {
      case 1:
        lookForStatus = 1;
        break;
      case 2:
        lookForStatus = 0;
        break;
    }

    if (typeof lookForStatus !== 'undefined') {
      filteredData = filteredData.filter((user) => user.active === lookForStatus);
    }
  }

  if (parseInt(filters.permissions) >= 0) {
    const permissionBitwiseValue = filters.permissions;

    Object.keys(permissionDropdownData).map((bitwiseValue) => {
      // * IF FILTER BITWISE VALUE IS 'INCLUDED' ON THE CURRENT LOOP => ENTER THE STATEMENT AND CONTINUE
      if (permissionBitwiseValue & bitwiseValue) {
        filteredData = filteredData.filter((user) => {
          // * IF THE USER BITWISE VALUE IS 'INCLUDED' ON THE CURRENT LOOP => RETURN THE USER
          if (bitwiseValue & user.bitwise) {
            return user;
          }
        });
      }
    });
  }

  return filteredData;
}
