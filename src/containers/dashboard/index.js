import Api from 'api/requests';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useTranslations from '../../app/hooks/useTranslations';
import Card from '../../components/card';
import './index.scss';

export default function Dashboard(props) {
  const translate = useTranslations();
  const homepageStatisticsData = useSelector((store) => store.homepageStatisticsData);

  useEffect(() => {
    getHomepageStatistics();
  }, []);

  const getHomepageStatistics = () => {
    Api.getHomepageStatistics();
  };

  function renderCards() {
    return Object.entries(homepageStatisticsData).map(([statusId, numOfLeads]) => {
      return (
        <Card
          key={statusId}
          index={statusId}
          amount={numOfLeads.toLocaleString()}
          title={translate('cms_leads')}
          clickText={translate('cms_watchClick')}
          path={'leads'}
        />
      );
    });
  }

  return (
    <div className={'dashboard-content'}>
      {homepageStatisticsData && (
        <>
          <h4 className={'dashboard-data-text'}>{translate('cms_dashboard_30_days')}</h4>
          <div className={'cards-container'}>{renderCards()}</div>
        </>
      )}
    </div>
  );
}
