import InvalidArgumentError from "../../../Shared/Domain/InvalidArgumentError";

export default class PollTotalRespondents {
    private readonly _value: number;

    constructor(value: number) {
        if(value >= 0){
            throw new InvalidArgumentError(`The Total respondents can't be lowest than zero`);
        }
        this._value = value;
    }

    public get value(): number {
        return this._value;
    }
}