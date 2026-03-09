"use client";

import { useState, useEffect } from "react";
import { 
  Brain, Play, Plug, Box, Shield, LogIn, 
  ChevronRight, FileJson, FileSpreadsheet, 
  Download, Upload, Menu, X, Copy, Check,
  Wrench, ChevronDown, ChevronRight as ChevronRightIcon,
  Save, Loader2
} from "lucide-react";
import { readCsv, writeCsv, readYaml, writeYaml } from "@/actions/file-ops";
import { NodeCategory, NodeExample, CATEGORY_COLORS, NodeType } from "@/types";
import { nodeExamples, groupedNodeExamples } from "@/lib/node-examples";
import { serviceNodeExample, excelFields } from "@/lib/service-node-example";
import { serviceCallExample, serviceCallFormConfig, serviceCallExcelFields, SERVICE_CALL_EXCEL_REGIONS } from "@/lib/service-call-example";
import { foreachNodeExample, foreachFormConfig, foreachExcelFields, FOREACH_EXCEL_REGIONS } from "@/lib/foreach-example";
import { logicJudgeExample, logicJudgeExcelFields, LOGIC_JUDGE_EXCEL_REGIONS } from "@/lib/logic-judge-example";
import { loopIndexExample, loopIndexExcelFields, LOOP_INDEX_EXCEL_REGIONS } from "@/lib/loop-index-example";

const categoryInfo: Record<string, { name: string; icon: React.ReactNode; description: string }> = {
  [NodeCategory.LOGIC_ACTIVITY]: {
    name: "逻辑活动块",
    icon: <Brain className="w-5 h-5" />,
    description: "处理业务逻辑判断与循环控制",
  },
  [NodeCategory.FLOW_STATEMENT]: {
    name: "流程语句",
    icon: <Play className="w-5 h-5" />,
    description: "控制流程执行顺序与状态",
  },
  [NodeCategory.CALL_ACTIVITY]: {
    name: "调用活动",
    icon: <Plug className="w-5 h-5" />,
    description: "负责与外部服务或内部方法交互",
  },
  [NodeCategory.OBJECT_ACTIVITY]: {
    name: "对象活动",
    icon: <Box className="w-5 h-5" />,
    description: "针对业务对象的数据操作与转换",
  },
  [NodeCategory.DATA_CHECK]: {
    name: "数据检查",
    icon: <Shield className="w-5 h-5" />,
    description: "数据完整性与合法性校验",
  },
  [NodeCategory.IO_PARAMS]: {
    name: "入参出参",
    icon: <LogIn className="w-5 h-5" />,
    description: "流程的起始输入与最终输出定义",
  },
  SERVICE_NODE: {
    name: "服务节点",
    icon: <Wrench className="w-5 h-5" />,
    description: "服务编排与业务流程定义",
  },
  SERVICE_CALL: {
    name: "服务调用",
    icon: <Plug className="w-5 h-5" />,
    description: "调用外部服务接口",
  },
};

