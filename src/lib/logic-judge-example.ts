
import { LogicJudgeNode } from "@/types";

// 逻辑判断节点示例数据
export const logicJudgeExample: LogicJudgeNode = {
  nodeId: "2001",
  nodeType: "logic_judge",
  sn: 1,
  nodeName: "业务逻辑判断",
  action: {
    loopType: "none", // 默认为无
    params: [
      {
        code: "vendorIndex",
        name: "供应商对象",
        variableType: "参数对象",
        isCollection: 0,
        attributeType: "供应商对象"
      },
      {
        code: "vendor2DTO",
        name: "供应商对象",
        variableType: "参数对象",
        isCollection: 1,
        attributeType: "供应商对象"
      },
      {
        code: "goodsReceipt2DTO",
        name: "物品接收规则",
        variableType: "参数对象",
        isCollection: 0,
        attributeType: "物品接收规则"
      },
      {
        code: "object",
        name: "匿名对象",
        variableType: "基础类型",
        isCollection: 0,
        attributeType: "-"
      }
    ],
    rules: [
      {
        branch: "if",
        scenarioName: "如果",
        expression: "vendorIndex.getIsBlocked() == ture"
      },
      {
        branch: "else",
        scenarioName: "否则",
        expression: ""
      }
    ],
    branches: [],
    loopBodyParams: [
      {
        code: "caseDTOs",
        name: "测试参数对象11",
        refType: "参数对象",
        variableType: "测试参数对象11",
        isCollection: 1,
        attributeType: "-"
      }
    ],
    loopParams: [
      {
        code: "mytesttest2DTO",
        name: "测试参数对象11",
        refType: "参数对象",
        variableType: "测试参数对象11",
        isCollection: 0,
        attributeType: "-"
      },
      {
        code: "cslogicflowdto",
        name: "测试服务编排",
        refType: "参数对象",
        variableType: "测试服务编排",
        isCollection: 0,
        attributeType: "-"
      }
    ]
  }
};

// Excel字段映射 - 逻辑判断节点
export const logicJudgeExcelFields = [
  // 基本信息列 (J-L)
  { field: "J", fieldCn: "节点类型", type: "String", required: true, region: "BASIC_INFO", description: "logic_judge" },
  { field: "K", fieldCn: "节点名称", type: "String", required: true, region: "BASIC_INFO", description: "节点显示名称" },
  { field: "L", fieldCn: "表达式", type: "String", required: false, region: "BASIC_INFO", description: "条件表达式" },
  
  // 逻辑参数列 (M)
  { field: "M", fieldCn: "逻辑判断参数", type: "JSON", required: false, region: "PARAMS", description: "JSON Array" },
  
  // 规则配置列 (N)
  { field: "N", fieldCn: "判断规则", type: "JSON", required: false, region: "RULES", description: "JSON Array" },

  // 分支配置列 (O)
  { field: "O", fieldCn: "条件逻辑分支", type: "JSON", required: false, region: "BRANCHES", description: "JSON Array" },
];

// Excel列区域定义
export const LOGIC_JUDGE_EXCEL_REGIONS = {
  BASIC_INFO: { start: 'J', end: 'L', name: '基础信息', color: 'blue' },
  PARAMS: { start: 'M', end: 'M', name: '参数配置', color: 'green' },
  RULES: { start: 'N', end: 'N', name: '规则配置', color: 'orange' },
  BRANCHES: { start: 'O', end: 'O', name: '分支配置', color: 'purple' },
} as const;
