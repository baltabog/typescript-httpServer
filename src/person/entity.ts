import { AbstractEntity } from "../abstract/abstractEntity";

export default class Person extends AbstractEntity {
    constructor(public id: string, public firstName: string, public secoundName: string, public genre: string) {
      super(id)
      this.firstName = firstName
      this.secoundName = secoundName
      this.setGenre(genre); 
    }

    private setGenre(genre: string) {
      if (["M", "m", "male"].includes(genre)) {
        this.genre = "M";
      } else if (["F", "f", "female"].includes(genre)) {
        this.genre = "F";
      } else {
        this.genre = "X";
      }
    }
}