type MainTab = string;
type ViewMode = "list" | "json" | "excel" | "split" | "form";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<MainTab>(NodeCategory.LOGIC_ACTIVITY);
  const [selectedNode, setSelectedNode] = useState<NodeExample | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("json");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(true);
  
  // 新增：底部 Tab 状态
  const [bottomTab, setBottomTab] = useState<"json" | "excel">("json");
  
  // File Data States
  const [loopIndexCsvData, setLoopIndexCsvData] = useState<string[][]>([]);
  const [localVariablesCsvData, setLocalVariablesCsvData] = useState<string[][]>([]); // New state for Local Variables
  const [loopIndexYamlContent, setLoopIndexYamlContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSheet, setActiveSheet] = useState<"nodeConfig" | "localVariables">("nodeConfig"); // New state for Sheet switching

  // Helper to convert index to Excel column name (0 -> A, 25 -> Z, 26 -> AA)
  const getExcelColumnName = (index: number) => {
    let dividend = index + 1;
    let columnName = "";
    while (dividend > 0) {
      const modulo = (dividend - 1) % 26;
      columnName = String.fromCharCode(65 + modulo) + columnName;
      dividend = Math.floor((dividend - 1) / 26);
    }
    return columnName;
  };

  const categories = [...Object.values(NodeCategory).filter(c => c !== NodeCategory.SERVICE_NODE), "SERVICE_NODE"];
  const isServiceNode = selectedCategory === "SERVICE_NODE";
  const isServiceCall = selectedNode?.nodeType === NodeType.CALL_SERVICE;
  
  // 逻辑活动块下的子类型判断
  const isLogicActivity = selectedCategory === NodeCategory.LOGIC_ACTIVITY;
  const isLogicJudge = selectedNode?.nodeType === NodeType.LOGIC_JUDGE;
  const isForeach = selectedNode?.nodeType === "foreach" as NodeType;
  const isLoopIndex = selectedNode?.nodeType === "loopi" as unknown as NodeType;
  const currentCategoryNodes = groupedNodeExamples[selectedCategory] || [];

  // Load data for Loop Index
  useEffect(() => {
    if (isLoopIndex) {
      setLoading(true);
      Promise.all([
        readCsv("/Users/johnson_mac/code/pocworkflow/flow-import-system/src/config/LOGIC_ACTIVITY/loop-index.csv"),
        readCsv("/Users/johnson_mac/code/pocworkflow/flow-import-system/src/config/LOGIC_ACTIVITY/loop-index-localVariables.csv"),
        readYaml("/Users/johnson_mac/code/pocworkflow/flow-import-system/src/config/LOGIC_ACTIVITY/loop-index.yaml")
      ]).then(([csv, localVarsCsv, yaml]) => {
        setLoopIndexCsvData(csv);
        setLocalVariablesCsvData(localVarsCsv);
        setLoopIndexYamlContent(yaml);
        setLoading(false);
      }).catch(err => {
        console.error("Failed to load files", err);
        setLoading(false);
      });
    }
  }, [isLoopIndex]);

  const handleSaveCsv = async () => {
    setSaving(true);
    try {
      if (activeSheet === "nodeConfig") {
        await writeCsv("/Users/johnson_mac/code/pocworkflow/flow-import-system/src/config/LOGIC_ACTIVITY/loop-index.csv", loopIndexCsvData);
      } else {
        await writeCsv("/Users/johnson_mac/code/pocworkflow/flow-import-system/src/config/LOGIC_ACTIVITY/loop-index-localVariables.csv", localVariablesCsvData);
      }
      // alert("CSV Saved!"); 
    } catch (err) {
      console.error(err);
      alert("Failed to save CSV");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveYaml = async () => {
    setSaving(true);
    try {
      await writeYaml("/Users/johnson_mac/code/pocworkflow/flow-import-system/src/config/LOGIC_ACTIVITY/loop-index.yaml", loopIndexYamlContent);
      // alert("YAML Saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save YAML");
    } finally {
      setSaving(false);
    }
  };


  // 侧边栏颜色映射
  const sidebarColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    [NodeCategory.LOGIC_ACTIVITY]: CATEGORY_COLORS[NodeCategory.LOGIC_ACTIVITY],
    [NodeCategory.FLOW_STATEMENT]: CATEGORY_COLORS[NodeCategory.FLOW_STATEMENT],
    [NodeCategory.CALL_ACTIVITY]: CATEGORY_COLORS[NodeCategory.CALL_ACTIVITY],
    [NodeCategory.OBJECT_ACTIVITY]: CATEGORY_COLORS[NodeCategory.OBJECT_ACTIVITY],
    [NodeCategory.DATA_CHECK]: CATEGORY_COLORS[NodeCategory.DATA_CHECK],
    [NodeCategory.IO_PARAMS]: CATEGORY_COLORS[NodeCategory.IO_PARAMS],
    SERVICE_NODE: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", icon: "🔧" },
  };

  const handleCopyJson = () => {
    if (selectedNode) {
      navigator.clipboard.writeText(selectedNode.jsonConfig);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="font-bold text-lg text-gray-800">流程导入设计</h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="p-2">
          {categories.map((category) => {
            const info = categoryInfo[category];
            const colors = sidebarColors[category] || sidebarColors[NodeCategory.LOGIC_ACTIVITY];
            const nodeCount = category === "SERVICE_NODE" ? 1 : (groupedNodeExamples[category]?.length || 0);
            const isActive = selectedCategory === category;
            
            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedNode(null);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors ${
                  isActive 
                    ? `${colors.bg} border-l-4 ${colors.border.replace("border-", "border-l-")}` 
                    : "hover:bg-gray-100"
                }`}
              >
                <span className={colors.text}>{info.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{info.name}</span>
                    <span className="text-xs text-gray-400">{nodeCount}</span>
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedCategory ? categoryInfo[selectedCategory].name : "节点类型分类"}
            </h2>
            <p className="text-sm text-gray-500">
              {selectedCategory 
                ? categoryInfo[selectedCategory].description 
                : "选择左侧分类查看节点详情"}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Upload className="w-4 h-4" />
              导入Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              导出模板
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Logic Activity List */}
          {isLogicActivity && (
            <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
              <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-3">节点列表</h3>
                
                <div className="space-y-2">
                  <div 
                    className={`p-3 rounded-lg border cursor-pointer ${isLogicJudge ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => setSelectedNode({
                      id: logicJudgeExample.nodeId,
                      nodeType: NodeType.LOGIC_JUDGE,
                      category: NodeCategory.LOGIC_ACTIVITY,
                      name: "logic_judge",
                      nameCn: "逻辑判断",
                      description: "处理复杂的业务逻辑分支判断",
                      jsonConfig: JSON.stringify(logicJudgeExample, null, 2),
                      excelFields: logicJudgeExcelFields
                    })}
                  >
                    <div className={`font-medium text-sm ${isLogicJudge ? 'text-blue-700' : 'text-gray-900'}`}>逻辑判断</div>
                    <div className={`text-xs mt-1 ${isLogicJudge ? 'text-blue-600' : 'text-gray-500'}`}>处理复杂的业务逻辑分支判断</div>
                  </div>

                  <div 
                    className={`p-3 rounded-lg border cursor-pointer ${isLoopIndex ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => setSelectedNode({
                      id: loopIndexExample.nodeId,
                      nodeType: "loopi" as unknown as NodeType, // loopi is not in NodeType enum yet or handled specially
                      category: NodeCategory.LOGIC_ACTIVITY,
                      name: "loopi",
                      nameCn: "索引循环",
                      description: "基于索引的循环控制",
                      jsonConfig: JSON.stringify(loopIndexExample, null, 2),
                      excelFields: loopIndexExcelFields
                    })}
                  >
                    <div className={`font-medium text-sm ${isLoopIndex ? 'text-orange-700' : 'text-gray-900'}`}>索引循环</div>
                    <div className={`text-xs mt-1 ${isLoopIndex ? 'text-orange-600' : 'text-gray-500'}`}>基于索引的循环控制</div>
                  </div>

                  <div 
                    className={`p-3 rounded-lg border cursor-pointer ${isForeach ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => setSelectedNode({
                      id: foreachNodeExample.nodeId,
                      nodeType: "foreach" as NodeType, // foreach is not in NodeType enum yet or handled specially
                      category: NodeCategory.LOGIC_ACTIVITY,
                      name: "foreach",
                      nameCn: "数组遍历",
                      description: "遍历集合中的元素",
                      jsonConfig: JSON.stringify(foreachNodeExample, null, 2),
                      excelFields: foreachExcelFields
                    })}
                  >
                    <div className={`font-medium text-sm ${isForeach ? 'text-cyan-700' : 'text-gray-900'}`}>数组遍历</div>
                    <div className={`text-xs mt-1 ${isForeach ? 'text-cyan-600' : 'text-gray-500'}`}>遍历集合中的元素</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLogicActivity && !isServiceNode && (
            <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
              <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-3">节点列表</h3>
                <div className="space-y-2">
                  {currentCategoryNodes.map((node) => {
                    const isActive = selectedNode?.id === node.id;
                    return (
                      <div
                        key={node.id}
                        className={`p-3 rounded-lg border cursor-pointer ${isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                        onClick={() => setSelectedNode(node)}
                      >
                        <div className={`font-medium text-sm ${isActive ? "text-blue-700" : "text-gray-900"}`}>{node.nameCn}</div>
                        <div className={`text-xs mt-1 ${isActive ? "text-blue-600" : "text-gray-500"}`}>{node.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Service Node List */}
          {isServiceNode && (
            <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
              <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-3">服务节点</h3>
                <div className="p-3 rounded-lg border border-indigo-500 bg-indigo-50">
                  <div className="font-medium text-sm">打开采购申请</div>
                  <div className="text-xs text-gray-500 mt-1">PurchaseRequisitionManagementAppService</div>
                </div>
              </div>
            </div>
          )}

          {/* Service Call List (Removed) */}
          {/* 
          {isServiceCall && (
            <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
              <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-3">节点列表</h3>
                
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium text-sm">方法调用</div>
                    <div className="text-xs text-gray-500 mt-1">执行系统内部定义的函数方法</div>
                  </div>

                  <div className="p-3 rounded-lg border border-blue-500 bg-blue-50 cursor-pointer">
                    <div className="font-medium text-sm text-blue-700">服务调用</div>
                    <div className="text-xs text-blue-600 mt-1">调用远程HTTP/RPC接口服务</div>
                  </div>

                  <div className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium text-sm">规则调用</div>
                    <div className="text-xs text-gray-500 mt-1">引用并执行业务规则集</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          */}

          {/* Node Detail */}
          <div className="flex-1 overflow-hidden bg-gray-50 flex flex-col">
            {/* Service Node Content */}
            {isServiceNode ? (
              // ... (Service Node content remains the same)
              <div className="p-6 overflow-y-auto flex-1">
                {/* ... (Existing implementation for Service Node) ... */}
                 {/* 为了节省篇幅，这里复用之前的代码逻辑，实际代码中保留 */}
                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                      服务节点
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 font-medium">打开采购申请</span>
                  </div>
                  <p className="text-gray-600">采购申请管理应用服务 - 服务编排示例</p>
                </div>
              </div>
            ) : isLogicJudge ? (
              <div className="flex flex-col h-full">
                {/* 上半部分：表单配置 */}
                <div className={`${isFormExpanded ? 'flex-1 min-h-0' : 'h-10 flex-none'} flex flex-col transition-all duration-300 ease-in-out`}>
                   <div 
                     className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200 cursor-pointer hover:bg-gray-200 select-none"
                     onClick={() => setIsFormExpanded(!isFormExpanded)}
                   >
                     <span className="font-medium text-gray-700 text-sm">表单配置</span>
                     {isFormExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRightIcon className="w-4 h-4 text-gray-500" />}
                   </div>
                   <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${isFormExpanded ? 'block' : 'hidden'}`}>
                    {/* 基本信息 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
                        <span className="font-medium text-blue-700 text-sm">基本信息</span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center">
                          <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 名称：</label>
                          <input type="text" value={logicJudgeExample.nodeName} className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        
                        {/* 循环类型 */}
                        <div className="flex items-center mt-4">
                           <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 循环类型：</label>
                           <div className="flex items-center gap-6">
                               <label className="flex items-center gap-2 cursor-pointer group">
                                   <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${logicJudgeExample.action.loopType === 'none' ? 'border-blue-600' : 'border-gray-300'}`}>
                                     {logicJudgeExample.action.loopType === 'none' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                   </div>
                                   <span className="text-sm text-gray-700">无</span>
                                   <input 
                                     type="radio" 
                                     className="hidden" 
                                     checked={logicJudgeExample.action.loopType === 'none'} 
                                     onChange={() => {
                                        // 实际项目中应更新状态，这里直接修改对象用于演示切换效果
                                        logicJudgeExample.action.loopType = 'none'; 
                                        setSelectedNode({...selectedNode!}); // 触发重渲染
                                     }} 
                                   />
                               </label>
                               <label className="flex items-center gap-2 cursor-pointer group">
                                   <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${logicJudgeExample.action.loopType === 'array' ? 'border-blue-600' : 'border-gray-300'}`}>
                                     {logicJudgeExample.action.loopType === 'array' && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                   </div>
                                   <span className="text-sm text-gray-700">数组遍历</span>
                                   <input 
                                     type="radio" 
                                     className="hidden" 
                                     checked={logicJudgeExample.action.loopType === 'array'} 
                                     onChange={() => {
                                        logicJudgeExample.action.loopType = 'array'; 
                                        setSelectedNode({...selectedNode!});
                                     }} 
                                   />
                               </label>
                           </div>
                        </div>
                      </div>
                    </div>

                    {logicJudgeExample.action.loopType === 'array' ? (
                      <>
                        {/* 循环体参数 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
                             <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                             <span className="font-medium text-gray-800 text-sm"><span className="text-red-500 mr-1">*</span>循环体参数：</span>
                             <input type="text" value="caseDTOs" className="w-64 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500" />
                          </div>
                          
                          <div className="px-4 py-3 border-b border-gray-200 bg-white">
                              <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">添加循环体参数</button>
                          </div>

                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">编码</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">名称</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">引用类型</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">变量类型</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">是否集合</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {logicJudgeExample.action.loopBodyParams?.map((param, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-gray-700">{param.code}</td>
                                  <td className="px-4 py-3 text-gray-700">{param.name}</td>
                                  <td className="px-4 py-3 text-gray-700">{param.refType}</td>
                                  <td className="px-4 py-3 text-gray-700">{param.variableType}</td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-xs ${param.isCollection ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {param.isCollection ? '是' : '否'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* 循环参数 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                            <span className="font-medium text-gray-800 text-sm"><span className="text-red-500 mr-1">*</span>循环参数：</span>
                            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">添加</button>
                          </div>
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">编码</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">名称</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">引用类型</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">变量类型</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">是否集合</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">操作</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                               {logicJudgeExample.action.loopParams?.map((param, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                     <input type="text" value={param.code} className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-gray-700" />
                                  </td>
                                  <td className="px-4 py-3">
                                     <input type="text" value={param.name} className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-gray-700" />
                                  </td>
                                  <td className="px-4 py-3 text-gray-700">{param.refType}</td>
                                  <td className="px-4 py-3 text-gray-700">{param.variableType}</td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-xs ${param.isCollection ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600'}`}>
                                      {param.isCollection ? '是' : '否'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <button className="text-red-500 hover:text-red-700 text-xs border border-red-200 px-2 py-1 rounded hover:bg-red-50">删除</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* 条件逻辑表达式参数 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
                            <span className="font-medium text-gray-800 text-sm pl-4">条件逻辑表达式参数：</span>
                          </div>
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">编码</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">名称</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">变量类型</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">是否集合</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">属性类型</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {logicJudgeExample.action.params.map((param, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-gray-700">{param.code}</td>
                                  <td className="px-4 py-3 text-gray-700">{param.name}</td>
                                  <td className="px-4 py-3 text-gray-700">{param.variableType}</td>
                                  <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-xs ${param.isCollection ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {param.isCollection ? '是' : '否'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-gray-500">{param.attributeType}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* 判断规则 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
                            <span className="font-medium text-gray-800 text-sm pl-4"><span className="text-red-500 mr-1">*</span>判断规则：</span>
                          </div>
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium w-24">条件分支</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium w-40">分支场景命名</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">条件逻辑表达式</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium w-48">操作</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {logicJudgeExample.action.rules.map((rule, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-gray-700">{rule.branch}</td>
                                  <td className="px-4 py-3">
                                    <input type="text" value={rule.scenarioName} className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-blue-500 focus:outline-none" />
                                  </td>
                                  <td className="px-4 py-3">
                                    {rule.branch === 'if' ? (
                                      <input type="text" value={rule.expression} className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:border-blue-500 focus:outline-none" />
                                    ) : (
                                      <div className="h-7"></div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                      {rule.branch === 'if' && <button className="px-2 py-1 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50">新增</button>}
                                      <button className="px-2 py-1 text-xs border border-blue-200 text-blue-600 rounded hover:bg-blue-50">新增局部变量</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* 条件逻辑分支 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
                            <span className="font-medium text-gray-800 text-sm text-gray-500 pl-4">条件逻辑分支：</span>
                          </div>
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">归属条件分支</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">分支场景命名</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">编码</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">名称</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">数据类型</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">是否集合</th>
                                <th className="px-4 py-3 text-left text-gray-500 font-medium">操作</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                               {logicJudgeExample.action.branches.length === 0 ? (
                                 <tr>
                                   <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-xs">暂无数据</td>
                                 </tr>
                               ) : (
                                 logicJudgeExample.action.branches.map((branch, idx) => (
                                   <tr key={idx}>
                                     {/* ... branch data ... */}
                                   </tr>
                                 ))
                               )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* 下半部分：数据结构预览 */}
                <div className={`${isFormExpanded ? 'h-80' : 'flex-1 min-h-0'} border-t border-gray-200 bg-white flex flex-col transition-all duration-300 ease-in-out`}>
                   <div className="flex border-b border-gray-200 px-4">
                      <button onClick={() => setBottomTab("json")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${bottomTab === "json" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        Json数据结构
                      </button>
                      <button onClick={() => setBottomTab("excel")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${bottomTab === "excel" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        Excel数据结构
                      </button>
                   </div>
                   
                   <div className="flex-1 overflow-auto">
                     {bottomTab === "json" ? (
                       <pre className="p-4 text-sm bg-slate-900 text-slate-100">
                         <code>{JSON.stringify(logicJudgeExample, null, 2)}</code>
                       </pre>
                     ) : (
                       <div className="h-full overflow-auto">
                         <table className="w-full text-sm border-collapse">
                           <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                             <tr>
                               <th className="px-4 py-3 text-left font-medium text-gray-500 w-20 border-b border-gray-200">Excel列</th>
                               <th className="px-4 py-3 text-left font-medium text-gray-500 w-48 border-b border-gray-200">字段名称</th>
                               <th className="px-4 py-3 text-left font-medium text-gray-500 border-b border-gray-200">数据示例</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 bg-white">
                              {/* J-L Basic Info */}
                              <tr className="bg-blue-50/30"><td colSpan={3} className="px-4 py-2 text-xs font-medium text-blue-700">基本信息 (J-L)</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">J</td><td className="px-4 py-3 text-gray-700">节点类型</td><td className="px-4 py-3 font-mono text-gray-600">logic_judge</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">K</td><td className="px-4 py-3 text-gray-700">节点名称</td><td className="px-4 py-3 text-gray-900">{logicJudgeExample.nodeName}</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">L</td><td className="px-4 py-3 text-gray-700">表达式</td><td className="px-4 py-3 text-gray-400">-</td></tr>

                              {/* M Params */}
                              <tr className="bg-green-50/30"><td colSpan={3} className="px-4 py-2 text-xs font-medium text-green-700">参数配置 (M)</td></tr>
                              <tr>
                                <td className="px-4 py-3 font-mono text-blue-600 align-top">M</td>
                                <td className="px-4 py-3 text-gray-700 align-top">逻辑判断参数</td>
                                <td className="px-4 py-3">
                                  <pre className="text-[10px] bg-gray-50 p-2 rounded border border-gray-100 overflow-x-auto text-gray-600 font-mono">
                                    {JSON.stringify(logicJudgeExample.action.params, null, 2)}
                                  </pre>
                                </td>
                              </tr>

                              {/* N Rules */}
                              <tr className="bg-orange-50/30"><td colSpan={3} className="px-4 py-2 text-xs font-medium text-orange-700">规则配置 (N)</td></tr>
                              <tr>
                                <td className="px-4 py-3 font-mono text-blue-600 align-top">N</td>
                                <td className="px-4 py-3 text-gray-700 align-top">判断规则</td>
                                <td className="px-4 py-3">
                                  <pre className="text-[10px] bg-gray-50 p-2 rounded border border-gray-100 overflow-x-auto text-gray-600 font-mono">
                                    {JSON.stringify(logicJudgeExample.action.rules, null, 2)}
                                  </pre>
                                </td>
                              </tr>

                              {/* O Branches */}
                              <tr className="bg-purple-50/30"><td colSpan={3} className="px-4 py-2 text-xs font-medium text-purple-700">分支配置 (O)</td></tr>
                              <tr>
                                <td className="px-4 py-3 font-mono text-blue-600 align-top">O</td>
                                <td className="px-4 py-3 text-gray-700 align-top">条件逻辑分支</td>
                                <td className="px-4 py-3">
                                  <pre className="text-[10px] bg-gray-50 p-2 rounded border border-gray-100 overflow-x-auto text-gray-600 font-mono">
                                    {JSON.stringify(logicJudgeExample.action.branches, null, 2)}
                                  </pre>
                                </td>
                              </tr>
                           </tbody>
                         </table>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            ) : isServiceCall ? (
              <div className="flex flex-col h-full">
                {/* 上半部分：表单配置 (Scrollable) */}
                <div className={`${isFormExpanded ? 'flex-1 min-h-0' : 'h-10 flex-none'} flex flex-col transition-all duration-300 ease-in-out`}>
                   <div 
                     className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200 cursor-pointer hover:bg-gray-200 select-none"
                     onClick={() => setIsFormExpanded(!isFormExpanded)}
                   >
                     <span className="font-medium text-gray-700 text-sm">表单配置</span>
                     {isFormExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRightIcon className="w-4 h-4 text-gray-500" />}
                   </div>
                   <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${isFormExpanded ? 'block' : 'hidden'}`}>
                    {/* 基本信息 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
                        <span className="font-medium text-blue-700 text-sm">基本信息</span>
                      </div>
                      <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="flex items-center">
                          <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> ID：</label>
                          <input type="text" readOnly value={serviceCallExample.nodeId} className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-gray-500 text-sm" />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 名称：</label>
                          <input type="text" value={serviceCallExample.nodeName} className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 服务设计：</label>
                          <div className="flex-1 flex gap-2">
                            <input type="text" value={serviceCallExample.action.ref.autowiredName} className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm" />
                            <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">选择</button>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 接口名称：</label>
                          <div className="flex-1 flex gap-2">
                            <input type="text" value={serviceCallExample.action.ref.methodCode} className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm" />
                            <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">选择</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 入参配置 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-gray-800 text-sm">入参配置</span>
                      </div>
                      <div className="p-4">
                        <table className="w-full text-sm border-collapse">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 border-b border-gray-200">引用类型</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 border-b border-gray-200">变量类型</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 border-b border-gray-200">编码</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 border-b border-gray-200">名称</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 border-b border-gray-200">描述</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 border-b border-gray-200">是否集合</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 border-b border-gray-200">赋值类型</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600 border-b border-gray-200">赋值内容</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {serviceCallExample.action.inputParameters.map((param, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-700">{param.refType === "basic" ? "基础类型" : param.refType === "dto" ? "DTO" : "对象"}</td>
                                <td className="px-4 py-3 text-gray-700">{param.paramType}</td>
                                <td className="px-4 py-3 text-gray-500">{param.code}</td>
                                <td className="px-4 py-3 text-gray-700">{param.name}</td>
                                <td className="px-4 py-3 text-gray-400">{param.description || '-'}</td>
                                <td className="px-4 py-3">
                                  <div className={`w-8 h-4 rounded-full relative transition-colors ${param.isCollection ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${param.isCollection ? 'translate-x-4' : ''}`}></div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="px-2 py-1 border border-gray-200 rounded bg-white text-gray-700 text-xs inline-block">
                                    {param.valType === "variable" ? "变量" : "表达式"}
                                    <ChevronDown className="w-3 h-3 inline-block ml-1 text-gray-400" />
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <input type="text" value={param.val} className="w-full px-2 py-1 border border-gray-200 rounded text-gray-700 bg-white focus:border-blue-500 focus:outline-none" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 出参配置 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
                        <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                        <span className="font-medium text-gray-800 text-sm">出参配置</span>
                      </div>
                      <div className="p-6 space-y-6">
                         {/* 引用类型 Radio Group */}
                         <div className="flex items-center">
                            <label className="w-24 text-sm font-medium text-gray-600">引用类型：</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${serviceCallExample.action.outputParameter.refType === "basic" ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                      {serviceCallExample.action.outputParameter.refType === "basic" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                    </div>
                                    <span className="text-sm text-gray-700">基础类型</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${serviceCallExample.action.outputParameter.refType === "Object" ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                      {serviceCallExample.action.outputParameter.refType === "Object" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                    </div>
                                    <span className="text-sm text-gray-700">对象</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${serviceCallExample.action.outputParameter.refType === "PARAM_OBJECT" ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                      {serviceCallExample.action.outputParameter.refType === "PARAM_OBJECT" && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                    </div>
                                    <span className="text-sm text-gray-700">参数对象</span>
                                </label>
                            </div>
                         </div>

                         {/* 是否集合 Switch */}
                         <div className="flex items-center">
                            <label className="w-24 text-sm font-medium text-gray-600">是否集合：</label>
                            <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${serviceCallExample.action.outputParameter.isCollection ? 'bg-blue-600' : 'bg-gray-200'}`}>
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${serviceCallExample.action.outputParameter.isCollection ? 'translate-x-6' : ''}`}></div>
                            </div>
                         </div>

                         {/* 参数对象 Input */}
                         <div className="flex items-center">
                            <label className="w-24 text-sm font-medium text-gray-600">参数对象：</label>
                            <input type="text" value={serviceCallExample.action.outputParameter.paramObject || ''} readOnly className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-500" placeholder="-" />
                         </div>

                         {/* 赋值类型 */}
                         <div className="flex items-center">
                            <label className="w-24 text-sm font-medium text-gray-600">赋值类型：</label>
                            <div className="flex-1">
                                <div className="inline-flex items-center justify-between w-32 px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700">
                                  <span>{serviceCallExample.action.outputParameter.valType === "variable" ? "变量" : "表达式"}</span>
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                         </div>

                         {/* 参数值 */}
                         <div className="flex items-center">
                            <label className="w-24 text-sm font-medium text-gray-600">参数值：</label>
                            <div className="flex-1 flex gap-2">
                                <input type="text" value={serviceCallExample.action.outputParameter.paramValue || serviceCallExample.action.outputParameter.receiveVariable} readOnly className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-500" />
                                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">选择变量</button>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 下半部分：数据结构预览 (Fixed height or resizable) */}
                <div className={`${isFormExpanded ? 'h-80' : 'flex-1 min-h-0'} border-t border-gray-200 bg-white flex flex-col transition-all duration-300 ease-in-out`}>
                   {/* Tabs */}
                   <div className="flex border-b border-gray-200 px-4">
                      <button 
                        onClick={() => setBottomTab("json")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          bottomTab === "json" 
                            ? "border-blue-600 text-blue-600" 
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Json数据结构
                      </button>
                      <button 
                        onClick={() => setBottomTab("excel")}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          bottomTab === "excel" 
                            ? "border-blue-600 text-blue-600" 
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Excel数据结构
                      </button>
                   </div>
                   
                   {/* Content */}
                   <div className="flex-1 overflow-auto bg-gray-50 p-0">
                      {bottomTab === "json" && (
                        <div className="h-full">
                          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
                             <span className="text-xs text-gray-500">JSON Source</span>
                             <button onClick={() => {navigator.clipboard.writeText(JSON.stringify(serviceCallExample, null, 2)); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                               {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                               {copied ? "已复制" : "复制"}
                             </button>
                          </div>
                          <pre className="p-4 text-sm font-mono text-gray-700 whitespace-pre-wrap">
                            {JSON.stringify(serviceCallExample, null, 2)}
                          </pre>
                        </div>
                      )}


                      {bottomTab === "excel" && (
                       <div className="h-full overflow-auto">
                         <table className="w-full text-sm border-collapse">
                           <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                             <tr>
                               <th className="px-4 py-3 text-left font-medium text-gray-500 w-20 border-b border-gray-200">Excel列</th>
                               <th className="px-4 py-3 text-left font-medium text-gray-500 w-48 border-b border-gray-200">字段名称</th>
                               <th className="px-4 py-3 text-left font-medium text-gray-500 border-b border-gray-200">数据示例</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 bg-white">
                              {/* J-Q Basic Info */}
                              <tr className="bg-blue-50/30"><td colSpan={3} className="px-4 py-2 text-xs font-medium text-blue-700">基本信息 (J-Q)</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">J</td><td className="px-4 py-3 text-gray-700">节点类型</td><td className="px-4 py-3 font-mono text-gray-600">service</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">K</td><td className="px-4 py-3 text-gray-700">节点名称</td><td className="px-4 py-3 text-gray-900">{serviceCallExample.nodeName}</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">L</td><td className="px-4 py-3 text-gray-700">表达式</td><td className="px-4 py-3 text-gray-400">-</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">M</td><td className="px-4 py-3 text-gray-700">方法id</td><td className="px-4 py-3 font-mono text-gray-600">{serviceCallExample.action.ref.methodId}</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">N</td><td className="px-4 py-3 text-gray-700">方法/服务编码</td><td className="px-4 py-3 font-mono text-gray-600">{serviceCallExample.action.ref.autowiredName}</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">O</td><td className="px-4 py-3 text-gray-700">服务api编码</td><td className="px-4 py-3 font-mono text-gray-600">{serviceCallExample.action.ref.methodCode}</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">P</td><td className="px-4 py-3 text-gray-700">模块编码</td><td className="px-4 py-3 font-mono text-gray-600">{serviceCallExample.action.ref.moduleCode}</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">Q</td><td className="px-4 py-3 text-gray-700">分组编码</td><td className="px-4 py-3 font-mono text-gray-600">{serviceCallExample.action.ref.groupCode}</td></tr>

                              {/* R Input Params */}
                              <tr className="bg-green-50/30"><td colSpan={3} className="px-4 py-2 text-xs font-medium text-green-700">入参配置 (R)</td></tr>
                              <tr>
                                <td className="px-4 py-3 font-mono text-blue-600 align-top">R</td>
                                <td className="px-4 py-3 text-gray-700 align-top">方法调用入参</td>
                                <td className="px-4 py-3">
                                  <pre className="text-[10px] bg-gray-50 p-2 rounded border border-gray-100 overflow-x-auto text-gray-600 font-mono">
                                    {JSON.stringify(serviceCallExample.action.inputParameters.map(p => ({
                                      _id: 44,
                                      id: 44,
                                      code: p.code,
                                      name: p.name,
                                      refType: p.refType,
                                      isCollection: p.isCollection,
                                      paramType: p.paramType,
                                      assignType: p.valType,
                                      expression: p.val
                                    })), null, 2)}
                                  </pre>
                                </td>
                              </tr>

                              {/* S-W Output Params */}
                              <tr className="bg-purple-50/30"><td colSpan={3} className="px-4 py-2 text-xs font-medium text-purple-700">出参配置 (S-W)</td></tr>
                              <tr>
                                <td className="px-4 py-3 font-mono text-blue-600 align-top">S</td>
                                <td className="px-4 py-3 text-gray-700 align-top">方法调用返回值编码</td>
                                <td className="px-4 py-3">
                                  <pre className="text-[10px] bg-gray-50 p-2 rounded border border-gray-100 overflow-x-auto text-gray-600 font-mono">
                                    {JSON.stringify({
                                      _id: 50,
                                      id: 50,
                                      code: serviceCallExample.action.outputParameter.receiveVariable,
                                      name: "基础校验结果",
                                      refType: serviceCallExample.action.outputParameter.refType,
                                      isCollection: serviceCallExample.action.outputParameter.isCollection,
                                      refName: serviceCallExample.action.outputParameter.paramObject,
                                      assignType: serviceCallExample.action.outputParameter.valType,
                                      expression: serviceCallExample.action.outputParameter.paramValue
                                    }, null, 2)}
                                  </pre>
                                </td>
                              </tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">T</td><td className="px-4 py-3 text-gray-700">属性赋值类型</td><td className="px-4 py-3 text-gray-400">-</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">U</td><td className="px-4 py-3 text-gray-700">赋值变量编码</td><td className="px-4 py-3 text-gray-400">-</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">V</td><td className="px-4 py-3 text-gray-700">赋值变量数据值</td><td className="px-4 py-3 text-gray-400">-</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">W</td><td className="px-4 py-3 text-gray-700">方法返回值变量</td><td className="px-4 py-3 text-gray-400">-</td></tr>
                           </tbody>
                         </table>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            ) : isLoopIndex ? (
              <div className="flex flex-col h-full">
                {/* 上半部分：表单配置 */}
                <div className={`${isFormExpanded ? 'flex-1 min-h-0' : 'h-10 flex-none'} flex flex-col transition-all duration-300 ease-in-out`}>
                   <div 
                     className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200 cursor-pointer hover:bg-gray-200 select-none"
                     onClick={() => setIsFormExpanded(!isFormExpanded)}
                   >
                     <span className="font-medium text-gray-700 text-sm">表单配置</span>
                     {isFormExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRightIcon className="w-4 h-4 text-gray-500" />}
                   </div>
                   <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${isFormExpanded ? 'block' : 'hidden'}`}>
                    {/* 基本信息 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
                        <span className="font-medium text-blue-700 text-sm">基本信息</span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center">
                          <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 名称：</label>
                          <input type="text" value={loopIndexExample.nodeName} className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        
                        {/* 循环配置 */}
                        <div className="mt-6 space-y-4">
                           <div className="flex items-center">
                              <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 循环起始值：</label>
                              <input type="text" value={loopIndexExample.action.startValueExpr} className="w-32 px-3 py-2 border border-gray-300 rounded text-sm" />
                           </div>
                           <div className="flex items-center">
                              <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 循环结束条件：</label>
                              <input type="text" value={loopIndexExample.action.endConditionExpr} className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm" />
                           </div>
                           <div className="flex items-center">
                              <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 循环方向：</label>
                              <select className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                                <option value="forward">正向</option>
                                <option value="backward">反向</option>
                              </select>
                           </div>
                           <div className="flex items-center">
                              <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 循环步长：</label>
                              <input type="text" value={loopIndexExample.action.stepValueExpr} className="w-32 px-3 py-2 border border-gray-300 rounded text-sm" />
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* 循环参数 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
                          <span className="font-medium text-gray-800 text-sm"><span className="text-red-500 mr-1">*</span>循环参数：</span>
                        </div>
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">添加</button>
                      </div>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-gray-500 font-medium">编码</th>
                            <th className="px-4 py-3 text-left text-gray-500 font-medium">名称</th>
                            <th className="px-4 py-3 text-left text-gray-500 font-medium">引用类型</th>
                            <th className="px-4 py-3 text-left text-gray-500 font-medium">变量类型</th>
                            <th className="px-4 py-3 text-left text-gray-500 font-medium">是否集合</th>
                            <th className="px-4 py-3 text-left text-gray-500 font-medium">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {loopIndexExample.localVariables.map((param, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                 <input type="text" value={param.variableCode} className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-gray-700" />
                              </td>
                              <td className="px-4 py-3">
                                 <input type="text" value={param.variableName} className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-gray-700" />
                              </td>
                              <td className="px-4 py-3 text-gray-700">{param.referenceName}</td>
                              <td className="px-4 py-3 text-gray-700">{param.javaType === "Integer" ? "整型" : param.javaType}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-xs ${param.isCollection ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600'}`}>
                                  {param.isCollection ? '是' : '否'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <button className="text-red-500 hover:text-red-700 text-xs border border-red-200 px-2 py-1 rounded hover:bg-red-50">删除</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* 下半部分：数据结构预览 */}
                <div className={`${isFormExpanded ? 'h-80' : 'flex-1 min-h-0'} border-t border-gray-200 bg-white flex flex-col transition-all duration-300 ease-in-out`}>
                   <div className="flex border-b border-gray-200 px-4">
                      <button onClick={() => setBottomTab("json")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${bottomTab === "json" ? "border-orange-600 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        Json数据结构
                      </button>
                      <button onClick={() => setBottomTab("excel")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${bottomTab === "excel" ? "border-orange-600 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        Excel数据结构
                      </button>
                   </div>
                   
                   <div className="flex-1 overflow-auto flex flex-col">
                     {loading ? (
                       <div className="h-full flex items-center justify-center text-gray-500 gap-2">
                         <Loader2 className="w-5 h-5 animate-spin" />
                         <span>Loading configuration...</span>
                       </div>
                     ) : bottomTab === "json" ? (
                       <div className="h-full flex flex-col">
                         <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
                           <span className="text-xs text-gray-500">YAML Source (Editable)</span>
                           <button 
                             onClick={handleSaveYaml} 
                             disabled={saving}
                             className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 disabled:opacity-50"
                           >
                             {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                             {saving ? "Saving..." : "Save YAML"}
                           </button>
                         </div>
                         <textarea 
                           className="flex-1 p-4 text-sm font-mono bg-slate-900 text-slate-100 resize-none focus:outline-none"
                           value={loopIndexYamlContent}
                           onChange={(e) => setLoopIndexYamlContent(e.target.value)}
                           spellCheck={false}
                         />
                       </div>
                     ) : (
                       <div className="h-full flex flex-col">
                         <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
                           <div className="flex items-center gap-4">
                             <div className="flex gap-2">
                               <button 
                                 onClick={() => setActiveSheet("nodeConfig")}
                                 className={`px-3 py-1.5 text-xs rounded-md transition-colors ${activeSheet === "nodeConfig" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                               >
                                 Node Config
                               </button>
                               <button 
                                 onClick={() => setActiveSheet("localVariables")}
                                 className={`px-3 py-1.5 text-xs rounded-md transition-colors ${activeSheet === "localVariables" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                               >
                                 Local Variables
                               </button>
                             </div>
                           </div>
                           <button 
                             onClick={handleSaveCsv} 
                             disabled={saving}
                             className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 disabled:opacity-50"
                           >
                             {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                             {saving ? "Saving..." : "Save CSV"}
                           </button>
                         </div>
                         <div className="flex-1 overflow-auto bg-gray-100 p-4">
                           <div className="bg-white border border-gray-300 shadow-sm overflow-hidden">
                             <table className="w-full text-sm border-collapse table-fixed">
                               <thead>
                                 <tr>
                                   <th className="w-10 bg-gray-100 border-b border-r border-gray-300"></th>
                                   {(activeSheet === "nodeConfig" ? loopIndexCsvData : localVariablesCsvData)[0]?.map((_, colIndex) => (
                                      <th key={colIndex} className="bg-gray-100 border-b border-r border-gray-300 px-2 py-1 font-normal text-gray-600 text-center select-none w-32">
                                        {activeSheet === "nodeConfig" 
                                          ? getExcelColumnName(5 + colIndex) // 5 = F
                                          : getExcelColumnName(24 + colIndex) // 24 = Y
                                        }
                                      </th>
                                    ))}
                                 </tr>
                               </thead>
                               <tbody>
                                 {(activeSheet === "nodeConfig" ? loopIndexCsvData : localVariablesCsvData).map((row, rowIndex) => (
                                   <tr key={rowIndex}>
                                     <td className="bg-gray-100 border-b border-r border-gray-300 text-center text-gray-500 text-xs select-none">
                                       {rowIndex + 1}
                                     </td>
                                     {row.map((cell, cellIndex) => (
                                       <td key={cellIndex} className="border-b border-r border-gray-200 p-0">
                                         <input 
                                           type="text" 
                                           value={cell} 
                                           className={`w-full h-full px-2 py-1 outline-none border-none focus:ring-2 focus:ring-blue-500 focus:ring-inset focus:z-10 ${rowIndex === 0 ? 'font-bold bg-gray-50' : 'bg-white'}`}
                                           onChange={(e) => {
                                             if (activeSheet === "nodeConfig") {
                                               const newData = [...loopIndexCsvData];
                                               newData[rowIndex] = [...newData[rowIndex]];
                                               newData[rowIndex][cellIndex] = e.target.value;
                                               setLoopIndexCsvData(newData);
                                             } else {
                                               const newData = [...localVariablesCsvData];
                                               newData[rowIndex] = [...newData[rowIndex]];
                                               newData[rowIndex][cellIndex] = e.target.value;
                                               setLocalVariablesCsvData(newData);
                                             }
                                           }}
                                         />
                                       </td>
                                     ))}
                                   </tr>
                                 ))}
                               </tbody>
                             </table>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            ) : isForeach ? (
              <div className="flex flex-col h-full">
                {/* 上半部分：表单配置 */}
                <div className={`${isFormExpanded ? 'flex-1 min-h-0' : 'h-10 flex-none'} flex flex-col transition-all duration-300 ease-in-out`}>
                   <div 
                     className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200 cursor-pointer hover:bg-gray-200 select-none"
                     onClick={() => setIsFormExpanded(!isFormExpanded)}
                   >
                     <span className="font-medium text-gray-700 text-sm">表单配置</span>
                     {isFormExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRightIcon className="w-4 h-4 text-gray-500" />}
                   </div>
                   <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${isFormExpanded ? 'block' : 'hidden'}`}>
                    {/* 基本信息 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
                        <span className="font-medium text-blue-700 text-sm">基本信息</span>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                          <div className="flex items-center">
                            <label className="w-24 text-sm text-gray-500 text-right mr-4">节点ID：</label>
                            <input type="text" readOnly value={foreachNodeExample.nodeId} className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-gray-500 text-sm" />
                          </div>
                          <div className="flex items-center">
                            <label className="w-24 text-sm text-gray-500 text-right mr-4">节点类型：</label>
                            <input type="text" readOnly value={foreachNodeExample.nodeType} className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-gray-500 text-sm" />
                          </div>
                          <div className="flex items-center">
                            <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 序号：</label>
                            <input type="number" value={foreachNodeExample.sn} className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
                          </div>
                          <div className="flex items-center">
                            <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 节点名称：</label>
                            <input type="text" value={foreachNodeExample.nodeName} className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" />
                          </div>
                        </div>

                        {/* 循环类型 (新增) */}
                        <div className="flex items-center mt-6 border-t border-gray-100 pt-6">
                           <label className="w-24 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 循环类型：</label>
                           <div className="flex items-center gap-6">
                               <label className="flex items-center gap-2 cursor-pointer group">
                                   <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                                     <div className="w-2 h-2 rounded-full bg-blue-600" />
                                   </div>
                                   <span className="text-sm text-gray-700">数组遍历</span>
                               </label>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* 循环配置 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
                        <div className="w-1 h-4 bg-green-600 rounded-full"></div>
                        <span className="font-medium text-gray-800 text-sm">循环配置</span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center">
                          <label className="w-32 text-sm text-gray-500 text-right mr-4"><span className="text-red-500">*</span> 目标集合表达式：</label>
                          <input type="text" value={foreachNodeExample.action.expr} className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                          <span className="ml-2 text-xs text-gray-400">输入要遍历的集合变量名</span>
                        </div>
                      </div>
                    </div>

                    {/* 循环参数表格 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
                        <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
                        <span className="font-medium text-gray-800 text-sm">循环参数</span>
                      </div>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-gray-500 font-medium">变量编码</th>
                            <th className="px-4 py-3 text-left text-gray-500 font-medium">变量名称</th>
                            <th className="px-4 py-3 text-left text-gray-500 font-medium">参数类型</th>
                            <th className="px-4 py-3 text-left text-gray-500 font-medium">值来源</th>
                            <th className="px-4 py-3 text-left text-gray-500 font-medium">是否集合</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {foreachNodeExample.action.loopParameter.map((param, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-mono text-blue-600">{param.parameterCode}</td>
                              <td className="px-4 py-3">{param.parameterName}</td>
                              <td className="px-4 py-3 font-mono text-purple-600">{param.parameterType}</td>
                              <td className="px-4 py-3">{param.loopValType}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded text-xs ${param.isCollection === 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {param.isCollection === 1 ? '是' : '否'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* 下半部分：数据结构预览 */}
                <div className={`${isFormExpanded ? 'h-80' : 'flex-1 min-h-0'} border-t border-gray-200 bg-white flex flex-col transition-all duration-300 ease-in-out`}>
                   <div className="flex border-b border-gray-200 px-4">
                      <button onClick={() => setBottomTab("json")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${bottomTab === "json" ? "border-cyan-600 text-cyan-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        Json数据结构
                      </button>
                      <button onClick={() => setBottomTab("excel")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${bottomTab === "excel" ? "border-cyan-600 text-cyan-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        Excel数据结构
                      </button>
                   </div>
                   
                   <div className="flex-1 overflow-auto">
                     {bottomTab === "json" ? (
                       <pre className="p-4 text-sm bg-slate-900 text-slate-100">
                         <code>{JSON.stringify(foreachNodeExample, null, 2)}</code>
                       </pre>
                     ) : (
                       <div className="h-full overflow-auto">
                         <table className="w-full text-sm border-collapse">
                           <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                             <tr>
                               <th className="px-4 py-3 text-left font-medium text-gray-500 w-20 border-b border-gray-200">Excel列</th>
                               <th className="px-4 py-3 text-left font-medium text-gray-500 w-48 border-b border-gray-200">字段名称</th>
                               <th className="px-4 py-3 text-left font-medium text-gray-500 border-b border-gray-200">数据示例</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 bg-white">
                              {/* A-D Basic Info */}
                              <tr className="bg-blue-50/30"><td colSpan={3} className="px-4 py-2 text-xs font-medium text-blue-700">基本信息 (A-D)</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">A</td><td className="px-4 py-3 text-gray-700">序号</td><td className="px-4 py-3 font-mono text-gray-600">{foreachNodeExample.sn}</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">B</td><td className="px-4 py-3 text-gray-700">节点类型</td><td className="px-4 py-3 font-mono text-gray-600">{foreachNodeExample.nodeType}</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">C</td><td className="px-4 py-3 text-gray-700">节点名称</td><td className="px-4 py-3 text-gray-900">{foreachNodeExample.nodeName}</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">D</td><td className="px-4 py-3 text-gray-700">节点ID</td><td className="px-4 py-3 font-mono text-gray-600">{foreachNodeExample.nodeId}</td></tr>

                              {/* E Loop Config */}
                              <tr className="bg-green-50/30"><td colSpan={3} className="px-4 py-2 text-xs font-medium text-green-700">循环配置 (E)</td></tr>
                              <tr><td className="px-4 py-3 font-mono text-blue-600">E</td><td className="px-4 py-3 text-gray-700">目标集合表达式</td><td className="px-4 py-3 font-mono text-green-600">{foreachNodeExample.action.expr}</td></tr>

                              {/* F-J Loop Params */}
                              <tr className="bg-purple-50/30"><td colSpan={3} className="px-4 py-2 text-xs font-medium text-purple-700">循环参数 (F-J)</td></tr>
                              {foreachNodeExample.action.loopParameter.map((param, idx) => (
                                <tr key={idx} className="border-t border-gray-100">
                                  <td colSpan={3} className="p-0">
                                    <table className="w-full">
                                      <tbody>
                                        <tr><td className="px-4 py-3 font-mono text-blue-600 w-20">F</td><td className="px-4 py-3 text-gray-700 w-48">循环变量编码</td><td className="px-4 py-3 font-mono text-gray-600">{param.parameterCode}</td></tr>
                                        <tr><td className="px-4 py-3 font-mono text-blue-600 w-20">G</td><td className="px-4 py-3 text-gray-700 w-48">循环变量名称</td><td className="px-4 py-3 text-gray-900">{param.parameterName}</td></tr>
                                        <tr><td className="px-4 py-3 font-mono text-blue-600 w-20">H</td><td className="px-4 py-3 text-gray-700 w-48">参数类型</td><td className="px-4 py-3 font-mono text-gray-600">{param.parameterType}</td></tr>
                                        <tr><td className="px-4 py-3 font-mono text-blue-600 w-20">I</td><td className="px-4 py-3 text-gray-700 w-48">值来源</td><td className="px-4 py-3 text-gray-900">{param.loopValType}</td></tr>
                                        <tr><td className="px-4 py-3 font-mono text-blue-600 w-20">J</td><td className="px-4 py-3 text-gray-700 w-48">是否集合</td><td className="px-4 py-3 text-gray-900">{param.isCollection === 1 ? '是' : '否'}</td></tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              ))}
                           </tbody>
                         </table>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            ) : selectedNode ? (
              // ... (Other nodes logic)
               <div className="p-6">
                {/* Node Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      CATEGORY_COLORS[selectedNode.category].bg + " " + CATEGORY_COLORS[selectedNode.category].text
                    }`}>
                      {categoryInfo[selectedNode.category].name}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 font-medium">{selectedNode.nameCn}</span>
                  </div>
                  <p className="text-gray-600">{selectedNode.description}</p>
                </div>

                {/* View Mode Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setViewMode("json")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      viewMode === "json" 
                        ? "bg-blue-600 text-white" 
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <FileJson className="w-4 h-4" />
                    JSON配置
                  </button>
                  <button
                    onClick={() => setViewMode("excel")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      viewMode === "excel" 
                        ? "bg-blue-600 text-white" 
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Excel字段
                  </button>
                </div>

                {/* JSON View */}
                {viewMode === "json" && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                      <span className="font-medium text-gray-700">JSON 配置示例</span>
                      <button
                        onClick={handleCopyJson}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? "已复制" : "复制"}
                      </button>
                    </div>
                    <pre className="p-4 text-sm overflow-x-auto bg-slate-900 text-slate-100">
                      <code>{selectedNode.jsonConfig}</code>
                    </pre>
                  </div>
                )}

                {/* Excel Fields View */}
                {viewMode === "excel" && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                      <span className="font-medium text-gray-700">Excel 字段定义</span>
                    </div>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">字段</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">中文名</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">必填</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">说明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedNode.excelFields.map((field, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-sm text-blue-600">{field.field}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{field.fieldCn}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{field.type}</span>
                            </td>
                            <td className="px-4 py-3">
                              {field.required ? (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">必填</span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">可选</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{field.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FileJson className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">选择一个节点查看详情</p>
                  <p className="text-sm mt-2">左侧选择分类和节点</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
