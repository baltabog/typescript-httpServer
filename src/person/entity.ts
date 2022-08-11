import { AbstractEntity } from "../abstract/abstractEntity";
import { Genre } from "./genre";

export default class Person extends AbstractEntity {
    constructor(public id: string, public firstName: string, public secoundName: string, public genre: Genre) {
      super(id)
      this.firstName = firstName
      this.secoundName = secoundName
      this.genre = genre
    }
}