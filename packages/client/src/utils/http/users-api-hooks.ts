import * as React from 'react';
import {GameType, UserComputedStats} from 'reversi-types';
import {getLeaderboards} from './users-api';

const useLeaderboards = (
  type: GameType
): [UserComputedStats[], boolean, () => void] => {
  const [data, setData] = React.useState<UserComputedStats[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const fetchData = () => {
    setIsLoading(true);
    getLeaderboards(type)
      .then((result) => setData(result))
      .finally(() => setIsLoading(false));
  };

  React.useEffect(() => {
    fetchData();
  }, [type]);

  return [data, isLoading, fetchData];
};

export {useLeaderboards};
