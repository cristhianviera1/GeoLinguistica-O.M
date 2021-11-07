import LanguageName from "./ValueObjects/LanguageName";
import LanguageID from "./ValueObjects/LanguageID";

export default class Language {
    private readonly _id: LanguageID;
    private readonly _name: LanguageName;
}