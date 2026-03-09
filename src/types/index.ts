// 节点类型枚举
export enum NodeCategory {
  LOGIC_ACTIVITY = "LOGIC_ACTIVITY",     // 逻辑活动块
  FLOW_STATEMENT = "FLOW_STATEMENT",     // 流程语句
  CALL_ACTIVITY = "CALL_ACTIVITY",       // 调用活动
  OBJECT_ACTIVITY = "OBJECT_ACTIVITY",   // 对象活动
  DATA_CHECK = "DATA_CHECK",             // 数据检查
  IO_PARAMS = "IO_PARAMS",              // 入参出参
  SERVICE_NODE = "SERVICE_NODE",        // 服务节点
}

// 主Tab类型
export type MainTab = NodeCategory | "SERVICE_NODE";

// 节点类型
export enum NodeType {
  // 逻辑活动块
  LOGIC_JUDGE = "logic_judge",      // 逻辑判断
  LOOP_INDEX = "loop_index",         // 索引循环
  LOOP_ARRAY = "loop_array",         // 数组遍历
  
  // 流程语句
  FLOW_RETURN = "flow_return",       // 返回
  FLOW_CONTINUE = "flow_continue",   // 继续
  FLOW_BREAK = "flow_break",        // 中断
  
  // 调用活动
  CALL_METHOD = "call_method",       // 方法调用
  CALL_SERVICE = "call_service",       // 服务调用
  CALL_RULE = "call_rule",           // 规则调用
  
  // 对象活动
  OBJECT_ASSIGN = "object_assign",     // 对象赋值
  OBJECT_MAPPING = "object_mapping",   // 参数映射
  
  // 数据检查
  DATA_CHECK_NODE = "data_check",     // 数据检查
  
  // 入参出参
  IO_START = "io_start",             // 开始节点
  IO_END = "io_end",                 // 结束节点
}

// 引用类型
export enum ReferenceType {
  DTO = "dto",
  BASIC = "basic",
  OBJECT = "Object",
}

// 节点分类信息
export interface NodeCategoryInfo {
  id: NodeCategory;
  name: string;
  nameCn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}

// 基础参数
export interface Parameter {
  sn: number;
  parameterId: string;
  parameterCode: string;
  parameterName: string;
  parameterType: string;
  referenceType: ReferenceType;
  referenceName?: string;
  referenceId?: string;
  referenceCode?: string;
  referenceJavaType?: string;
  referenceModuleCode?: string;
  referenceGroupCode?: string;
  description?: string;
  isCollection?: number;
  isPaging?: number;
  isRequired?: number;
  defaultVal?: string;
  version?: string;
}

// 局部变量
export interface LocalVariable {
  sn: number;
  variableCode: string;
  variableName: string;
  javaType?: string;
  referenceType: ReferenceType;
  referenceName?: string;
  referenceId?: string;
  isCollection?: number;
  moduleCode?: string;
  groupCode?: string;
  version?: string;
  projectCode?: string;
  tenantCode?: string;
  loopVariableType?: string;
}

// 自动装配变量
export interface AutoWiredVariable {
  sn: number;
  description?: string;
  isRequired?: number;
  javaType?: string;
  variableCode: string;
  variableName: string;
  variableType?: string;
  moduleCode?: string;
  groupCode?: string;
  version?: string;
  projectCode?: string;
  tenantCode?: string;
  autoWiredType?: string;
}

// 节点动作
export interface NodeAction {
  expr?: string;
  ref?: {
    methodId?: string;
    methodCode?: string;
    autowiredName?: string;
    moduleCode?: string;
    groupCode?: string;
  };
  inputParameters?: Parameter[];
  outputParameter?: {
    receiveVariable?: string;
  };
  assignList?: {
    receiveVariable: string;
    val: string;
    valType: string;
  }[];
  val?: string;
  returnType?: string;
  receiveVariable?: string;
}

// 流程节点
export interface FlowNode {
  nodeId: string;
  nodeType: string;
  order?: number;
  sn: number;
  nodeName: string;
  action?: NodeAction;
  localVariables?: LocalVariable[];
  nodes?: FlowNode[];
}

// 画布定义
export interface FlowDefinition {
  flowCode: string;
  flowName: string;
  flowType?: string;
  globalInputParameters?: Parameter[];
  globalOutputParameters?: Parameter[];
  localVariables?: LocalVariable[];
  autoWiredVariables?: AutoWiredVariable[];
  nodes: FlowNode[];
}

// 节点示例数据
export interface NodeExample {
  id: string;
  nodeType: NodeType;
  category: NodeCategory;
  name: string;
  nameCn: string;
  description: string;
  jsonConfig: string;
  excelFields: {
    field: string;
    fieldCn: string;
    type: string;
    required: boolean;
    description: string;
  }[];
}

// 服务定义
export interface ServiceDefinition {
  appServiceCode: string;      // 应用服务编码
  appServiceName: string;      // 应用服务名称
  operationCode: string;       // 操作编码
  operationName: string;       // 操作名称
  phase: string;               // 阶段
  version: string;             // 版本
  module: string;              // 模块
  subModule: string;           // 子模块
  dataType?: string;           // 数据类型
}

