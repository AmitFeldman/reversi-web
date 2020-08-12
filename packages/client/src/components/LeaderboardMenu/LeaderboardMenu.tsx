import * as React from 'react';
import Tabs from '../Tabs/Tabs';
import {GameType, UserComputedStats, User} from 'reversi-types';
import {useLeaderboards} from '../../utils/http/users-api-hooks';
import Loader from 'react-loader-spinner';

interface tabsDataType {
  type: GameType;
  tabTitle: string;
}

interface columnsType {
  key: keyof UserComputedStats;
  title: string;
  width: string;
}

const columns: columnsType[] = [
  //   {key: 'userId', title: 'Id', width: '100px'},
  {key: 'username', title: 'Username', width: '36%'},
  {key: 'wins', title: 'Wins', width: '16%'},
  {key: 'losses', title: 'Losses', width: '16%'},
  {key: 'ties', title: 'Ties', width: '16%'},
  {key: 'winLossRatio', title: 'Ratio', width: '16%'},
];

const tabsData: tabsDataType[] = [
  {type: 'AI_EASY', tabTitle: 'Easy'},
  {type: 'AI_MEDIUM', tabTitle: 'Medium'},
  {type: 'AI_HARD', tabTitle: 'Hard'},
  {type: 'AI_EXPERT', tabTitle: 'Expert'},
  {type: 'PUBLIC_ROOM', tabTitle: 'Online'},
];

interface LeaderboardMenuProps {
  user: User;
}

const LeaderboardMenu: React.FC<LeaderboardMenuProps> = ({user}) => {
  const [tabType, setTabType] = React.useState<GameType>('AI_EASY');
  const [data, isLoading, fetch] = useLeaderboards(tabType);

  return (
    <Tabs
      onChange={(tabIndex) => setTabType(tabsData[tabIndex].type)}
      tabs={tabsData.map((tabData) => {
        return {
          title: tabData.tabTitle,
          content: (
            <div className="grid max-h-60vh overflow-auto">
              <table className="table-fixed">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        style={{width: col.width}}
                        className="px-4 py-2">
                        {col.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!isLoading &&
                    data.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={
                          row.userId === user?._id
                            ? 'bg-purple-400'
                            : rowIndex % 2
                            ? 'bg-gray-100'
                            : ''
                        }>
                        {columns.map((col, colIndex) => (
                          <td key={colIndex} className="border px-4 py-2">
                            {row[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
              {!isLoading && data.length === 0 && (
                <p className="text-center mt-5">
                  Be the first to play this mode
                </p>
              )}
              <div className="w-full flex justify-center">
                <Loader
                  visible={isLoading}
                  type="Bars"
                  color="#b794f4"
                  height={30}
                  width={30}
                />
              </div>
            </div>
          ),
        };
      })}
    />
  );
};

export default LeaderboardMenu;
