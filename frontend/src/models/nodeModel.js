export default class Node {
    constructor(name, fields, methods, fontSize = 12, padding = 10, x = 0, y = 0, width = 0, height = 0){
        this.name = name;
        this.fields = fields;
        this.methods = methods;
        this.fontSize = fontSize;
        this.padding = padding;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    toString(){
        return this.name;
    }
}