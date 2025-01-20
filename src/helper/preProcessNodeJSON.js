import Edge from "../models/edgeModel";
import Node from "../models/nodeClassModel";
import Field from '../models/nodeFieldModel';
import Method from '../models/nodeMethodModel';

export const preProcessJSONData = (data) => {
    if(data.Children === null) return null;

    const root = {
        nodes: [],
        edges: [],
    }

    for(const child of data.Children){
        if(child.Type === 'Class'){
            root.nodes.push(preProcessClass(child));
        }
        else if (child.Type === 'Relationship'){
            root.edges.push(preProcessRelationship(child));
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
                methods.push(preProcessMethod(child));
            }
        }
    }

    return new Node (name,fields,methods);
}

const preProcessRelationship = (relationshipObj) => {
    const type = relationshipObj.Type;
    const source = relationshipObj.SourceClass;
    const target = relationshipObj.TargetClass;
    const leftLabel = relationshipObj.LeftLabel;
    const middleLabel = relationshipObj.MiddleLabel;
    const rightLabel = relationshipObj.RightLabel;

    const edge = new edge(type,source,target, leftLabel, middleLabel, rightLabel);

    return edge;
}

const preProcessField = (fieldObj) => {
    const name = fieldObj.Name;
    const visiblity = fieldObj.Visibility;
    const defaultValue = fieldObj.Default;
    const valueType = fieldObj.ValueType;

    return new Field(name,visiblity,defaultValue,valueType);
}

const preProcessMethod = (methodObj) => {
    const name = methodObj.Name;
    const visibility = methodObj.Visibility;
    const returnType = methodObj.ReturnType;
    const parameters = [];

    console.log(methodObj.Parameters)

    if(methodObj.Parameters !== null){
        for(const parameter of methodObj.Parameters){
            parameters.push(preProcessField(parameter));
        }    
    }

    return new Method (name,visibility,parameters,returnType);
}