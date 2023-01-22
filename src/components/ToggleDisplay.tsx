import styled from '@emotion/styled';

interface ToggleProps {
  min: number;
  max: number;
  currentValue: number;
  onChange: (value: number) => void;
  label: string;
  interval?: number;
}

const ToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const TiggleDisplay = ({
  min,
  max,
  currentValue,
  onChange,
  label,
  interval = 0.1,
}: ToggleProps) => {
  return (
    <ToggleContainer>
      <button
        onClick={() => {
          if (currentValue - interval >= min) {
            onChange(currentValue - interval);
          }
        }}
      >
        ▼
      </button>
      {label}: {Math.round(currentValue * 100) / 100}
      <button
        onClick={() => {
          if (currentValue + interval <= max) {
            onChange(currentValue + interval);
          }
        }}
      >
        ▲
      </button>
    </ToggleContainer>
  );
};
