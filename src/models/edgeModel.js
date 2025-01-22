export default class Edge {
    constructor(type, source, target, leftLabel = '', middleLabel = '', rightLabel = '', rootX = 0, rootY = 0, targetX = 0, targetY = 0) {
        this.type = type;
        this.source = source;
        this.target = target;
        this.leftLabel = leftLabel;
        this.rightLabel = rightLabel;
        this.middleLabel = middleLabel;
        this.rootX = rootX;
        this.rootY = rootY;
        this.targetX = targetX;
        this.targetY = targetY;
    }
}