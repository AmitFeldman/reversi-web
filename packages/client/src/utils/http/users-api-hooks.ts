import * as React from 'react';
import {GameType, UserComputedStats} from 'reversi-types';
import {getLeaderboards} from './users-api';

interface useLeaderboardsResultOptions {
  loading: boolean;
  fetch: () => void;
}

type useLeaderboardsResult = [
  UserComputedStats[],
  useLeaderboardsResultOptions
];

const useLeaderboards = (type: GameType): useLeaderboardsResult => {
  const [data, setData] = React.useState<UserComputedStats[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchData = () => {
    setLoading(true);
    getLeaderboards(type)
      .then((result) => setData(result))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return [data, {loading, fetch: fetchData}];
};

export {useLeaderboards};
