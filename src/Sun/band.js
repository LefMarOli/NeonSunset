class Band{

    constructor(top, bottom){
        if(top > bottom)
            throw new Error("Invalid inputs, top value should be higher than bottom value");
            
        this.top = top;
        this.bottom = bottom;
        this.width = top - bottom;
    }

    isIn(y){
        return y > this.top && y < this.bottom;
    }
}