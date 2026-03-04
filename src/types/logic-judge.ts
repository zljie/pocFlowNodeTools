
// ========== 逻辑判断节点类型 ==========

// 逻辑判断参数
export interface LogicJudgeParam {
  code: string;
  name: string;
  variableType: string;  // 变量类型 (如: 参数对象)
  isCollection: number; // 是否集合 (0/1)
  attributeType: string; // 属性类型 (如: 供应商对象)
  refType?: string; // 引用类型 (新增)
}

// 逻辑判断规则
export interface LogicJudgeRule {
  branch: string;           // 条件分支 (if/else)
  scenarioName: string;     // 分支场景命名
  expression: string;       // 条件逻辑表达式
}

// 逻辑判断分支变量
export interface LogicJudgeBranch {
  branchName: string;       // 归属条件分支
  scenarioName: string;     // 分支场景命名
  code: string;
  name: string;
  dataType: string;
  isCollection: number;
}

// 逻辑判断动作
export interface LogicJudgeAction {
  params: LogicJudgeParam[];
  rules: LogicJudgeRule[];
  branches: LogicJudgeBranch[];
  // 新增字段匹配截图
  loopType?: string; // 循环类型 (数组遍历)
  loopBodyParams?: LogicJudgeParam[]; // 循环体参数
  loopParams?: LogicJudgeParam[]; // 循环参数
}

// 逻辑判断节点完整结构
export interface LogicJudgeNode {
  nodeId: string;
  nodeType: string;
  sn: number;
  nodeName: string;
  action: LogicJudgeAction;
}
