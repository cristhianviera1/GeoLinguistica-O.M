import {StringValueObject} from "../../../Shared/Domain/ValueObjects/StringValueObject";
import InvalidArgumentError from "../../../Shared/Domain/InvalidArgumentError";

export default class LanguageName extends StringValueObject{
    constructor(value:string) {
        super(value);
        this.ensureLengthCharacters(value);
    }
    private ensureLengthCharacters = (value:string):void => {
        if (value.length <=  2) {
            throw new InvalidArgumentError(`The Language name <${value}> has less than 2 characters`);
        }
    }
}