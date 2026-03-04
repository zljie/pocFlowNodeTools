import { ServiceNode, EXCEL_COLUMN_REGIONS, ReferenceType } from "@/types";

// 服务节点示例数据 - 基于Excel案例
export const serviceNodeExample: ServiceNode = {
  serviceDefinition: {
    appServiceCode: "PurchaseRequisitionManagementAppService",
    appServiceName: "采购申请管理应用服务",
    operationCode: "/open",
    operationName: "打开采购申请",
    phase: "服务设计",
    version: "100",
    module: "物料管理MM",
    subModule: "采购管理",
    dataType: "PurchaseRequisitionDTO"
  },
  orchestration: {
    steps: [
      {
        stepId: "1001",
        sequence: 1,
        stepType: "service",
        stepName: "校验打开文档基础参数",
        methodId: 49,
        serviceClass: "PurchaseRequisitionManagementService",
        methodName: "validateOpenDocumentsBasic",
        inputParameters: [
          {
            parameterCode: "documentId",
            parameterName: "文档ID",
            parameterType: "String",
            isRequired: 1,
            mappingType: "INPUT",
            mappingCode: "documentId"
          },
          {
            parameterCode: "userId",
            parameterName: "用户ID",
            parameterType: "String",
            isRequired: 1,
            mappingType: "CONTEXT",
            mappingCode: "currentUserId"
          }
        ],
        outputParameters: [
          {
            parameterCode: "validationResult",
            parameterName: "校验结果",
            parameterType: "Boolean",
            mappingType: "OUTPUT",
            mappingCode: "isValid"
          }
        ]
      },
      {
        stepId: "1002",
        sequence: 2,
        stepType: "service",
        stepName: "查询采购申请基本信息",
        methodId: 50,
        serviceClass: "PurchaseRequisitionQueryService",
        methodName: "queryPurchaseRequisitionBasic",
        inputParameters: [
          {
            parameterCode: "prId",
            parameterName: "采购申请ID",
            parameterType: "String",
            isRequired: 1,
            mappingType: "INPUT",
            mappingCode: "prId"
          }
        ],
        outputParameters: [
          {
            parameterCode: "purchaseRequisition",
            parameterName: "采购申请",
            parameterType: "PurchaseRequisitionDTO",
            isCollection: 0,
            mappingType: "OUTPUT",
            mappingCode: "prBasicInfo"
          }
        ]
      },
      {
        stepId: "1003",
        sequence: 3,
        stepType: "condition",
        stepName: "判断是否为草稿状态",
        inputParameters: [
          {
            parameterCode: "status",
            parameterName: "状态",
            parameterType: "String",
            mappingType: "MAPPING",
            mappingCode: "prBasicInfo.status"
          }
        ],
        outputParameters: [
          {
            parameterCode: "isDraft",
            parameterName: "是否草稿",
            parameterType: "Boolean"
          }
        ]
      },
      {
        stepId: "1004",
        sequence: 4,
        stepType: "service",
        stepName: "加载采购明细行",
        methodId: 51,
        serviceClass: "PurchaseRequisitionDetailService",
        methodName: "loadPurchaseRequisitionLines",
        inputParameters: [
          {
            parameterCode: "prId",
            parameterName: "采购申请ID",
            parameterType: "String",
            mappingType: "INPUT",
            mappingCode: "prId"
          },
          {
            parameterCode: "includeHistory",
            parameterName: "包含历史",
            parameterType: "Boolean",
            defaultVal: "false"
          }
        ],
        outputParameters: [
          {
            parameterCode: "lines",
            parameterName: "明细行列表",
            parameterType: "PurchaseRequisitionLineDTO",
            isCollection: 1,
            mappingType: "OUTPUT",
            mappingCode: "prLines"
          }
        ]
      },
      {
        stepId: "1005",
        sequence: 5,
        stepType: "service",
        stepName: "计算审批权限",
        methodId: 52,
        serviceClass: "ApprovalAuthorityService",
        methodName: "calculateApprovalAuthority",
        inputParameters: [
          {
            parameterCode: "prId",
            parameterName: "采购申请ID",
            parameterType: "String",
            mappingType: "INPUT",
            mappingCode: "prId"
          },
          {
            parameterCode: "currentUserId",
            parameterName: "当前用户ID",
            parameterType: "String",
            mappingType: "CONTEXT",
            mappingCode: "currentUserId"
          }
        ],
        outputParameters: [
          {
            parameterCode: "canEdit",
            parameterName: "可编辑",
            parameterType: "Boolean",
            mappingType: "OUTPUT",
            mappingCode: "canEdit"
          },
          {
            parameterCode: "canApprove",
            parameterName: "可审批",
            parameterType: "Boolean",
            mappingType: "OUTPUT",
            mappingCode: "canApprove"
          }
        ]
      }
    ]
  },
  variables: {
    inputs: [
      {
        variableId: "INPUT_001",
        variableCode: "documentId",
        variableName: "文档ID",
        variableType: "INPUT",
        javaType: "String",
        referenceType: ReferenceType.BASIC,
        isRequired: 1,
        moduleCode: "MM",
        groupCode: "PURCHASE"
      },
      {
        variableId: "INPUT_002",
        variableCode: "prId",
        variableName: "采购申请ID",
        variableType: "INPUT",
        javaType: "String",
        referenceType: ReferenceType.BASIC,
        isRequired: 1,
        moduleCode: "MM",
        groupCode: "PURCHASE"
      },
      {
        variableId: "INPUT_003",
        variableCode: "currentUserId",
        variableName: "当前用户ID",
        variableType: "CONTEXT",
        javaType: "String",
        referenceType: ReferenceType.BASIC,
        description: "从上下文获取的当前用户ID",
        moduleCode: "SYSTEM",
        groupCode: "USER"
      }
    ],
    outputs: [
      {
        variableId: "OUTPUT_001",
        variableCode: "purchaseRequisition",
        variableName: "采购申请",
        variableType: "OUTPUT",
        javaType: "PurchaseRequisitionDTO",
        referenceType: ReferenceType.DTO,
        referenceName: "PurchaseRequisitionDTO",
        referenceCode: "DTO_001",
        moduleCode: "MM",
        groupCode: "PURCHASE"
      },
      {
        variableId: "OUTPUT_002",
        variableCode: "prLines",
        variableName: "采购明细行",
        variableType: "OUTPUT",
        javaType: "List<PurchaseRequisitionLineDTO>",
        referenceType: ReferenceType.DTO,
        referenceName: "PurchaseRequisitionLineDTO",
        referenceCode: "DTO_002",
        isCollection: 1,
        moduleCode: "MM",
        groupCode: "PURCHASE"
      },
      {
        variableId: "OUTPUT_003",
        variableCode: "canEdit",
        variableName: "可编辑",
        variableType: "OUTPUT",
        javaType: "Boolean",
        referenceType: ReferenceType.BASIC,
        moduleCode: "MM",
        groupCode: "AUTHORITY"
      },
      {
        variableId: "OUTPUT_004",
        variableCode: "canApprove",
        variableName: "可审批",
        variableType: "OUTPUT",
        javaType: "Boolean",
        referenceType: ReferenceType.BASIC,
        moduleCode: "MM",
        groupCode: "AUTHORITY"
      }
    ]
  }
};

