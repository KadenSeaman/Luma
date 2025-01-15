import Relationship from "../models/nodeRelationshipModel";
import NodeClass from "../models/nodeClassModel";
import NodeField from '../models/nodeFieldModel';
import NodeMethod from '../models/nodeMethodModel';

export const preProcessJSONData = (data) => {
    console.log(data);
    if(data.Children === null) return null;

    const root = {
        classList: [],
        relationshipList: [],
    }

    for(const child of data.Children){
        if(child.Type === 'Class'){
            root.classList.push(preProcessClass(child));
        }
        else if (child.Type === 'Relationship'){
            root.relationshipList.push(preProcessRelationship(child));
        }
    }

    return root;
}

const preProcessClass = (classObj) => {
    const name = classObj.Name;

    const fields = [];
    const methods = [];

    if(classObj.Children !== null){
        for(const child of classObj.Children){
            if(child.Type === 'Field'){
                fields.push(preProcessField(child)); 
            }
            else if (child.Type === 'Method'){
                fields.push(preProcessMethod(child));
            }
        }
    }

    return new NodeClass (name,fields,methods);
}

const preProcessRelationship = (relationshipObj) => {
    const type = relationshipObj.Type;
    const source = relationshipObj.SourceClass;
    const target = relationshipObj.TargetClass;
    const leftLabel = relationshipObj.LeftLabel;
    const middleLabel = relationshipObj.MiddleLabel;
    const rightLabel = relationshipObj.RightLabel;

    const relationship = new Relationship(type,source,target, leftLabel, middleLabel, rightLabel);

    return relationship;
}

const preProcessField = (fieldObj) => {
    const name = fieldObj.Name;
    const visiblity = fieldObj.Visiblity;
    const defaultValue = fieldObj.Default;
    const valueType = fieldObj.ValueType;

    return new NodeField(name,visiblity,defaultValue,valueType)
}

const preProcessMethod = (methodObj) => {
    const name = methodObj.Name;
    const visibility = methodObj.Visibility;
    const parameters = [];

    for(const child of methodObj.Children){
        parameters.push(preProcessField(child));
    }

    const returnType = methodObj.ReturnType;

    return new NodeMethod (name,visibility,parameters,returnType);
}