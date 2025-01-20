const ComparisonList = ({ comparisons }) => {
    return (
      <div>
        {comparisons.map((comparison, index) => (
          <div key={index}>
            {Object.entries(comparison).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  };

export {ComparisonList}