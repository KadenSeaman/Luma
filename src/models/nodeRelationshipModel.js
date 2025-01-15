export default class Relationship {
    constructor(type, source, destination, leftLabel = '', middleLabel = '', rightLabel = '') {
        this.type = type;
        this.source = source;
        this.destination = destination;
        this.leftLabel = leftLabel;
        this.rightLabel = rightLabel;
        this.middleLabel = middleLabel;
    }
}