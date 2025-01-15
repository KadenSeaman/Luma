export default class NodeMethod{
    constructor(name, visiblity, parameters, returnType){
        this.name = name;
        this.visiblity = visiblity;
        this.parameters = parameters;
        this.returnType = returnType;
    }

    toString(){
        let parameterString = '';
        let returnString = '';

        if(this.parameters.length !== 0){
            parameterString = this.parameters.map(param => param.toString()).join(',');
        }
        if(this.returnString !== ''){
            returnString = ` : ${this.returnType}`;
        }


        const stringValue = `${this.visiblity}${this.name}(` + parameterString + `)` + returnString;

        return stringValue;
    }
}