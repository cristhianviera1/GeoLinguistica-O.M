import {uuid} from 'uuid';
import InvalidArgumentError from "../InvalidArgumentError";

export default class Uuid {
    readonly value: string;

    constructor(value: string) {
        this.ensureIsValidUuid(value);
        this.value = value;
    }

    static random(): Uuid {
        return new Uuid(uuid());
    }

    private ensureIsValidUuid(id: string): void {
        if (!uuid.validate(id)) {
            throw new InvalidArgumentError(`The value <${id}> is not a valid UUID`);
        }
    }

    toString(): string {
        return this.value;
    }
}