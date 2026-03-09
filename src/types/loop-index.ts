
// 索引循环节点类型定义

export interface LoopIndexVariable {
  variableCode: string;
  variableName: string;
  javaType: string;
  referenceType: string; // "basic" | "dto" etc.
  referenceName: string;
  referenceId?: string;
  loopVariableType?: string; // "self" | "inner"
  isCollection: number;
  moduleCode?: string;
  groupCode?: string;
  version?: string;
  projectCode?: string;
  tenantCode?: string;
}

export interface LoopIndexAction {
  startValueExpr: string;
  endConditionExpr: string;
  stepValueExpr: string;
  directionType: "forward" | "backward";
}

export interface LoopIndexNode {
  nodeId: string;
  order?: number;
  nodeType: "loopi"; // Fixed type for Loop Index
  sn: number;
  nodeName: string;
  action: LoopIndexAction;
  localVariables: LoopIndexVariable[];
}
