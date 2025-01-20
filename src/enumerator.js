import React from 'react';

const DynamicEnumerator = ({ data }) => {
  return (
    <div>
      <h2>Dynamic Enumeration</h2>
      <ul>
        {data.map((item, index) => {
          const key = Object.keys(item)[0]; // Get the first key
          const value = item[key]; // Get the value corresponding to the key
          return (
            <li key={index}>
              {key} {value}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Example usage
const App = () => {
  const data = [
    { "ama is a boy": "=" },
    { "jon is a cow": "=" }
  ];

  return (
    <div>
      <DynamicEnumerator data={data} />
    </div>
  );
};

export default App;
