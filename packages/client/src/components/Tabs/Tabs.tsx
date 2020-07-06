import * as React from 'react';

interface TabData {
  title: string;
  content: JSX.Element;
}

interface TabsProps {
  tabs: TabData[];
}

const selectedTabStyle = 'border-l border-t border-r rounded-t text-purple-600';
const tabStyle =
  'bg-white inline-block py-2 px-4 font-semibold text-purple-400 hover:text-purple-500';

const Tabs: React.FC<TabsProps> = ({tabs}) => {
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  return (
    <>
      <ul className="flex border-b mb-4">
        {tabs.map(({title}, index) => (
          <li key={index} className="-mb-px mr-4 ml-4 cursor-pointer">
            <p
              className={`bg-white inline-block py-2 px-4 font-semibold ${
                index === tabIndex ? selectedTabStyle : tabStyle
              }`}
              onClick={() => setTabIndex(index)}>
              {title}
            </p>
          </li>
        ))}
      </ul>

      {tabs[tabIndex].content}
    </>
  );
};

export default Tabs;
