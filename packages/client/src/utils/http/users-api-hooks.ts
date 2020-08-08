import * as React from 'react';
import {GameType, UserComputedStats} from 'reversi-types';
import {getLeaderboards} from './users-api';

const useLeaderboards = (type: GameType): [UserComputedStats[], () => void] => {
  const [data, setData] = React.useState<UserComputedStats[]>([]);

  const fetchData = () =>
    getLeaderboards(type).then((result) => setData(result));

  React.useEffect(() => {
    fetchData();
  }, [type]);

  return [data, fetchData];
};

export {useLeaderboards};
