import { NodeCategory, NodeType, NodeExample } from "@/types";

export const nodeExamples: NodeExample[] = [
  // ==================== 一、逻辑活动块 ====================
  {
    id: "logic-judge",
    nodeType: NodeType.LOGIC_JUDGE,
    category: NodeCategory.LOGIC_ACTIVITY,
    name: "Logic Judge",
    nameCn: "逻辑判断",
    description: "多分支条件判断节点，根据表达式结果执行不同分支",
    jsonConfig: `{
  "nodeId": "1101",
  "nodeType": "if",
  "sn": 1,
  "nodeName": "若状态为PAID且金额>0",
  "action": {
    "expr": "Objects.equals(item.getStatus(), \"PAID\") && item.getAmount() != null && item.getAmount() > 0"
  },
  "nodes": [
    {
      "nodeId": "1201",
      "nodeType": "method",
      "nodeName": "调用收货方法"
    }
  ]
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "nodeType", fieldCn: "节点类型", type: "String", required: true, description: "固定值: if" },
      { field: "sn", fieldCn: "排序号", type: "Integer", required: true, description: "同层级排序" },
      { field: "nodeName", fieldCn: "节点名称", type: "String", required: true, description: "显示名称" },
      { field: "action.expr", fieldCn: "条件表达式", type: "String", required: true, description: "Java表达式" },
    ],
  },
  {
    id: "loop-index",
    nodeType: NodeType.LOOP_INDEX,
    category: NodeCategory.LOGIC_ACTIVITY,
    name: "Index Loop",
    nameCn: "索引循环",
    description: "基于索引次数的循环结构，控制循环执行次数",
    jsonConfig: `{
  "nodeId": "1001",
  "nodeType": "loop",
  "sn": 1,
  "nodeName": "遍历订单明细",
  "action": {
    "expr": "orderNumber"
  },
  "localVariables": [
    {
      "variableCode": "index",
      "variableName": "索引",
      "variableType": "Integer",
      "loopVariableType": "self"
    }
  ]
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "nodeType", fieldCn: "节点类型", type: "String", required: true, description: "固定值: loop" },
      { field: "action.expr", fieldCn: "循环表达式", type: "String", required: true, description: "循环次数表达式" },
      { field: "localVariables", fieldCn: "循环变量", type: "Array", required: true, description: "循环内的局部变量" },
    ],
  },
  {
    id: "loop-array",
    nodeType: NodeType.LOOP_ARRAY,
    category: NodeCategory.LOGIC_ACTIVITY,
    name: "Array Loop",
    nameCn: "数组遍历",
    description: "遍历集合或数组元素的循环，对每个元素执行逻辑",
    jsonConfig: `{
  "nodeId": "1001",
  "nodeType": "loop",
  "sn": 1,
  "nodeName": "遍历订单明细",
  "action": {
    "expr": "items"
  },
  "localVariables": [
    {
      "variableCode": "item",
      "variableName": "订单明细元素",
      "variableType": "SnItemDTO",
      "referenceType": "dto",
      "loopVariableType": "self"
    }
  ]
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "action.expr", fieldCn: "集合表达式", type: "String", required: true, description: "要遍历的集合" },
      { field: "localVariables", fieldCn: "元素变量", type: "Array", required: true, description: "当前元素变量" },
    ],
  },

  // ==================== 二、流程语句 ====================
  {
    id: "flow-return",
    nodeType: NodeType.FLOW_RETURN,
    category: NodeCategory.FLOW_STATEMENT,
    name: "Return",
    nameCn: "返回",
    description: "结束当前逻辑并返回结果",
    jsonConfig: `{
  "nodeId": "9001",
  "nodeType": "return",
  "sn": 99,
  "nodeName": "流程返回计数",
  "action": {
    "val": "count",
    "returnType": "Integer",
    "receiveVariable": "processedCount"
  }
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "nodeType", fieldCn: "节点类型", type: "String", required: true, description: "固定值: return" },
      { field: "action.val", fieldCn: "返回值", type: "String", required: true, description: "返回的变量或表达式" },
      { field: "action.returnType", fieldCn: "返回类型", type: "String", required: true, description: "Java类型" },
    ],
  },
  {
    id: "flow-continue",
    nodeType: NodeType.FLOW_CONTINUE,
    category: NodeCategory.FLOW_STATEMENT,
    name: "Continue",
    nameCn: "继续",
    description: "跳过当前循环，进入下一次迭代",
    jsonConfig: `{
  "nodeId": "1202",
  "nodeType": "continue",
  "sn": 2,
  "nodeName": "继续下一次循环"
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "nodeType", fieldCn: "节点类型", type: "String", required: true, description: "固定值: continue" },
    ],
  },
  {
    id: "flow-break",
    nodeType: NodeType.FLOW_BREAK,
    category: NodeCategory.FLOW_STATEMENT,
    name: "Break",
    nameCn: "中断",
    description: "强制跳出当前循环结构",
    jsonConfig: `{
  "nodeId": "1203",
  "nodeType": "break",
  "sn": 3,
  "nodeName": "中断循环"
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "nodeType", fieldCn: "节点类型", type: "String", required: true, description: "固定值: break" },
    ],
  },

  // ==================== 三、调用活动 ====================
  {
    id: "call-method",
    nodeType: NodeType.CALL_METHOD,
    category: NodeCategory.CALL_ACTIVITY,
    name: "Method Call",
    nameCn: "方法调用",
    description: "执行系统内部定义的函数方法",
    jsonConfig: `{
  "nodeId": "1201",
  "nodeType": "method",
  "sn": 1,
  "nodeName": "调用收货方法",
  "action": {
    "ref": {
      "methodId": "F1",
      "methodCode": "processReceipt",
      "autowiredName": "receiptService"
    },
    "inputParameters": [
      {
        "sn": 1,
        "code": "snItem",
        "paramType": "Object",
        "refType": "dto",
        "valType": "variable",
        "val": "item"
      }
    ],
    "outputParameter": {
      "receiveVariable": "receiptId"
    }
  }
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "nodeType", fieldCn: "节点类型", type: "String", required: true, description: "固定值: method" },
      { field: "action.ref.methodCode", fieldCn: "方法编码", type: "String", required: true, description: "方法唯一标识" },
      { field: "action.ref.autowiredName", fieldCn: "服务变量名", type: "String", required: true, description: "引用的服务变量" },
      { field: "action.inputParameters", fieldCn: "输入参数", type: "Array", required: false, description: "方法入参" },
      { field: "action.outputParameter", fieldCn: "输出参数", type: "Object", required: false, description: "方法返回值" },
    ],
  },
  {
    id: "call-service",
    nodeType: NodeType.CALL_SERVICE,
    category: NodeCategory.CALL_ACTIVITY,
    name: "Service Call",
    nameCn: "服务调用",
    description: "调用远程HTTP/RPC接口服务",
    jsonConfig: `{
  "nodeId": "2002",
  "nodeType": "service",
  "sn": 2,
  "nodeName": "调用检查服务",
  "action": {
    "serviceUrl": "/api/order/check",
    "serviceMethod": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "orderNo": "\${orderNo}",
      "amount": "\${amount}"
    },
    "timeout": 30000
  }
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "nodeType", fieldCn: "节点类型", type: "String", required: true, description: "固定值: service" },
      { field: "action.serviceUrl", fieldCn: "服务地址", type: "String", required: true, description: "API接口地址" },
      { field: "action.serviceMethod", fieldCn: "请求方法", type: "String", required: true, description: "GET/POST/PUT/DELETE" },
      { field: "action.body", fieldCn: "请求体", type: "Object", required: false, description: "JSON请求参数" },
    ],
  },
  {
    id: "call-rule",
    nodeType: NodeType.CALL_RULE,
    category: NodeCategory.CALL_ACTIVITY,
    name: "Rule Call",
    nameCn: "规则调用",
    description: "引用并执行业务规则集",
    jsonConfig: `{
  "nodeId": "3001",
  "nodeType": "rule",
  "sn": 1,
  "nodeName": "调用价格计算规则",
  "action": {
    "ruleId": "PRICE_CALC_RULE",
    "ruleCode": "calculatePrice",
    "inputParams": {
      "amount": "\${amount}",
      "quantity": "\${quantity}"
    },
    "outputParam": "calculatedPrice"
  }
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "nodeType", fieldCn: "节点类型", type: "String", required: true, description: "固定值: rule" },
      { field: "action.ruleCode", fieldCn: "规则编码", type: "String", required: true, description: "规则唯一标识" },
    ],
  },

  // ==================== 四、对象活动 ====================
  {
    id: "object-assign",
    nodeType: NodeType.OBJECT_ASSIGN,
    category: NodeCategory.OBJECT_ACTIVITY,
    name: "Object Assign",
    nameCn: "对象赋值",
    description: "修改或设置对象属性值",
    jsonConfig: `{
  "nodeId": "1202",
  "nodeType": "assign",
  "sn": 2,
  "nodeName": "计数自增",
  "action": {
    "assignList": [
      {
        "receiveVariable": "count",
        "val": "count + 1",
        "valType": "expression"
      }
    ]
  }
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "nodeType", fieldCn: "节点类型", type: "String", required: true, description: "固定值: assign" },
      { field: "action.assignList", fieldCn: "赋值列表", type: "Array", required: true, description: "赋值操作集合" },
      { field: "action.assignList[].receiveVariable", fieldCn: "目标变量", type: "String", required: true, description: "接收赋值的变量" },
      { field: "action.assignList[].val", fieldCn: "值", type: "String", required: true, description: "赋值表达式" },
    ],
  },
  {
    id: "object-mapping",
    nodeType: NodeType.OBJECT_MAPPING,
    category: NodeCategory.OBJECT_ACTIVITY,
    name: "Parameter Mapping",
    nameCn: "参数映射",
    description: "不同对象间的数据结构转换",
    jsonConfig: `{
  "nodeId": "4001",
  "nodeType": "mapping",
  "sn": 1,
  "nodeName": "订单DTO映射",
  "action": {
    "sourceObject": "orderDTO",
    "targetObject": "saveDTO",
    "fieldMappings": [
      {
        "sourceField": "orderNo",
        "targetField": "poNumber",
        "transform": "uppercase"
      },
      {
        "sourceField": "amount",
        "targetField": "totalAmount"
      }
    ]
  }
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "nodeType", fieldCn: "节点类型", type: "String", required: true, description: "固定值: mapping" },
      { field: "action.sourceObject", fieldCn: "源对象", type: "String", required: true, description: "源数据对象" },
      { field: "action.targetObject", fieldCn: "目标对象", type: "String", required: true, description: "目标数据对象" },
      { field: "action.fieldMappings", fieldCn: "字段映射", type: "Array", required: true, description: "字段对应关系" },
    ],
  },

  // ==================== 五、数据检查 ====================
  {
    id: "data-check",
    nodeType: NodeType.DATA_CHECK_NODE,
    category: NodeCategory.DATA_CHECK,
    name: "Data Check",
    nameCn: "数据检查",
    description: "验证输入数据是否符合预设规则",
    jsonConfig: `{
  "nodeId": "5001",
  "nodeType": "check",
  "sn": 1,
  "nodeName: "校验订单金额",
  "action": {
    "rules": [
      {
        "field": "amount",
        "validator": "greaterThan",
        "value": 0,
        "message": "金额必须大于0"
      },
      {
        "field": "orderNo",
        "validator": "notEmpty",
        "message": "订单号不能为空"
      }
    ],
    "failAction": "throwException"
  }
}`,
    excelFields: [
      { field: "nodeId", fieldCn: "节点ID", type: "String", required: true, description: "唯一标识" },
      { field: "nodeType", fieldCn: "节点类型", type: "String", required: true, description: "固定值: check" },
      { field: "action.rules", fieldCn: "校验规则", type: "Array", required: true, description: "规则集合" },
      { field: "action.failAction", fieldCn: "失败动作", type: "String", required: false, description: "校验失败后动作" },
    ],
  },

  // ==================== 六、入参出参 ====================
  {
    id: "io-start",
    nodeType: NodeType.IO_START,
    category: NodeCategory.IO_PARAMS,
    name: "Start Node",
    nameCn: "开始节点",
    description: "流程入口，定义输入参数",
    jsonConfig: `{
  "flowCode": "DemoForeachIfMethod_v2",
  "flowName": "示例-遍历判断并调用方法",
  "flowType": "service",
  "globalInputParameters": [
    {
      "sn": 1,
      "parameterId": "2001",
      "parameterCode": "items",
      "parameterName": "待处理集合",
      "parameterType": "Object",
      "referenceType": "dto",
      "referenceName": "订单明细DTO",
      "referenceId": "901",
      "referenceCode": "snItemDTO",
      "isCollection": 1,
      "isPaging": 0,
      "isRequired": 1
    }
  ]
}`,
    excelFields: [
      { field: "flowCode", fieldCn: "流程编码", type: "String", required: true, description: "流程唯一标识" },
      { field: "flowName", fieldCn: "流程名称", type: "String", required: true, description: "显示名称" },
      { field: "globalInputParameters", fieldCn: "全局输入参数", type: "Array", required: true, description: "输入参数列表" },
      { field: "globalInputParameters[].parameterCode", fieldCn: "参数编码", type: "String", required: true, description: "参数唯一标识" },
      { field: "globalInputParameters[].parameterType", fieldCn: "参数类型", type: "String", required: true, description: "String/Integer/Object" },
      { field: "globalInputParameters[].referenceType", fieldCn: "引用类型", type: "String", required: true, description: "dto/basic/Object" },
    ],
  },
  {
    id: "io-end",
    nodeType: NodeType.IO_END,
    category: NodeCategory.IO_PARAMS,
    name: "End Node",
    nameCn: "结束节点",
    description: "流程出口，定义输出参数",
    jsonConfig: `{
  "globalOutputParameters": [
    {
      "sn": 1,
      "parameterId": "2002",
      "parameterCode": "processedCount",
      "parameterName": "处理计数",
      "parameterType": "Integer",
      "referenceType": "basic",
      "referenceName": "整数",
      "referenceId": "10",
      "isCollection": 0,
      "isRequired": 0,
      "defaultVal": 0
    }
  ],
  "localVariables": [
    {
      "sn": 2,
      "variableCode": "receiptId",
      "variableName": "收货单ID",
      "javaType": "String",
      "referenceType": "dto",
      "referenceName": "订单明细DTO",
      "isCollection": 0
    }
  ]
}`,
    excelFields: [
      { field: "globalOutputParameters", fieldCn: "全局输出参数", type: "Array", required: true, description: "输出参数列表" },
      { field: "globalOutputParameters[].parameterCode", fieldCn: "参数编码", type: "String", required: true, description: "参数唯一标识" },
      { field: "globalOutputParameters[].parameterType", fieldCn: "参数类型", type: "String", required: true, description: "返回类型" },
      { field: "localVariables", fieldCn: "局部变量", type: "Array", required: false, description: "流程内使用的变量" },
    ],
  },
];

// 按分类分组的节点列表
export const groupedNodeExamples = nodeExamples.reduce((acc, node) => {
  if (!acc[node.category]) {
    acc[node.category] = [];
  }
  acc[node.category].push(node);
  return acc;
}, {} as Record<string, NodeExample[]>);
