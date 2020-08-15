import * as React from 'react';
import Tabs from '../Tabs/Tabs';
import {GameType, User} from 'reversi-types';
import {useLeaderboards} from '../../utils/http/users-api-hooks';
import Loader from 'react-loader-spinner';

interface tabsDataType {
  type: GameType;
  tabTitle: string;
}

const tabsData: tabsDataType[] = [
  {type: 'AI_EASY', tabTitle: 'Easy'},
  {type: 'AI_MEDIUM', tabTitle: 'Medium'},
  {type: 'AI_HARD', tabTitle: 'Hard'},
  {type: 'AI_EXPERT', tabTitle: 'Expert'},
  {type: 'PUBLIC_ROOM', tabTitle: 'Online'},
];

interface LeaderboardMenuProps {
  user: User | null;
}

const LeaderboardMenu: React.FC<LeaderboardMenuProps> = ({user}) => {
  const [tabType, setTabType] = React.useState<GameType>('AI_EASY');
  const [data, {loading}] = useLeaderboards(tabType);
  const connectedUserId = user?._id;

  return (
    <Tabs
      onChange={(tabIndex) => setTabType(tabsData[tabIndex].type)}
      tabs={tabsData.map((tabData) => ({
        title: tabData.tabTitle,
        content: (
          <div className="grid max-h-60vh overflow-auto">
            <table className="table-auto m-2 text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Wins</th>
                  <th className="px-4 py-2">Losses</th>
                  <th className="px-4 py-2">Ties</th>
                  <th className="px-4 py-2">Ratio</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  data.map(
                    (
                      {userId, username, wins, losses, ties, winLossRatio},
                      index
                    ) => (
                      <tr
                        key={index}
                        className={
                          userId === connectedUserId
                            ? 'bg-purple-400'
                            : index % 2
                            ? 'bg-gray-100'
                            : ''
                        }>
                        <td className="border px-4">{username}</td>
                        <td className="border px-4">{wins}</td>
                        <td className="border px-4">{losses}</td>
                        <td className="border px-4">{ties}</td>
                        <td className="border px-4">{winLossRatio}</td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>

            {!loading && data.length === 0 && (
              <p className="text-center mt-5">
                Be the first to play this mode!
              </p>
            )}

            <div className="w-full flex justify-center">
              <Loader
                visible={loading}
                type="Bars"
                color="#b794f4"
                height={30}
                width={30}
              />
            </div>
          </div>
        ),
      }))}
    />
  );
};

export default LeaderboardMenu;
