import CommunityID from "./ValueObjects/CommunityID";
import CommunityName from "./ValueObjects/CommunityName";
import Language from "../../Languages/Domain/Language";
import Province from "../../Localities/Domain/Province";
import Parish from "../../Localities/Domain/Parish";
import Coordinates from "../../Shared/Domain/ValueObjects/Coordinates";
import Poll from "../../Polls/Domain/Poll";

export default class Community {
    private readonly _id: CommunityID;
    private readonly _name: CommunityName;
    private readonly _province: Province;
    private readonly _parish: Parish;
    private readonly _language: Language;
    private readonly _coordinates: Array<Coordinates>;
    private readonly _polls: Array<Poll>;
}