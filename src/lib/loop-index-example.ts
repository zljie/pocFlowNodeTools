
import { LoopIndexNode } from "@/types/loop-index";

// 索引循环节点示例数据
export const loopIndexExample: LoopIndexNode = {
  nodeId: "2001",
  order: 1,
  nodeType: "loopi",
  sn: 1,
  nodeName: "遍历1到10",
  action: {
    startValueExpr: "0",
    endConditionExpr: "i <= 10",
    stepValueExpr: "1",
    directionType: "forward"
  },
  localVariables: [
    {
      variableCode: "k",
      variableName: "循环索引元素",
      javaType: "Integer",
      referenceType: "basic",
      referenceName: "基础类型",
      referenceId: "1",
      loopVariableType: "self",
      isCollection: 0,
      moduleCode: "mm",
      groupCode: "basic",
      version: "1",
      projectCode: "demo",
      tenantCode: "demo"
    },
    {
      variableCode: "asdfsf",
      variableName: "循环索引元素",
      javaType: "String",
      referenceType: "basic",
      referenceName: "基础类型",
      referenceId: "1",
      loopVariableType: "inner",
      isCollection: 0,
      moduleCode: "mm",
      groupCode: "basic",
      version: "1",
      projectCode: "demo",
      tenantCode: "demo"
    }
  ]
};

// Excel字段映射 - 索引循环节点
export const loopIndexExcelFields = [
  // 基本信息列 (A-D)
  { field: "A", fieldCn: "序号", type: "Integer", required: true, region: "BASIC_INFO", description: "节点序号" },
  { field: "B", fieldCn: "节点类型", type: "String", required: true, region: "BASIC_INFO", description: "固定值: loopi" },
  { field: "C", fieldCn: "节点名称", type: "String", required: true, region: "BASIC_INFO", description: "节点显示名称" },
  { field: "D", fieldCn: "节点ID", type: "String", required: false, region: "BASIC_INFO", description: "节点唯一标识" },
  
  // 循环配置列 (E-H)
  { field: "E", fieldCn: "循环起始值", type: "String", required: true, region: "LOOP_CONFIG", description: "Start Value Expression" },
  { field: "F", fieldCn: "循环结束条件", type: "String", required: true, region: "LOOP_CONFIG", description: "End Condition Expression" },
  { field: "G", fieldCn: "循环方向", type: "String", required: true, region: "LOOP_CONFIG", description: "forward / backward" },
  { field: "H", fieldCn: "循环步长", type: "String", required: true, region: "LOOP_CONFIG", description: "Step Value Expression" },

  // 循环参数列 (I) - 使用 JSON 存储列表
  { field: "I", fieldCn: "循环参数", type: "JSON", required: true, region: "LOOP_PARAMS", description: "JSON Array of Local Variables" },
];

// Excel列区域定义
export const LOOP_INDEX_EXCEL_REGIONS = {
  BASIC_INFO: { start: 'A', end: 'D', name: '基本信息', color: 'blue' },
  LOOP_CONFIG: { start: 'E', end: 'H', name: '循环配置', color: 'green' },
  LOOP_PARAMS: { start: 'I', end: 'I', name: '循环参数', color: 'purple' },
} as const;