// 步骤参数
export interface StepParameter {
  parameterId?: string;
  parameterCode: string;
  parameterName: string;
  parameterType: string;
  referenceType?: ReferenceType;
  referenceName?: string;
  referenceCode?: string;
  isCollection?: number;
  isRequired?: number;
  defaultVal?: string;
  value?: string;
  mappingType?: string;
  mappingCode?: string;
}

// 服务步骤
export interface OrchestrationStep {
  stepId: string;
  sequence: number;
  stepType: string;
  stepName: string;
  methodId?: number;
  serviceClass?: string;
  methodName?: string;
  inputParameters?: StepParameter[];
  outputParameters?: StepParameter[];
}

// 编排
export interface Orchestration {
  steps: OrchestrationStep[];
}

// 变量定义
export interface VariableDefinition {
  variableId: string;
  variableCode: string;
  variableName: string;
  variableType: string;
  javaType?: string;
  referenceType?: ReferenceType;
  referenceName?: string;
  referenceId?: string;
  referenceCode?: string;
  isCollection?: number;
  moduleCode?: string;
  groupCode?: string;
  description?: string;
  isRequired?: number;
  version?: string;
}

// 变量
export interface Variables {
  inputs: VariableDefinition[];
  outputs: VariableDefinition[];
}

// 服务节点完整结构
export interface ServiceNode {
  serviceDefinition: ServiceDefinition;
  orchestration: Orchestration;
  variables: Variables;
}

// Excel列区域定义
export const EXCEL_COLUMN_REGIONS = {
  SERVICE_DEFINITION: { start: 'A', end: 'E', name: '服务定义', color: 'blue' },
  ORCHESTRATION: { start: 'F', end: 'X', name: '编排步骤', color: 'purple' },
  VARIABLES: { start: 'Y', end: 'AP', name: '变量', color: 'green' },
} as const;

// ========== 服务调用节点类型 ==========

// 赋值类型枚举
export enum AssignmentType {
  FIXED = "FIXED",           // 固定值
  VARIABLE = "variable",     // 变量
  EXPRESSION = "expression", // 表达式
  CONTEXT_VAR = "CONTEXT_VAR", // 上下文变量
}

// 引用类型枚举 (扩展)
export enum RefType {
  BASIC = "basic",           // 基础类型
  OBJECT = "Object",         // 对象
  DTO = "dto",              // DTO
  PARAM_OBJECT = "PARAM_OBJECT", // 参数对象
}

// 服务引用信息
export interface ServiceCallRef {
  methodId: string;
  methodCode: string;
  autowiredName: string;
  moduleCode: string;
  groupCode: string;
}

// 服务调用 - 入参配置
export interface ServiceCallInputParam {
  sn: number;
  code: string;
  paramType: string;         // 变量类型
  refType: string;           // 引用类型
  valType: string;           // 赋值类型
  val: string;               // 赋值内容
  
  // UI 扩展字段
  name?: string;             // 名称
  description?: string;      // 描述
  isCollection?: number;     // 是否集合
}

// 服务调用 - 出参配置
export interface ServiceCallOutputParam {
  receiveVariable: string;   // 接收变量
  
  // UI 扩展字段
  refType?: string;          // 引用类型
  isCollection?: number;     // 是否集合
  paramObject?: string;      // 参数对象
  valType?: string;          // 赋值类型
  paramValue?: string;       // 参数值 (用于UI显示，可能对应receiveVariable)
}

// 服务调用动作
export interface ServiceCallAction {
  ref: ServiceCallRef;
  inputParameters: ServiceCallInputParam[];
  outputParameter: ServiceCallOutputParam;
}

// 服务调用完整结构
export interface ServiceCallNode {
  nodeId: string;
  nodeType: string;
  order: number;
  sn: number;
  nodeName: string;
  action: ServiceCallAction;
}

// ========== Foreach循环节点类型 ==========

// 循环参数
export interface LoopParameter {
  parameterCode: string;     // 循环变量编码 (如: item)
  parameterName: string;    // 循环变量名称 (如: 订单明细集合)
  parameterType: string;   // 参数类型 (如: snItemDTO)
  loopValType: string;    // 循环值类型 (如: self:inner)
  isCollection: number;   // 是否集合 (1)
}

// 循环动作
export interface LoopAction {
  expr: string;            // 表达式/目标集合 (如: items)
  loopParameter: LoopParameter[]; // 循环参数数组
}

// Foreach循环节点完整结构
export interface ForeachNode {
  nodeId: string;          // 节点ID (如: 1001)
  nodeType: string;        // 节点类型 (固定: loop)
  sn: number;              // 序号
  nodeName: string;        // 节点名称 (如: 遍历订单明细)
  action: LoopAction;      // 循环动作配置
}

export * from "./logic-judge";
export * from "./loop-index";

export const CATEGORY_COLORS: Record<NodeCategory, { bg: string; border: string; text: string; icon: string }> = {
  [NodeCategory.LOGIC_ACTIVITY]: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    icon: "🧠",
  },
  [NodeCategory.FLOW_STATEMENT]: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    icon: "▶️",
  },
  [NodeCategory.CALL_ACTIVITY]: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    icon: "🔌",
  },
  [NodeCategory.OBJECT_ACTIVITY]: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    icon: "📦",
  },
  [NodeCategory.DATA_CHECK]: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    icon: "✅",
  },
  [NodeCategory.IO_PARAMS]: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-700",
    icon: "📥",
  },
  [NodeCategory.SERVICE_NODE]: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    icon: "🔧",
  },
};
