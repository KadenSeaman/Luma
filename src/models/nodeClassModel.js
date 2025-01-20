export default class Node {
    constructor(name, fields, methods){
        this.name = name;
        this.fields = fields;
        this.methods = methods;
    }

    toString(){
        return this.name;
    }
}