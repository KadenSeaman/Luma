export default class NodeClass {
    constructor(name, value, fields, methods){
        this.name = name;
        this.fields = fields;
        this.methods = methods;
    }

    toString(){
        return this.name;
    }
}