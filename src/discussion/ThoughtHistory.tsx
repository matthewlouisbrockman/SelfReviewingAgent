interface ThoughtHistoryProps {
  thoughts: any[];
}

export const ThoughtHistory = ({ thoughts }: ThoughtHistoryProps) => {
  return (
    <div>
      {thoughts?.map((item, index) => {
        return (
          <div key={index}>
            <div>{item.text}</div>
          </div>
        );
      })}
    </div>
  );
};
