import Api from 'api/requests';
import { conditionalClassName } from 'app/functions';
import useDropdownData from 'app/hooks/useDropdownData';
import useTranslations from 'app/hooks/useTranslations';
import EditIcon from 'assets/icons/edit.svg';
import TrashIcon from 'assets/icons/trash.svg';
import { ActionButton, PermissionChanger } from 'components';
import { EXCEL_EXPORT_KEY } from 'constants/export-to-excel';
import popupTypes from 'constants/popup-types';
import ROUTES from 'constants/routes';
import { useDispatch, useSelector } from 'react-redux';
import Actions from '../../../../redux/actions';
import './index.scss';
import React from 'react';

const UserEntry = (props) => {
  const {
    full_name,
    id,
    id_user,
    phone,
    bitwise,
    userId,
    email,
    is_active,
    lead_bitwise,
    marketers,
    onChangePermissions = () => {},
    disabled = false,
  } = props;
  const translate = useTranslations();
  const dispatch = useDispatch();

  const leadsStatusesData = useSelector((store) => store.leadsStatusesData);
  const dropdownData = useDropdownData([leadsStatusesData], true);
  const marketersDropdownOptions = {
    ...dropdownData('marketers'),
    0: translate('cms_lead_page_permissions_all_marketers'),
  };

  const canUserAccessLeadsPage = Boolean(
    bitwise & ROUTES.ROOT.subs.LeadsPage.permissions,
  );
  const isMarketerAvailable =
    canUserAccessLeadsPage && (!!marketers || marketers === 0);
  const isLeadBitwiseAvailable = !!lead_bitwise;

  const onEditClick = () => {
    dispatch(
      Actions.addPopup({
        type: popupTypes.NEW_USER,
        payload: {
          isEdit: true,
          userData: {
            full_name,
            phone,
            bitwise,
            id,
            email,
            id_user,
            is_active: 1,
            lead_bitwise,
            marketers,
          },
        },
      }),
    );
  };

  const onActiveClick = () => {
    const onSuccess = () => {
      Api.getUsers({ payload: { [EXCEL_EXPORT_KEY]: 0 } });
    };

    const props = {
      onSuccess,
      payload: {
        id,
        is_active: !is_active,
      },
    };

    Api.setActiveUser(props);
  };

  const disabledClassName = disabled ? 'disabled' : '';
  return (
    <tr className={`table-row${conditionalClassName(disabledClassName)}`}>
      <td className={'table-cell'}>{full_name}</td>
      <td className={'table-cell text-center'}>{id_user}</td>
      <td className={'table-cell text-center'}>{phone}</td>
      <td className={'table-cell'}>
        <div className="users-permissions-wrapper">
          <PermissionChanger
            disabled
            userId={userId}
            userPermissions={bitwise}
            onChange={onChangePermissions}
          />

          {isLeadBitwiseAvailable && (
            <div className="leads-permission-wrapper">
              <div>
                <h4 className={'permissions-headline'}>
                  {translate('cms_lead_page_tabs_view_permissions')}
                </h4>
                <PermissionChanger
                  disabled
                  userPermissions={lead_bitwise}
                  options={ROUTES.ROOT.subs.LeadsPage.subs.LEAD.subs}
                  leadBitwiseKey={'view'}
                />
              </div>

              <div>
                <h4 className={'permissions-headline'}>
                  {translate('cms_lead_page_tabs_edit_permissions')}
                </h4>
                <PermissionChanger
                  disabled
                  userPermissions={lead_bitwise}
                  options={ROUTES.ROOT.subs.LeadsPage.subs.LEAD.subs}
                  leadBitwiseKey={'edit'}
                />
              </div>
            </div>
          )}
        </div>
      </td>
      <td className={'table-cell'}>
        {isMarketerAvailable && (
          <div className={'user-marketers-wrapper'}>
            {marketers.map((marketerId) => {
              return (
                <div
                  title={marketersDropdownOptions[marketers[marketerId]]}
                  className="permission-marketer-data"
                  key={`user_marketer_${marketerId}`}
                >
                  {marketersDropdownOptions[marketerId]}
                </div>
              );
            })}
          </div>
        )}
      </td>
      <td className={'table-cell'}>
        {disabledClassName ? (
          translate('cms_usersPage_deactivatedUser')
        ) : (
          <>
            <ActionButton
              text={translate('cms_usersPage_entry_editUser')}
              icon={EditIcon}
              onClick={onEditClick}
            />
            <ActionButton
              text={translate('cms_usersPage_entry_deactivateUser')}
              icon={TrashIcon}
              onClick={onActiveClick}
            />
          </>
        )}
      </td>
    </tr>
  );
};

export default UserEntry;
