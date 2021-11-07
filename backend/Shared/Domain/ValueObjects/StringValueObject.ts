export abstract class StringValueObject{
    private readonly _value: string;

    protected constructor(value: string) {
        this._value = value;
    }

    public get value(): string {
        return this._value;
    }
}