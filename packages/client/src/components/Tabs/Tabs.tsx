import * as React from 'react';

interface TabsProps {
  tabsList: {title: string; content: JSX.Element}[];
}

const Tabs: React.FC<TabsProps> = ({tabsList}) => {
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  const getTabClass = (index: number): string => {
    if (index === tabIndex) {
      return 'bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-purple-600 font-semibold';
    } else {
      return 'bg-white inline-block py-2 px-4 text-purple-400 hover:text-purple-500 font-semibold';
    }
  };

  return (
    <>
      <ul className="flex border-b mb-4">
        {tabsList.map((element, index) => {
          return (
            <li key={index} className="-mb-px mr-4 ml-4 cursor-pointer">
              <p
                className={getTabClass(index)}
                onClick={() => setTabIndex(index)}>
                {element.title}
              </p>
            </li>
          );
        })}
      </ul>

      {tabsList[tabIndex].content}
    </>
  );
};

export default Tabs;
