export default class Field{
    constructor(name, visibility = '', defaultValue = '', valueType = ''){
        this.name = name;
        this.visibility = visibility;
        this.defaultValue = defaultValue;
        this.valueType = valueType;
    }

    toString(){
        let visibilityString = '';
        let valueTypeString = '';
        let defaultValueString = '';
    
        if(this.visibility !== undefined){
            visibilityString = `${this.visibility}`;
        }
        if(this.valueType !== ''){
            valueTypeString = ` : ${this.valueType}`;
        }
        if(this.defaultValue !== ''){
            defaultValueString = ` = ${this.defaultValue}`;
        }
    
        const stringValue = visibilityString + `${this.name}` + valueTypeString + defaultValueString;

        return stringValue;
    }
}