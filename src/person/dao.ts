import path from "path";
import { CVSEntitiesDao } from "../abstract/abstractDao";
import Person from "./entity";

export default class CVSPersonDao extends CVSEntitiesDao<Person> {
    
    constructor() {
        super();
    }

    protected getCsvFilePath(): string {
        return path.resolve(__dirname, '../../db/persons.csv');
    }

    protected getCsvHeaders(): string[] {
        return ["id", "firstName", "secoundName", "genre"];
    }

}