// Excel字段映射 - 对应42列
export const excelFields = [
  // A:E - 服务定义 (蓝色)
  { field: "A", fieldCn: "服务编码", type: "String", required: true, region: "SERVICE_DEFINITION", description: "应用服务编码" },
  { field: "B", fieldCn: "服务名称", type: "String", required: true, region: "SERVICE_DEFINITION", description: "应用服务中文名称" },
  { field: "C", fieldCn: "服务API编码", type: "String", required: true, region: "SERVICE_DEFINITION", description: "操作接口编码" },
  { field: "D", fieldCn: "服务API名称", type: "String", required: true, region: "SERVICE_DEFINITION", description: "操作接口名称" },
  { field: "E", fieldCn: "数据类型", type: "String", required: false, region: "SERVICE_DEFINITION", description: "返回数据类型" },
  
  // F:X - 编排步骤 (紫色)
  { field: "F", fieldCn: "链路ID", type: "String", required: true, region: "ORCHESTRATION", description: "步骤链路唯一标识" },
  { field: "G", fieldCn: "父级编码ID", type: "String", required: false, region: "ORCHESTRATION", description: "父步骤ID" },
  { field: "H", fieldCn: "步骤ID", type: "String", required: true, region: "ORCHESTRATION", description: "步骤唯一标识" },
  { field: "I", fieldCn: "顺序号", type: "Integer", required: true, region: "ORCHESTRATION", description: "执行顺序" },
  { field: "J", fieldCn: "节点类型", type: "String", required: true, region: "ORCHESTRATION", description: "service/condition/loop" },
  { field: "K", fieldCn: "节点名称", type: "String", required: true, region: "ORCHESTRATION", description: "步骤名称" },
  { field: "L", fieldCn: "方法ID", type: "Integer", required: false, region: "ORCHESTRATION", description: "服务方法ID" },
  { field: "M", fieldCn: "服务类", type: "String", required: false, region: "ORCHESTRATION", description: "服务类名" },
  { field: "N", fieldCn: "方法名", type: "String", required: false, region: "ORCHESTRATION", description: "服务方法名" },
  { field: "O", fieldCn: "输入参数1编码", type: "String", required: false, region: "ORCHESTRATION", description: "输入参数代码" },
  { field: "P", fieldCn: "输入参数1名称", type: "String", required: false, region: "ORCHESTRATION", description: "输入参数名称" },
  { field: "Q", fieldCn: "输入参数1类型", type: "String", required: false, region: "ORCHESTRATION", description: "参数Java类型" },
  { field: "R", fieldCn: "输入参数1必填", type: "Integer", required: false, region: "ORCHESTRATION", description: "1必填/0可选" },
  { field: "S", fieldCn: "输入参数1映射类型", type: "String", required: false, region: "ORCHESTRATION", description: "INPUT/CONTEXT/MAPPING" },
  { field: "T", fieldCn: "输入参数1映射编码", type: "String", required: false, region: "ORCHESTRATION", description: "映射源编码" },
  { field: "U", fieldCn: "输出参数1编码", type: "String", required: false, region: "ORCHESTRATION", description: "输出参数代码" },
  { field: "V", fieldCn: "输出参数1名称", type: "String", required: false, region: "ORCHESTRATION", description: "输出参数名称" },
  { field: "W", fieldCn: "输出参数1类型", type: "String", required: false, region: "ORCHESTRATION", description: "参数Java类型" },
  { field: "X", fieldCn: "输出参数1映射类型", type: "String", required: false, region: "ORCHESTRATION", description: "OUTPUT/MAPPING" },
  
  // Y:AP - 变量 (绿色)
  { field: "Y", fieldCn: "变量ID", type: "String", required: true, region: "VARIABLES", description: "变量唯一标识" },
  { field: "Z", fieldCn: "变量编码", type: "String", required: true, region: "VARIABLES", description: "变量代码" },
  { field: "AA", fieldCn: "变量名称", type: "String", required: true, region: "VARIABLES", description: "变量中文名" },
  { field: "AB", fieldCn: "变量类型", type: "String", required: true, region: "VARIABLES", description: "INPUT/OUTPUT/CONTEXT" },
  { field: "AC", fieldCn: "Java类型", type: "String", required: false, region: "VARIABLES", description: "Java数据类型" },
  { field: "AD", fieldCn: "引用类型", type: "String", required: false, region: "VARIABLES", description: "dto/basic/Object" },
  { field: "AE", fieldCn: "引用名称", type: "String", required: false, region: "VARIABLES", description: "DTO/Entity名称" },
  { field: "AF", fieldCn: "引用ID", type: "String", required: false, region: "VARIABLES", description: "引用对象ID" },
  { field: "AG", fieldCn: "是否集合", type: "Integer", required: false, region: "VARIABLES", description: "1是/0否" },
  { field: "AH", fieldCn: "模块编码", type: "String", required: false, region: "VARIABLES", description: "所属模块" },
  { field: "AI", fieldCn: "分组编码", type: "String", required: false, region: "VARIABLES", description: "变量分组" },
  { field: "AJ", fieldCn: "描述", type: "String", required: false, region: "VARIABLES", description: "变量说明" },
  { field: "AK", fieldCn: "必填", type: "Integer", required: false, region: "VARIABLES", description: "1必填/0可选" },
  { field: "AL", fieldCn: "默认值", type: "String", required: false, region: "VARIABLES", description: "默认值" },
  { field: "AM", fieldCn: "版本", type: "String", required: false, region: "VARIABLES", description: "版本号" },
  { field: "AN", fieldCn: "项目编码", type: "String", required: false, region: "VARIABLES", description: "所属项目" },
  { field: "AO", fieldCn: "租户编码", type: "String", required: false, region: "VARIABLES", description: "所属租户" },
  { field: "AP", fieldCn: "循环变量类型", type: "String", required: false, region: "VARIABLES", description: "INDEX/ARRAY" },
];

