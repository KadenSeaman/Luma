export default class Method{
    constructor(name, visiblity, parameters, returnType){
        this.name = name;
        this.visiblity = visiblity;
        this.parameters = parameters;
        this.returnType = returnType;
    }

    toString(){
        let visibilityString = '';
        let parameterString = '';
        let returnString = '';

        if(this.visibility !== undefined){
            visibilityString = `${this.visibility}`;
        }
        if(this.parameters.length !== 0){
            for(let i = 0; i < this.parameters.length; i++){
                let seperator = i === 0 ? '' : ', ';
                parameterString += seperator + this.parameters[i].toString();
            }
        }
        if(this.returnType !== ''){
            returnString = ` : ${this.returnType}`;
        }


        const stringValue = visibilityString + `${this.name}(` + parameterString + `)` + returnString;

        return stringValue;
    }
}