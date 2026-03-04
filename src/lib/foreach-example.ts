import { 
  ForeachNode, 
  LoopParameter,
  LoopAction 
} from "@/types";

// Foreach循环节点示例数据 - 基于用户提供的JSON
export const foreachNodeExample: ForeachNode = {
  nodeId: "1001",
  nodeType: "loop",
  sn: 1,
  nodeName: "遍历订单明细",
  action: {
    expr: "items",
    loopParameter: [
      {
        parameterCode: "item",
        parameterName: "订单明细集合",
        parameterType: "snItemDTO",
        loopValType: "self:inner",
        isCollection: 1
      }
    ]
  }
};

// 更多循环节点示例
export const foreachNodeExamples: ForeachNode[] = [
  foreachNodeExample,
  {
    nodeId: "1002",
    nodeType: "loop",
    sn: 2,
    nodeName: "遍历用户列表",
    action: {
      expr: "userList",
      loopParameter: [
        {
          parameterCode: "user",
          parameterName: "用户对象",
          parameterType: "UserDTO",
          loopValType: "self:inner",
          isCollection: 1
        }
      ]
    }
  },
  {
    nodeId: "1003",
    nodeType: "loop",
    sn: 3,
    nodeName: "遍历商品SKU",
    action: {
      expr: "skuList",
      loopParameter: [
        {
          parameterCode: "sku",
          parameterName: "SKU商品",
          parameterType: "SkuInfoDTO",
          loopValType: "context",
          isCollection: 1
        }
      ]
    }
  }
];

// 表单字段配置 - 用于UI渲染
export const foreachFormConfig = {
  basicInfo: {
    title: "基本信息",
    fields: [
      { key: "nodeId", label: "节点ID", type: "input", readonly: true, required: false },
      { key: "nodeType", label: "节点类型", type: "input", readonly: true, required: false },
      { key: "sn", label: "序号", type: "input", readonly: false, required: true },
      { key: "nodeName", label: "节点名称", type: "input", readonly: false, required: true, placeholder: "请输入节点名称" },
    ]
  },
  loopConfig: {
    title: "循环配置",
    fields: [
      { key: "expr", label: "目标集合表达式", type: "input", readonly: false, required: true, placeholder: "如: items, userList" },
    ]
  },
  loopParams: {
    title: "循环参数",
    columns: [
      { key: "parameterCode", label: "变量编码", width: 120 },
      { key: "parameterName", label: "变量名称", width: 150 },
      { key: "parameterType", label: "参数类型", width: 120 },
      { key: "loopValType", label: "值来源", width: 100 },
      { key: "isCollection", label: "是否集合", width: 80 },
    ]
  }
};

// Excel字段映射 - Foreach循环节点
export const foreachExcelFields = [
  // 基本信息列 (A-D)
  { field: "A", fieldCn: "序号", type: "Integer", required: true, region: "BASIC_INFO", description: "节点序号" },
  { field: "B", fieldCn: "节点类型", type: "String", required: true, region: "BASIC_INFO", description: "固定值: loop" },
  { field: "C", fieldCn: "节点名称", type: "String", required: true, region: "BASIC_INFO", description: "节点显示名称" },
  { field: "D", fieldCn: "节点ID", type: "String", required: false, region: "BASIC_INFO", description: "节点唯一标识" },
  
  // 循环配置列 (E-J)
  { field: "E", fieldCn: "目标集合表达式", type: "String", required: true, region: "LOOP_CONFIG", description: "要遍历的集合变量名" },
  { field: "F", fieldCn: "循环变量编码", type: "String", required: true, region: "LOOP_PARAMS", description: "循环中的变量名" },
  { field: "G", fieldCn: "循环变量名称", type: "String", required: true, region: "LOOP_PARAMS", description: "变量中文名" },
  { field: "H", fieldCn: "参数类型", type: "String", required: true, region: "LOOP_PARAMS", description: "循环变量的数据类型" },
  { field: "I", fieldCn: "值来源", type: "String", required: false, region: "LOOP_PARAMS", description: "self:inner/context" },
  { field: "J", fieldCn: "是否集合", type: "Integer", required: false, region: "LOOP_PARAMS", description: "1是/0否" },
];

// Excel列区域定义
export const FOREACH_EXCEL_REGIONS = {
  BASIC_INFO: { start: 'A', end: 'D', name: '基本信息', color: 'blue' },
  LOOP_CONFIG: { start: 'E', end: 'E', name: '循环配置', color: 'green' },
  LOOP_PARAMS: { start: 'F', end: 'J', name: '循环参数', color: 'purple' },
} as const;

// Excel行数据 - 扁平化格式
export const foreachExcelRows = [
  {
    row: 1,
    sn: foreachNodeExample.sn,
    nodeType: foreachNodeExample.nodeType,
    nodeName: foreachNodeExample.nodeName,
    nodeId: foreachNodeExample.nodeId,
    expr: foreachNodeExample.action.expr,
    loopParamCode: foreachNodeExample.action.loopParameter[0]?.parameterCode,
    loopParamName: foreachNodeExample.action.loopParameter[0]?.parameterName,
    loopParamType: foreachNodeExample.action.loopParameter[0]?.parameterType,
    loopValType: foreachNodeExample.action.loopParameter[0]?.loopValType,
    isCollection: foreachNodeExample.action.loopParameter[0]?.isCollection,
  }
];
