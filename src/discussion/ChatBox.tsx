import { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

interface ChatBoxProps {
  conversation: any[];
  handleInputText: (text: string) => void;
  isProcessing: boolean;
}

const Button = styled.div`
  cursor: pointer;
  border: 1px solid black;
  padding: 0.5rem;
  margin: 0.5rem;
  :hover {
    background-color: #f8f8f8;
  }
  :active {
    background-color: #f8f8f8;
    border: 1px solid white;
  }
`;

const Unselectable = styled.div`
  user-select: none;
`;

const InputBar = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: auto;
  justify-content: center;
  padding: 10px;
`;

const UserInputField = styled.textarea`
  width: 400px;
  margin: 10px;
  padding: 10px;
  border: 1px solid black;
  resize: none;
`;

const ChatSender = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
const ChatText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 400px;
  border-radius: 10px;
  padding: 10px;
`;

const ChatBubble = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
`;

const ChatItem = ({ item }: any) => {
  return (
    <ChatBubble>
      <ChatSender>{item.type}</ChatSender>
      <ChatText
        style={{
          color: 'white',
          backgroundColor: item.type === 'user' ? 'blue' : 'green',
        }}
      >
        {item.text}
      </ChatText>
    </ChatBubble>
  );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  height: 100%;
  padding -top: 50px;
  width: 500px;
  overflow-y: scroll;
  box-shadow: -5px 0px 5px 0px rgba(0, 0, 0, 0.2);
`;
export const Chatbot = ({
  conversation,
  handleInputText,
  isProcessing,
}: ChatBoxProps) => {
  // when conversation length changes, scroll to bottom
  const [currentInput, setCurrentInput] = useState<string>('');
  const ChatbotContainerRef = useRef<HTMLDivElement>(null);
  const conversationLength = conversation.length;

  const userInputFieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (userInputFieldRef?.current?.style) {
      if (currentInput) {
        userInputFieldRef.current.style.height = `${Math.min(
          userInputFieldRef.current.scrollHeight,
          100
        )}px`;
      } else {
        userInputFieldRef.current.style.height = '45px';
      }
    }
  }, [currentInput]);

  useEffect(() => {
    if (ChatbotContainerRef.current) {
      ChatbotContainerRef.current.scrollTop =
        ChatbotContainerRef.current.scrollHeight;
    }
  }, [conversationLength]);

  return (
    <ChatContainer ref={ChatbotContainerRef}>
      {conversation.map((item, index) => {
        return <ChatItem key={index} item={item} />;
      })}
      <InputBar>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <UserInputField
            ref={userInputFieldRef}
            value={currentInput}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                if (isProcessing) return; // asdf
                e.preventDefault();
                handleInputText(currentInput);
                setCurrentInput('');
              }
            }}
            onChange={(e) => {
              setCurrentInput(e.target.value);
            }}
          />
          <Button
            onClick={() => (isProcessing ? {} : handleInputText(currentInput))}
            style={{
              backgroundColor: isProcessing ? 'grey' : 'white',
            }}
          >
            <Unselectable>Submit</Unselectable>
          </Button>
        </div>
      </InputBar>
    </ChatContainer>
  );
};
