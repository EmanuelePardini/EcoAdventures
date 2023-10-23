import { IQuestionState } from "./IQuestionState";
import { IAnswerObject } from "./IAnswerObject";

export interface IGameDetail  {
    date: string;
    time: string;
    questions: IQuestionState[];
    userAnswers: IAnswerObject[];
    score: number;
  };

  export{};