// Excel行数据示例
export const excelDataRows = [
  // 服务定义行
  { row: 1, ...serviceNodeExample.serviceDefinition },
  
  // 编排步骤行 (5个步骤)
  ...serviceNodeExample.orchestration.steps.map((step, idx) => ({
    row: idx + 2,
    ...step,
    inputParameters: undefined,
    outputParameters: undefined,
    inputParam1Code: step.inputParameters?.[0]?.parameterCode,
    inputParam1Name: step.inputParameters?.[0]?.parameterName,
    inputParam1Type: step.inputParameters?.[0]?.parameterType,
    inputParam1Required: step.inputParameters?.[0]?.isRequired,
    inputParam1MappingType: step.inputParameters?.[0]?.mappingType,
    inputParam1MappingCode: step.inputParameters?.[0]?.mappingCode,
    outputParam1Code: step.outputParameters?.[0]?.parameterCode,
    outputParam1Name: step.outputParameters?.[0]?.parameterName,
    outputParam1Type: step.outputParameters?.[0]?.parameterType,
    outputParam1MappingType: step.outputParameters?.[0]?.mappingType,
  })),
  
  // 输入变量行
  ...serviceNodeExample.variables.inputs.map((v, idx) => ({
    row: serviceNodeExample.orchestration.steps.length + idx + 2,
    variableId: v.variableId,
    variableCode: v.variableCode,
    variableName: v.variableName,
    variableType: v.variableType,
    javaType: v.javaType,
    referenceType: v.referenceType,
    referenceName: v.referenceName,
    referenceId: v.referenceId,
    isCollection: v.isCollection,
    moduleCode: v.moduleCode,
    groupCode: v.groupCode,
    description: v.description,
    isRequired: v.isRequired,
    version: v.version,
  })),
  
  // 输出变量行
  ...serviceNodeExample.variables.outputs.map((v, idx) => ({
    row: serviceNodeExample.orchestration.steps.length + serviceNodeExample.variables.inputs.length + idx + 2,
    variableId: v.variableId,
    variableCode: v.variableCode,
    variableName: v.variableName,
    variableType: v.variableType,
    javaType: v.javaType,
    referenceType: v.referenceType,
    referenceName: v.referenceName,
    referenceId: v.referenceId,
    isCollection: v.isCollection,
    moduleCode: v.moduleCode,
    groupCode: v.groupCode,
    description: v.description,
    isRequired: v.isRequired,
    version: v.version,
  })),
];
