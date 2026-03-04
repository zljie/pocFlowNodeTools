# Data Structures Documentation

This document provides an overview of the key data structures used in the Flow Import System. The project uses TypeScript interfaces and enums to define the structure of flow definitions, nodes, variables, and service orchestrations.

## Table of Contents

- [Enums](#enums)
- [Core Flow Structures](#core-flow-structures)
- [Node Configuration](#node-configuration)
- [Variables & Parameters](#variables--parameters)
- [Service Orchestration](#service-orchestration)
- [Service Call Specifics](#service-call-specifics)

## Enums

### `NodeCategory`
Defines the high-level categories for flow nodes.
- `LOGIC_ACTIVITY`: Logic control (e.g., loops, conditions).
- `FLOW_STATEMENT`: Flow control statements (e.g., return, break, continue).
- `CALL_ACTIVITY`: Invocation of external or internal methods/services.
- `OBJECT_ACTIVITY`: Object manipulation (e.g., assignment, mapping).
- `DATA_CHECK`: Data validation nodes.
- `IO_PARAMS`: Input/Output definition nodes.
- `SERVICE_NODE`: Specialized service node.

### `NodeType`
Specific types of nodes within categories.
- **Logic**: `LOGIC_JUDGE` (if/else), `LOOP_INDEX`, `LOOP_ARRAY`.
- **Flow**: `FLOW_RETURN`, `FLOW_CONTINUE`, `FLOW_BREAK`.
- **Call**: `CALL_METHOD`, `CALL_SERVICE`, `CALL_RULE`.
- **Object**: `OBJECT_ASSIGN`, `OBJECT_MAPPING`.
- **Check**: `DATA_CHECK_NODE`.
- **IO**: `IO_START`, `IO_END`.

### `ReferenceType` / `RefType`
Defines the type of reference for variables or parameters.
- `DTO`: Data Transfer Object.
- `BASIC`: Basic data types (String, Integer, etc.).
- `OBJECT`: Generic object.
- `PARAM_OBJECT`: Parameter object (used in service calls).

### `AssignmentType`
Defines how a value is assigned.
- `FIXED`: A static value.
- `VARIABLE`: From another variable.
- `EXPRESSION`: Result of an expression.
- `CONTEXT_VAR`: From context.

## Core Flow Structures

### `FlowDefinition`
The root structure representing a complete flow.
- `flowCode` (string): Unique identifier for the flow.
- `flowName` (string): Human-readable name.
- `flowType` (string): Type of flow (e.g., "service").
- `globalInputParameters` (Parameter[]): Inputs required to start the flow.
- `globalOutputParameters` (Parameter[]): Outputs returned by the flow.
- `localVariables` (LocalVariable[]): Variables defined within the flow scope.
- `autoWiredVariables` (AutoWiredVariable[]): Dependencies injected automatically.
- `nodes` (FlowNode[]): The sequence of nodes executing the logic.

### `FlowNode`
Represents a single step in the flow.
- `nodeId` (string): Unique ID of the node.
- `nodeType` (string): Maps to `NodeType`.
- `nodeName` (string): Display name.
- `sn` (number): Serial number/order.
- `action` (NodeAction): Configuration of what this node actually does.
- `localVariables` (LocalVariable[]): Variables scoped to this node (e.g., loop variables).
- `nodes` (FlowNode[]): Child nodes (used in container nodes like loops or branches).

## Node Configuration

### `NodeAction`
Detailed configuration for a node's execution logic.
- `expr` (string): Expression for logic judges or loops.
- `ref` (object): Reference to methods or services (contains `methodId`, `methodCode`, etc.).
- `inputParameters` (Parameter[]): Inputs passed to the action.
- `outputParameter` (object): Where to store the result.
- `assignList` (object[]): List of assignments for `OBJECT_ASSIGN` nodes.
- `val` (string): Return value for `FLOW_RETURN`.

## Variables & Parameters

### `Parameter`
Defines an input or output parameter.
- `parameterCode`, `parameterName`: Identifiers.
- `parameterType`: Data type (e.g., "String", "Object").
- `referenceType`: Maps to `ReferenceType`.
- `isCollection` (number): 1 if array/list, 0 otherwise.
- `isRequired` (number): 1 if mandatory.

### `LocalVariable`
Variables used temporarily within a flow or node.
- `variableCode`, `variableName`.
- `javaType`: Underlying Java type.
- `referenceType`, `isCollection`.

### `AutoWiredVariable`
External services or components injected into the flow.
- `variableCode`: The name used to reference the service.
- `autoWiredType`: Type of injection.

## Service Orchestration

### `ServiceNode`
A comprehensive structure for a service definition.
- `serviceDefinition`: Metadata (code, name, version, module).
- `orchestration`: Contains the `steps` (OrchestrationStep[]) to execute.
- `variables`: Inputs and outputs for the service.

### `OrchestrationStep`
A step within a `ServiceNode` orchestration.
- `stepId`, `stepName`.
- `stepType`: Type of step.
- `serviceClass`, `methodName`: For method invocations.
- `inputParameters`, `outputParameters`: Step-specific data mapping.

## Service Call Specifics

### `ServiceCallNode`
Specialized structure for configuring external service calls.
- `basicInfo`: Service ID, name, interface name.
- `inputParams` (ServiceCallInputParam[]): Configuration for request arguments.
- `outputParams` (ServiceCallOutputParam[]): Configuration for handling response data.

### `ServiceCallInputParam` / `ServiceCallOutputParam`
- `refType`: Type of data.
- `assignmentType`: How the value is sourced (Fixed/Variable/Expression).
- `code`, `name`: Parameter identifiers.
- `paramObject`: DTO type for object parameters.
