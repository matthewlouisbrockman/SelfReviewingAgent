import { updateCurrentThought } from './evalHelper';
import { generateEarlyState } from './verbalHelper';

interface BotState {
  state: any;
  message?: string;
  history?: string[];
  lastPrompt?: string;
}

export class Bot {
  private memory: any;

  private history: string[] = [];

  private lastPrompt: string = '';

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
  }

  getState = async (): Promise<BotState> => {
    return { state: this.memory };
  };

  addTextInput = async (text: string): Promise<BotState> => {
    const oldText = this.memory.state.currentThought || '';
    const newText = `${oldText}\nThe user said '${text}'`.trim();
    this.memory = {
      ...this.memory,
      state: { ...this.memory.state, currentThought: newText },
    };
    return { state: this.memory, message: '' };
  };

  doThought = async (): Promise<BotState> => {
    const functions = [updateCurrentThought, generateEarlyState];

    const randomFunction =
      functions[Math.floor(Math.random() * functions.length)] ||
      updateCurrentThought;

    const newState = await randomFunction(JSON.stringify(this.memory.state));
    if (newState.error) {
      return { state: this.memory, message: newState.error };
    }

    this.lastPrompt = newState.prompt;

    if (newState.state) {
      this.memory = {
        ...this.memory,
        history: [...this.history, this.memory.state],
        state: newState.state,
      };
    }
    return { state: this.memory, lastPrompt: this.lastPrompt };
  };

  executeAction = async (): Promise<BotState> => {
    if (this.memory.state.actionToTake.length > 0) {
      const action = this.memory.state.actionToTake[0];
      this.memory = {
        ...this.memory,
        state: {
          ...this.memory.state,
          actionToTake: [],
        },
      };

      if (action.print) {
        console.log('ACTION', action);
        const newText = `${this.memory.state.currentThought}\nI said '${action.print}'`;
        this.memory = {
          ...this.memory,
          state: {
            ...this.memory.state,
            currentThought: newText,
            takenActions: [action],
          },
        };
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
        takenActions: [],
      },
      history: [],
    };
    return { state: this.memory };
  }
}
