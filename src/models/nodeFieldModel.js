export default class NodeField{
    constructor(name, visibility = '', defaultValue = '', valueType = ''){
        this.name = name;
        this.visibility = visibility;
        this.defaultValue = defaultValue;
        this.valueType = valueType;
    }

    toString(){
        let valueTypeString = '';
        let defaultValueString = '';
    
        if(this.valueType !== ''){
            valueTypeString = ` : ${this.valueType}`;
        }
        if(this.defaultValue !== ''){
            defaultValueString = ` = ${this.defaultValue}`;
        }
    
        const stringValue = `${this.visiblity}${this.name}` + valueTypeString + defaultValueString;

        return stringValue;
    }
}