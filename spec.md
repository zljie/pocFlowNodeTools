# Flow Import System Development Specification

## 1. Architecture Overview
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React `useState` for local component state.

## 2. Directory Structure
- `src/app/`: Main application logic and UI components (e.g., `page.tsx`).
- `src/types/`: TypeScript definitions for node structures (`NodeExample`, `NodeCategory`) and enums.
- `src/lib/`: Mock data, example configurations, and Excel field mappings.

## 3. Node Development Standard

### 3.1 Data Modeling
For each new node type:
1.  **Type Definition**: Create or update interface in `src/types/`.
2.  **Example Data**: Create `src/lib/{node-type}-example.ts`.
    - Must export `exampleNode` object (JSON structure).
    - Must export `excelFields` array (Excel column mapping).
    - Must export `EXCEL_REGIONS` constant (Visual grouping).

### 3.2 Navigation Structure
- **Categories**: Group nodes under high-level categories (e.g., `LOGIC_ACTIVITY`, `SERVICE_NODE`).
- **Sidebar Logic**:
    - Top-level categories in the main sidebar.
    - When a category is selected (e.g., `LOGIC_ACTIVITY`), display its child nodes in the secondary list or handle selection logic directly.
    - **Do NOT** display intermediate "Excel Region" sidebars for Logic nodes (like Loop/Index); go directly to Detail View.

### 3.3 UI Layout Patterns
**Detail View (Right Panel)** must follow this structure:
1.  **Header**: Breadcrumb (Category / Node Name) and Description.
2.  **Form Configuration Area** (Top/Main):
    - Scrollable vertical list of form groups.
    - Distinct visual grouping for "Basic Info", "Configuration", "Parameters".
    - Use standard input components with clear labels.
    - Toggleable sections (Expand/Collapse) where appropriate.
3.  **Data Preview Area** (Bottom/Fixed or Resizable):
    - Tabs: "JSON Data Structure" vs "Excel Data Structure".
    - **JSON View**: Read-only code block with copy functionality.
    - **Excel View**: Table showing Column (A, B..), Field Name, and Example Value.

### 3.4 Excel Mapping Standard
- **Regions**: Group columns logically (e.g., A-D: Basic Info, E-H: Config).
- **Complex Data**: Use single column for complex arrays/objects (stored as JSON string), unless flattened mapping is required.

## 4. Code Conventions
- **State Management**: Use `useState` in `page.tsx` for view switching (`selectedCategory`, `selectedNode`).
- **Icons**: Import from `lucide-react`.
- **Colors**: Use `CATEGORY_COLORS` mapping for consistency.
- **Naming**: Use camelCase for variables/functions, PascalCase for components/interfaces.
