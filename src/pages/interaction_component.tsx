/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

import styled from '@emotion/styled';

import { Bot } from '../bot/botLinearState';
import { TiggleDisplay } from '../components/ToggleDisplay';
import { Chatbot } from '../discussion/ChatBox';
import { ThoughtHistory } from '../discussion/ThoughtHistory';

const BodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  white-space: pre-wrap;
  position: relative;
  height: 100vh;
  width: 100vw;
`;

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

const ResetButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  border: 1px solid black;
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 10px;
`;

const Unselectable = styled.div`
  user-select: none;
`;

const LeftArea = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100vw - 500px);
  height: 100vh;
`;

const Row = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  overflow: auto;
  white-space: pre-wrap;
`;

const StateDisplay = styled.div`
  white-space: pre-wrap;
  padding-left: 40px;
`;

const TaskQueuedNotification = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  color: red;
`;

const API_KEY_AREA = styled.input`
  margin-right: 10px;
`;

const bot = new Bot();
const ThoughtState = () => {
  const [currentState, setCurrentState] = useState<any>({});
  const [conversation, setConversation] = useState<any>([]);
  const [thinkRate, setThinkRate] = useState<number>(5);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [autoThink, setAutoThink] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [taskQueued, setTaskQueued] = useState<boolean>(false);
  const [apikey, setApikey] = useState<string>('');

  const handleInputText = async (currentInput: string) => {
    if (!currentInput) return;
    const response = await bot.addTextInput(currentInput);
    setConversation((c: any) => [...c, { text: currentInput, type: 'user' }]);
    setCurrentState(response.state);
  };

  const displayCurrentState = async () => {
    const response = await bot.getState();
    setCurrentState(response.state);
  };

  useEffect(() => {
    displayCurrentState();
  }, []);

  const [queueAction, setQueueAction] = useState(false);
  const handleAction = async () => {
    const response = await bot.executeAction();
    setCurrentState(response.state);
    // if there's a message, add it to the conversation
    if (response?.message) {
      setConversation((c: any) => [
        ...c,
        { text: response.message, type: 'bot' },
      ]);
    }
  };
  const handleThink = async (autoOn: boolean = false) => {
    setIsProcessing(true);
    const response = await bot.doThought(apikey);
    setIsProcessing(false);
    setCurrentState(response.state);
    setLastPrompt(response.lastPrompt || '');
    // for each item in response.state.output, add it to the conversation
    response?.state?.output?.forEach((item: any) => {
      setConversation((c: any) => [...c, { text: item.print, type: 'bot' }]);
    });
    if (autoOn) {
      setTaskQueued(true);
      setTimeout(() => {
        setTaskQueued(false);
        setQueueAction(true);
      }, thinkRate * 1000);
    }
  };

  useEffect(() => {
    if (autoThink) setQueueAction(true);
  }, [autoThink]);

  useEffect(() => {
    if (autoThink && queueAction) {
      handleThink(true);
      setQueueAction(false);
    }
  }, [queueAction]);

  useEffect(() => {
    if (currentState?.state?.actionToTake) {
      handleAction();
    }
  }, [currentState]);

  return (
    <BodyContainer>
      <ResetButton
        onClick={() => {
          setConversation([]);
          setLastPrompt('');
          bot.reset();
        }}
      >
        Reset
      </ResetButton>

      <LeftArea>
        <Row
          style={{
            width: '100%',
            position: 'relative',
          }}
        >
          {taskQueued && (
            <TaskQueuedNotification>Request Queued</TaskQueuedNotification>
          )}
          {isProcessing && (
            <TaskQueuedNotification>Processing Request</TaskQueuedNotification>
          )}
          <API_KEY_AREA
            type="password"
            placeholder="OPENAI API KEY HERE"
            onChange={(e) => setApikey(e.target.value)}
            value={apikey}
          ></API_KEY_AREA>
          <TiggleDisplay
            label="Think Rate"
            currentValue={thinkRate}
            min={1}
            max={40}
            onChange={(value: number) => setThinkRate(value)}
            interval={0.5}
          />

          <div>
            <Button
              onClick={() => handleThink(false)}
              style={{ width: '100px' }}
            >
              <Unselectable>Think</Unselectable>
            </Button>
          </div>
          <div>
            <Button
              onClick={() => setAutoThink(!autoThink)}
              style={{ width: '150px' }}
            >
              <Unselectable>
                {autoThink ? 'Turn Auto Off' : 'Turn Auto On'}{' '}
              </Unselectable>
            </Button>
          </div>
        </Row>
        <Row
          style={{
            height: '200px',
            border: '1px solid black',
            padding: '20px',
            display: 'flex',
            justifyContent: 'start',
          }}
        >
          <div
            style={{
              backgroundColor: '#4444dd',
              padding: '5px',
              borderRadius: '10px',
              color: 'white',
              textAlign: 'center',
              writingMode: 'vertical-rl',
              marginRight: '10px',
              position: 'fixed',
              left: '10px',
            }}
          >
            Current Thought
          </div>
          <StateDisplay>{currentState?.state?.currentThought}</StateDisplay>
        </Row>
        <Row
          style={{
            height: '200px',
            border: '1px solid black',
            padding: '20px',
            display: 'flex',
            justifyContent: 'start',
          }}
        >
          <div
            style={{
              backgroundColor: '#4444dd',
              padding: '5px',
              borderRadius: '10px',
              color: 'white',
              textAlign: 'center',
              writingMode: 'vertical-rl',
              marginRight: '10px',
              position: 'fixed',
              left: '10px',
            }}
          >
            Possible Options
          </div>
          <StateDisplay>
            {JSON.stringify(currentState?.state?.possibleActions)}
          </StateDisplay>
        </Row>
        <Row
          style={{
            height: '200px',
            border: '1px solid black',
            padding: '20px',
            display: 'flex',
            justifyContent: 'start',
          }}
        >
          <div
            style={{
              backgroundColor: '#4444dd',
              padding: '5px',
              borderRadius: '10px',
              color: 'white',
              textAlign: 'center',
              writingMode: 'vertical-rl',
              marginRight: '10px',
              position: 'fixed',
              left: '10px',
            }}
          >
            Current Action
          </div>
          <StateDisplay>
            {JSON.stringify(currentState?.state?.actionToTake)}
          </StateDisplay>
        </Row>
        <Row
          style={{
            border: '1px solid black',
            padding: '20px',
            display: 'flex',
            flexDirection: 'row',
            height: '150px',
          }}
        >
          <div
            style={{
              backgroundColor: '#4444dd',
              padding: '5px',
              borderRadius: '10px',
              color: 'white',
              textAlign: 'center',
              writingMode: 'vertical-rl',
              marginRight: '10px',
              position: 'fixed',
              left: '10px',
            }}
          >
            Last Prompt
          </div>
          <StateDisplay>{lastPrompt}</StateDisplay>
        </Row>

        <ThoughtHistory thoughts={currentState?.thoughts} />
        <div>
          Code at https://github.com/matthewlouisbrockman/SelfReviewingAgent
        </div>
      </LeftArea>
      <Chatbot
        conversation={conversation}
        handleInputText={handleInputText}
        isProcessing={isProcessing}
      />
    </BodyContainer>
  );
};

export default ThoughtState;
