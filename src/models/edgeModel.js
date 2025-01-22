export default class Edge {
    constructor(type, source, target, leftLabel = '', middleLabel = '', rightLabel = '') {
        this.type = type;
        this.source = source;
        this.target = target;
        this.leftLabel = leftLabel;
        this.rightLabel = rightLabel;
        this.middleLabel = middleLabel;
    }
}