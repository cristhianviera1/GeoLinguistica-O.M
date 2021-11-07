import InvalidArgumentError from "../InvalidArgumentError";

export default class Latitude {
    private readonly _value: number;

    constructor(value: number) {
        if (!(isFinite(value) && Math.abs(value) <= 90)) {
            throw new InvalidArgumentError(`Latitude must be a finite number between -90 and 90`);
        }
        this._value = value;
    }

    public get value(): number {
        return this._value;
    }
}