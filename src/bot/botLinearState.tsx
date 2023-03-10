import { linearExpander } from '../linearHelpers/linearExpander';
import { linearPlanner } from '../linearHelpers/linearPlanner';
import { linearSummarizer } from '../linearHelpers/linearSummarizer';

interface BotState {
  state: any;
  message?: string;
  history?: string[];
  lastPrompt?: string;
}

export class Bot {
  private memory: any;

  private lastPrompt: string = '';

  private nextActionType: string;

  constructor() {
    this.memory = {
      state: {
        currentThought: '',
        possibleActions: [],
        actionToTake: [],
        takenActions: [],
      },
      history: [],
    };
    this.nextActionType = 'think';
    this.addToHistory(
      'This is a new conversation. I can start by asking if anyone is around and otherwise will just contemplate my existance.',
      'I',
      'thought'
    );
  }

  addToHistory = (text: string, agent: string, mode: string): void => {
    this.memory.history = [
      ...this.memory.history,
      `Memory ${this.memory.history.length}: [${agent}, ${mode}] ${text}`,
    ];
  };

  getRecentHistory = (historyLength: Number = 7): string => {
    return this.memory.history.slice(-historyLength).join('\n');
  };

  getState = async (): Promise<BotState> => {
    const last10Events = this.getRecentHistory();
    return {
      ...this.memory,
      state: { ...this.memory.state, currentThought: last10Events },
    };
  };

  addTextInput = async (text: string): Promise<BotState> => {
    this.addToHistory(`The user said: "${text}"`, 'user', 'said');
    const last10Events = this.getRecentHistory();
    this.memory = {
      ...this.memory,
      state: { ...this.memory.state, currentThought: last10Events },
    };
    return { state: this.memory, message: '' };
  };

  doThought = async (apikey: string = ''): Promise<BotState> => {
    if (this.nextActionType === 'think') {
      this.nextActionType = Math.random() > 0.5 ? 'summarize' : 'plan';

      const recentHistory = this.getRecentHistory(20);

      const thoughtData = await linearExpander(
        recentHistory,
        this.memory.state.possibleActions,
        apikey
      );

      if (thoughtData.error) {
        return { state: this.memory, message: thoughtData.error };
      }

      this.lastPrompt = thoughtData.prompt;
      this.addToHistory(thoughtData.thought, 'I', 'thought');
      const last10Events = this.getRecentHistory();
      this.memory.state.currentThought = last10Events;

      return { state: this.memory, lastPrompt: this.lastPrompt };
    }

    if (this.nextActionType === 'summarize') {
      this.nextActionType = 'plan';
      const thoughtData = await linearSummarizer(
        JSON.stringify(this.memory.state),
        apikey
      );

      if (thoughtData.error) {
        return { state: this.memory, message: thoughtData.error };
      }

      this.lastPrompt = thoughtData.prompt;
      this.addToHistory(thoughtData.thought, 'I', 'thought');
      const last10Events = this.getRecentHistory();
      this.memory.state.currentThought = last10Events;

      return { state: this.memory, lastPrompt: this.lastPrompt };
    }

    const parsableData = `{
      //chat history is the history numbered from oldest to newest
      //user inputs (if it exists) starts with [user], the ai thoughts and statements start with [I]
      "chatHistory": "${this.getRecentHistory()}",
      "possibleActions": ${JSON.stringify(this.memory.state.possibleActions)},
      "actionToTake": ${JSON.stringify(this.memory.state.actionToTake)},
    }`;

    const planData = await linearPlanner(parsableData, apikey);

    if (planData.error) {
      return { state: this.memory, message: planData.error };
    }
    const recentHistory = this.getRecentHistory(20);

    this.memory = {
      ...this.memory,
      state: { ...planData.state, currentThought: recentHistory },
    };
    this.nextActionType = 'think';

    return { state: this.memory, lastPrompt: this.lastPrompt };
  };

  executeAction = async (): Promise<BotState> => {
    if (this.memory.state.actionToTake.length > 0) {
      const action = this.memory.state.actionToTake[0];
      this.memory = {
        ...this.memory,
        state: { ...this.memory.state, actionToTake: [] },
      };

      if (action.print) {
        this.addToHistory(`I said: "${action.print}"`, 'I', 'said');
        const last10Events = this.getRecentHistory();
        this.memory.state.currentThought = last10Events;

        // if it's in the possibleactions, remove it
        this.memory.state.possibleActions =
          this.memory.state.possibleActions.filter(
            (possibleAction: any) => possibleAction.print !== action.print
          );

        return { state: this.memory, message: action.print };
      }
    }
    return { state: this.memory };
  };

  reset(): BotState {
    this.memory = {
      state: {
        currentThought: '',
        possibleActions: [],
        actionToTake: [],
      },
      history: [],
    };
    return { state: this.memory };
  }
}
