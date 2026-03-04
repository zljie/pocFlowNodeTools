import { 
  ServiceCallNode, 
  RefType,
  AssignmentType,
} from "@/types";

// 服务调用节点示例数据 - 基于用户提供的JSON
export const serviceCallExample: ServiceCallNode = {
  nodeId: "1201",
  nodeType: "service",
  order: 1,
  sn: 1,
  nodeName: "调用收货方法",
  action: {
    ref: {
      methodId: "F1",
      methodCode: "processReceipt",
      autowiredName: "receiptService",
      moduleCode: "mm",
      groupCode: "basic"
    },
    inputParameters: [
      {
        sn: 1,
        code: "snItem",
        paramType: "Object",
        refType: "dto",
        valType: "variable",
        val: "item",
        name: "收货明细",
        description: "收货单明细对象",
        isCollection: 0
      },
      {
        sn: 2,
        code: "amount",
        paramType: "Double",
        refType: "basic",
        valType: "expression",
        val: "item.amount",
        name: "金额",
        description: "收货金额",
        isCollection: 0
      }
    ],
    outputParameter: {
      receiveVariable: "receiptId",
      refType: "basic",
      isCollection: 0,
      paramObject: "String",
      valType: "variable",
      paramValue: "receiptId"
    }
  }
};

// 表单字段配置 - 用于UI渲染
export const serviceCallFormConfig = {
  basicInfo: {
    title: "基本信息",
    fields: [
      { key: "nodeId", label: "ID", type: "input", readonly: true, required: false },
      { key: "nodeName", label: "名称", type: "input", readonly: false, required: true, placeholder: "请输入节点名称" },
      { key: "serviceDesign", label: "服务设计", type: "select", readonly: false, required: true, placeholder: "选择服务" },
      { key: "interfaceName", label: "接口名称", type: "select", readonly: false, required: true, placeholder: "选择接口" },
    ]
  },
  inputParams: {
    title: "入参配置",
    columns: [
      { key: "refType", label: "引用类型", width: 100 },
      { key: "paramType", label: "变量类型", width: 100 },
      { key: "code", label: "编码", width: 120 },
      { key: "name", label: "名称", width: 120 },
      { key: "description", label: "描述", width: 150 },
      { key: "isCollection", label: "是否集合", width: 80 },
      { key: "valType", label: "赋值类型", width: 100 },
      { key: "val", label: "赋值内容", width: 150 },
    ]
  },
  outputParams: {
    title: "出参配置",
    fields: [
      { key: "refType", label: "引用类型", type: "radio", options: [
        { label: "基础类型", value: RefType.BASIC },
        { label: "对象", value: RefType.OBJECT },
        { label: "参数对象", value: RefType.PARAM_OBJECT }
      ]},
      { key: "isCollection", label: "是否集合", type: "switch" },
      { key: "paramObject", label: "参数对象", type: "input", placeholder: "请输入对象类型" },
      { key: "valType", label: "赋值类型", type: "select", options: [
        { label: "变量", value: AssignmentType.VARIABLE }
      ]},
      { key: "paramValue", label: "参数值", type: "input", placeholder: "请输入接收变量名" },
    ]
  }
};

// Excel字段映射 - 服务调用节点
export const serviceCallExcelFields = [
  // 基本信息列 (J-Q)
  { field: "J", fieldCn: "节点类型", type: "String", required: true, region: "BASIC_INFO", description: "service" },
  { field: "K", fieldCn: "节点名称", type: "String", required: true, region: "BASIC_INFO", description: "节点显示名称" },
  { field: "L", fieldCn: "表达式", type: "String", required: false, region: "BASIC_INFO", description: "条件表达式" },
  { field: "M", fieldCn: "方法id", type: "String", required: false, region: "BASIC_INFO", description: "Method ID" },
  { field: "N", fieldCn: "方法/服务编码", type: "String", required: true, region: "BASIC_INFO", description: "Service/Method Code" },
  { field: "O", fieldCn: "服务api编码", type: "String", required: true, region: "BASIC_INFO", description: "API Operation Code" },
  { field: "P", fieldCn: "模块编码", type: "String", required: false, region: "BASIC_INFO", description: "Module Code" },
  { field: "Q", fieldCn: "分组编码", type: "String", required: false, region: "BASIC_INFO", description: "Group Code" },
  
  // 入参配置列 (R)
  { field: "R", fieldCn: "方法调用入参", type: "JSON", required: false, region: "INPUT_PARAMS", description: "JSON Array string" },
  
  // 出参配置列 (S-W)
  { field: "S", fieldCn: "方法调用返回值编码", type: "JSON", required: false, region: "OUTPUT_PARAMS", description: "JSON Object string" },
  { field: "T", fieldCn: "属性赋值类型", type: "String", required: false, region: "OUTPUT_PARAMS", description: "Assign Type" },
  { field: "U", fieldCn: "赋值变量编码", type: "String", required: false, region: "OUTPUT_PARAMS", description: "Variable Code" },
  { field: "V", fieldCn: "赋值变量数据值", type: "String", required: false, region: "OUTPUT_PARAMS", description: "Value" },
  { field: "W", fieldCn: "方法返回值变量", type: "String", required: false, region: "OUTPUT_PARAMS", description: "Return Variable" },
];

// Excel行数据 - 扁平化格式
export const serviceCallExcelRows = [
  {
    row: 1,
    // Basic Info
    nodeType: serviceCallExample.nodeType,
    nodeName: serviceCallExample.nodeName,
    expression: "",
    methodId: serviceCallExample.action.ref.methodId,
    serviceCode: serviceCallExample.action.ref.autowiredName,
    apiCode: serviceCallExample.action.ref.methodCode,
    moduleCode: serviceCallExample.action.ref.moduleCode,
    groupCode: serviceCallExample.action.ref.groupCode,
    
    // Input Params (JSON string)
    inputParams: JSON.stringify(serviceCallExample.action.inputParameters.map(p => ({
      _id: 44, // Mock ID
      id: 44,  // Mock ID
      code: p.code,
      name: p.name,
      description: p.description,
      refType: p.refType,
      required: 1,
      isCollection: p.isCollection,
      paramType: p.paramType,
      assignType: p.valType,
      expression: p.val
    })), null, 2),
    
    // Output Params (JSON string)
    outputParamCode: JSON.stringify({
      _id: 50, // Mock ID
      id: 50,  // Mock ID
      code: serviceCallExample.action.outputParameter.receiveVariable,
      name: "基础校验结果", // Mock name
      refType: serviceCallExample.action.outputParameter.refType,
      isCollection: serviceCallExample.action.outputParameter.isCollection,
      refName: serviceCallExample.action.outputParameter.paramObject,
      assignType: serviceCallExample.action.outputParameter.valType,
      expression: serviceCallExample.action.outputParameter.paramValue
    }, null, 2),
    
    assignType: "",
    assignVarCode: "",
    assignVarValue: "",
    returnVar: ""
  }
];

// Excel列区域定义
export const SERVICE_CALL_EXCEL_REGIONS = {
  BASIC_INFO: { start: 'J', end: 'Q', name: '基础信息', color: 'blue' },
  INPUT_PARAMS: { start: 'R', end: 'R', name: '入参配置', color: 'green' },
  OUTPUT_PARAMS: { start: 'S', end: 'W', name: '出参配置', color: 'purple' },
} as const;
