import PollID from "./ValueObject/PollID";
import PollTotalRespondents from "./ValueObject/PollTotalRespondents";

export default class Poll {
    private readonly _id: PollID
    private readonly _totalRespondents: PollTotalRespondents;
}