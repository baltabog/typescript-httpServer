export enum Genre {
    M, 
    F,
    X
}

export namespace Genre {
    export function getGenreFromString(str: string): Genre {
        if (["M", "m", "male"].includes(str)) {
            return Genre.M;
        } 
        if (["F", "f", "female"].includes(str)) {
            return Genre.F
        }
        return Genre.X
    }
}