# Fetch UI CLI - Technical Requirements Document

## Overview

Fetch UI is a command-line interface (CLI) tool distributed as an npm package, designed to facilitate interactive component downloading from custom registries. It aims to provide a seamless experience for developers to fetch and integrate UI components into their projects, with full compatibility with shadcn registry format.

## Core Features

### 1. Command Line Interface

- Package name: `fetch-ui`
- Distribution: npm package
- Usage: Supports both global installation and npx execution
- Primary command structure:
  ```bash
  npx fetch-ui add name --registry http://some-path.com --to-folder ./path/to/folder
  ```

### 2. Registry Integration

- Support for custom component registries
- Compatibility with shadcn registry format
- Registry features:
  - Component metadata hosting
  - Component declaration information
  - Version management
  - Dependencies specification
  - Component styles and variants

### 3. Component Download Features

- Interactive component selection
- Registry configuration
- Target directory specification
- Dependency resolution
- File system operations

## Technical Specifications

### Command Line Options

- `componentName`: Required. The name of the component to download
- `--registry`: Optional. URL to the custom component registry
  - Default: Built-in registry URL
  - Format: Valid HTTP/HTTPS URL
- `--to-folder`: Optional. Target directory for downloaded components
  - Default: Current directory
  - Supports relative and absolute paths

### Registry Compatibility

Must support the following shadcn-compatible registry features:

1. Registry Structure:

   ```
   /registry
   ├── index.json           # List of all available components
   ├── styles
   │   └── [style]         # Component styles (default, etc.)
   │       └── [name].json # Component source code and metadata
   └── schema.json         # Registry schema definition
   ```

2. Component Registry Schema:

   ```typescript
   interface RegistryItem {
     name: string;
     dependencies?: string[]; // Third-party dependencies
     devDependencies?: string[]; // Development dependencies
     registryDependencies?: string[]; // Internal component dependencies
     files: string[]; // Component file paths
     type: "components:ui" | "components:component" | "components:example";
   }
   ```

3. Component Source Schema:
   ```typescript
   interface ComponentSource {
     name: string;
     dependencies?: string[];
     files: Array<{
       name: string;
       content: string;
     }>;
     type: string;
   }
   ```

### Implementation Requirements

1. Core Functionality:

   - Command parsing and validation
   - HTTP client for registry communication
   - File system operations for component installation
   - AST transformation for component code
   - Source code path resolution

2. Registry Integration:

   - Support for multiple registry endpoints
   - Registry schema validation
   - Component metadata parsing
   - Source code transformation
   - Path resolution and mapping

3. Error Handling:

   - Network connectivity issues
   - Invalid component names
   - Registry unavailability
   - File system permissions
   - Dependency conflicts
   - AST transformation errors

4. Performance & Security:
   - Concurrent downloads for multiple files
   - Progress indicators for long operations
   - Registry SSL verification
   - Content integrity verification
   - Safe file system operations

## Development Guidelines

1. Code Structure:

   - Modular architecture
   - Clear separation of concerns
   - TypeScript for type safety
   - AST transformation utilities
   - Registry client abstraction

2. Dependencies:

   - Core dependencies:
     - commander: CLI framework
     - ts-morph: AST transformation
     - zod: Schema validation
     - node-fetch: HTTP client
     - prompts: Interactive CLI
     - chalk: Terminal styling
     - ora: Loading spinners

3. Testing:

   - Unit tests for core functionality
   - Integration tests for registry communication
   - End-to-end tests for complete workflows
   - Mock registry for testing

4. Documentation:
   - CLI usage documentation
   - Registry API specification
   - Component authoring guide
   - Contributing guidelines
   - Registry schema documentation

## Component Development Guidelines

### 1. Component Requirements

```typescript
interface ComponentRequirements {
  // 组件类型限制
  type: {
    mustBe: "client"; // 必须是 Client Component
    cannotBe: ["server", "async"]; // 不能是 Server Component 或 Async Component
  };

  // 导入导出规范
  imports: {
    // 允许的导入方式
    allowed: [
      "import * as React from 'react'",
      "import { something } from '@/lib/utils'",
      "import styles from './styles.module.css'"
    ];
    // 禁止的导入方式
    forbidden: ["require()", "await import()", "React.lazy()"];
  };

  // 导出规范
  exports: {
    // 必须导出的内容
    required: ["default export", "component type definition"];
    // 命名规范
    naming: {
      component: "PascalCase";
      types: "PascalCase + Props suffix";
      utilities: "camelCase";
    };
  };

  // 样式规范
  styling: {
    // 允许的样式方案
    allowed: ["tailwind classes", "css modules", "css variables"];
    // 禁止的样式方案
    forbidden: ["inline styles", "styled-components", "emotion"];
  };

  // 状态管理
  state: {
    // 允许的状态管理方式
    allowed: ["useState", "useReducer", "props"];
    // 禁止的状态管理方式
    forbidden: ["global state", "context in component"];
  };
}
```

### 2. Component Template Structure

```typescript
interface ComponentTemplate {
  // 必需文件
  required: {
    component: "ComponentName.tsx"; // 组件主文件
    types: "types.ts"; // 类型定义
    styles: "styles.module.css"; // 样式文件（如果需要）
  };

  // 可选文件
  optional: {
    utils: "utils.ts"; // 工具函数
    constants: "constants.ts"; // 常量定义
    hooks: "use-component.ts"; // 自定义 hooks
  };

  // 组件文件结构
  structure: {
    imports: string[]; // 导入声明
    interfaces: string[]; // 类型接口
    component: {
      name: string;
      props: string[];
      implementation: string;
    };
    exports: string[]; // 导出声明
  };
}
```

### 3. Development Workflow

```typescript
interface DevelopmentWorkflow {
  // 开发步骤
  steps: [
    "Create component from template",
    "Implement component logic",
    "Add styles using tailwind",
    "Add types and documentation",
    "Test component",
    "Build and validate",
    "Publish to registry"
  ];

  // 验证步骤
  validation: {
    types: boolean; // 类型检查
    lint: boolean; // 代码风格检查
    test: boolean; // 单元测试
    build: boolean; // 构建检查
  };

  // 发布检查
  publishChecks: {
    typescript: boolean; // TypeScript 检查
    dependencies: boolean; // 依赖检查
    size: boolean; // 包大小检查
    documentation: boolean; // 文档完整性
  };
}
```

## Component Testing Guidelines

### 1. Test Requirements

```typescript
interface TestRequirements {
  // 测试文件结构
  fileStructure: {
    location: string; // "__tests__" 目录
    naming: string; // "[ComponentName].test.tsx"
    helpers: string; // "[ComponentName].helpers.ts"
  };

  // 必需的测试类型
  requiredTests: {
    unit: {
      render: boolean; // 渲染测试
      props: boolean; // 属性测试
      events: boolean; // 事件测试
      states: boolean; // 状态测试
    };
    integration: {
      composition: boolean; // 组件组合测试
      hooks: boolean; // 自定义 hooks 测试
    };
    accessibility: {
      aria: boolean; // ARIA 属性测试
      keyboard: boolean; // 键盘交互测试
      contrast: boolean; // 对比度测试
    };
  };

  // 测试覆盖率要求
  coverage: {
    statements: number; // 语句覆盖率 (>90%)
    branches: number; // 分支覆盖率 (>85%)
    functions: number; // 函数覆盖率 (>90%)
    lines: number; // 行覆盖率 (>90%)
  };
}
```

### 2. Test Specifications

```typescript
interface TestSpecifications {
  // 基础测试套件
  basic: {
    // 渲染测试
    render: {
      defaultProps: boolean; // 默认属性渲染
      allProps: boolean; // 所有属性渲染
      withChildren: boolean; // 子组件渲染
    };

    // 交互测试
    interaction: {
      clicks: boolean; // 点击事件
      keyboard: boolean; // 键盘事件
      focus: boolean; // 焦点事件
      hover: boolean; // 悬停事件
    };
  };

  // 高级测试套件
  advanced: {
    // 性能测试
    performance: {
      renderTime: number; // 渲染时间阈值
      reRenderTime: number; // 重渲染时间阈值
      memoryUsage: number; // 内存使用阈值
    };

    // 状态测试
    state: {
      initialState: boolean; // 初始状态
      stateChanges: boolean; // 状态变更
      sideEffects: boolean; // 副作用
    };

    // 错误处理
    errorHandling: {
      propValidation: boolean; // 属性验证
      errorBoundary: boolean; // 错误边界
      fallback: boolean; // 降级处理
    };
  };

  // 快照测试
  snapshot: {
    enabled: boolean; // 是否启用
    interactive: boolean; // 交互状态快照
    responsive: boolean; // 响应式快照
  };
}
```

### 3. Test Utilities

```typescript
interface TestUtilities {
  // 测试工具库
  libraries: {
    required: [
      "@testing-library/react",
      "@testing-library/jest-dom",
      "@testing-library/user-event"
    ];
    optional: [
      "jest-axe", // 可访问性测试
      "jest-styled-components" // 样式测试
    ];
  };

  // 自定义测试工具
  custom: {
    // 渲染工具
    renders: {
      renderWithTheme: string; // 主题包装器
      renderWithRouter: string; // 路由包装器
      renderWithStore: string; // 状态包装器
    };

    // 测试助手
    helpers: {
      createMockProps: string; // 属性模拟
      createMockContext: string; // 上下文模拟
      createMockEvent: string; // 事件模拟
    };
  };
}
```

## Component Publishing Process

### 1. Pre-publish Checklist

```typescript
interface PublishChecklist {
  // 代码质量检查
  codeQuality: {
    lintPassed: boolean; // ESLint 检查
    typesPassed: boolean; // TypeScript 检查
    testsPassed: boolean; // 单元测试
    coverageReached: boolean; // 测试覆盖率
  };

  // 文档完整性
  documentation: {
    readme: boolean; // README 文件
    api: boolean; // API 文档
    examples: boolean; // 使用示例
    changelog: boolean; // 更新日志
  };

  // 依赖检查
  dependencies: {
    peerDepsCorrect: boolean; // Peer 依赖正确
    versionConflicts: boolean; // 版本冲突检查
    sizeLimit: boolean; // 包大小限制
  };

  // 构建验证
  build: {
    clean: boolean; // 清理构建
    production: boolean; // 生产构建
    types: boolean; // 类型生成
    assets: boolean; // 资源打包
  };
}
```

### 2. Publishing Steps

```typescript
interface PublishingSteps {
  // 版本管理
  versioning: {
    type: "major" | "minor" | "patch";
    changelog: string;
    git: {
      tag: boolean;
      commit: boolean;
    };
  };

  // 构建过程
  build: {
    clean: string[]; // 清理命令
    compile: string[]; // 编译命令
    bundle: string[]; // 打包命令
    types: string[]; // 类型生成
  };

  // 发布流程
  publish: {
    registry: string; // 发布注册表
    access: "public" | "private";
    tag: string; // 发布标签
    distTag: string; // 分发标签
  };

  // 发布后操作
  postPublish: {
    notification: boolean; // 发布通知
    documentation: boolean; // 文档更新
    announcement: boolean; // 版本公告
  };
}
```

### 3. Version Management

```typescript
interface VersionManagement {
  // 版本规则
  rules: {
    major: string[]; // 主版本变更规则
    minor: string[]; // 次版本变更规则
    patch: string[]; // 补丁版本变更规则
  };

  // 预发布版本
  prerelease: {
    alpha: boolean; // 是否支持 alpha
    beta: boolean; // 是否支持 beta
    rc: boolean; // 是否支持 rc
    naming: string; // 版本命名规则
  };

  // 版本锁定
  lock: {
    dependencies: boolean; // 锁定依赖版本
    peerDependencies: boolean; // 锁定 peer 依赖
    engines: boolean; // 锁定 Node 版本
  };
}
```

## Command Specifications

### 1. Init Command

```bash
fetch-ui init [options]
```

#### Options:

- `--cwd <path>`: Working directory (default: current directory)
- `--registry <url>`: Custom registry URL
- `--yes`: Skip all prompts (default: false)
- `--style <name>`: Component style preset (default: 'default')
- `--ts`: Use TypeScript (default: true)
- `--jsx`: Use JSX syntax (default: true)

#### Interactive Prompts:

1. Project Structure:
   ```typescript
   interface ProjectPrompts {
     style: "default" | "minimal" | string;
     typescript: boolean;
     jsx: boolean;
     components: {
       path: string; // Components directory
       prefix: string; // Component prefix
     };
     tailwind: {
       config: string; // Tailwind config path
       css: string; // Global CSS path
       baseColor: string; // Base color theme
     };
   }
   ```

#### Generated Files:

1. Configuration File (fetch-ui.json):
   ```typescript
   interface Config {
     $schema: string;
     style: string;
     typescript: boolean;
     jsx: boolean;
     registry: string;
     components: {
       path: string;
       prefix: string;
     };
     tailwind: {
       config: string;
       css: string;
       baseColor: string;
       cssVariables: boolean;
     };
   }
   ```

### 2. Add Command

```bash
fetch-ui add <component> [options]
fetch-ui add [components...] [options]
```

#### Options:

- `--cwd <path>`: Working directory
- `--registry <url>`: Override registry URL
- `--to <path>`: Target directory for component
- `--force`: Overwrite existing files
- `--dry-run`: Show what would be done
- `--deps`: Install dependencies automatically
- `--style <name>`: Override component style

#### Component Resolution:

1. Registry Query:

   ```typescript
   interface RegistryQuery {
     name: string;
     version?: string;
     style?: string;
     registry?: string;
   }
   ```

2. Component Resolution Tree:

   ```typescript
   interface ResolutionTree {
     name: string;
     version: string;
     dependencies: {
       npm: string[]; // NPM dependencies
       components: {
         // Internal component dependencies
         name: string;
         version: string;
       }[];
     };
     files: {
       path: string; // Target path
       content: string; // File content
       transform: boolean; // Needs transformation
     }[];
   }
   ```

3. File Transformation Rules:
   ```typescript
   interface TransformRule {
     type: "import" | "style" | "jsx" | "tsx";
     pattern: RegExp;
     replace: string | ((match: string) => string);
   }
   ```

### 3. List Command

```bash
fetch-ui list [options]
```

#### Options:

- `--registry <url>`: Custom registry URL
- `--json`: Output as JSON
- `--installed`: Show only installed components
- `--outdated`: Show outdated components

#### Output Format:

1. Component List:
   ```typescript
   interface ComponentList {
     components: {
       name: string;
       description: string;
       version: string;
       installed?: boolean;
       outdated?: boolean;
       dependencies: string[];
     }[];
   }
   ```

### 4. Update Command

```bash
fetch-ui update [component] [options]
```

#### Options:

- `--all`: Update all components
- `--check`: Check for updates only
- `--force`: Force update even if up to date
- `--backup`: Backup existing files

#### Update Process:

1. Update Check:

   ```typescript
   interface UpdateCheck {
     component: string;
     currentVersion: string;
     latestVersion: string;
     hasUpdate: boolean;
     changes: {
       type: "added" | "modified" | "removed";
       path: string;
     }[];
   }
   ```

2. Backup Format:
   ```typescript
   interface Backup {
     timestamp: string;
     component: string;
     version: string;
     files: {
       path: string;
       content: string;
     }[];
   }
   ```

### 5. Registry Command

```bash
fetch-ui registry [action] [options]
```

#### Actions:

1. Add Registry:

   ```bash
   fetch-ui registry add <name> <url>
   ```

2. Remove Registry:

   ```bash
   fetch-ui registry remove <name>
   ```

3. List Registries:

   ```bash
   fetch-ui registry list
   ```

4. Set Default:
   ```bash
   fetch-ui registry default <name>
   ```

#### Registry Configuration:

````typescript
interface RegistryConfig {
  registries: {
    [name: string]: {
      url: string;
      priority: number;
      auth?: {
        type: 'token' | 'basic';
        token?: string;
        username?: string;
        password?: string;
      };
    };
  };
  defaultRegistry: string;
}

## Error Handling

### 1. Error Types
```typescript
type ErrorCode =
  | 'REGISTRY_UNREACHABLE'
  | 'COMPONENT_NOT_FOUND'
  | 'INVALID_COMPONENT'
  | 'DEPENDENCY_ERROR'
  | 'TRANSFORM_ERROR'
  | 'FILE_SYSTEM_ERROR'
  | 'CONFIG_ERROR'
  | 'NETWORK_ERROR';

interface CliError {
  code: ErrorCode;
  message: string;
  details?: unknown;
  suggestion?: string;
}
````

### 2. Error Handling Strategy

1. User Errors:

   - Invalid command usage
   - Missing configuration
   - Invalid component names

2. System Errors:

   - Network failures
   - File system permissions
   - Registry unavailability

3. Transform Errors:
   - AST transformation failures
   - Path resolution errors
   - Dependency conflicts

## Configuration Files

### 1. Global Configuration

Location: `~/.fetch-ui/config.json`

```typescript
interface GlobalConfig {
  registries: RegistryConfig;
  defaults: {
    style: string;
    typescript: boolean;
    jsx: boolean;
  };
  cache: {
    directory: string;
    ttl: number;
  };
}
```

### 2. Project Configuration

Location: `./fetch-ui.json`

```typescript
interface ProjectConfig {
  $schema: string;
  extends?: string;
  style: string;
  typescript: boolean;
  jsx: boolean;
  components: {
    path: string;
    prefix: string;
  };
  registry: {
    url: string;
    auth?: {
      type: string;
      token?: string;
    };
  };
  transform: {
    rules: TransformRule[];
  };
}
```

### 3. Component Configuration

Location: `./components/[component]/fetch-ui.json`

```typescript
interface ComponentConfig {
  name: string;
  version: string;
  registry: string;
  style: string;
  dependencies: {
    npm: string[];
    components: string[];
  };
  files: string[];
  transform: {
    rules: TransformRule[];
  };
}
```

## Registry API Specification

### 1. Component Registry

```typescript
interface RegistryAPI {
  // List all components
  GET /components: {
    components: Component[];
  };

  // Get component details
  GET /components/:name: Component;

  // Get component versions
  GET /components/:name/versions: {
    versions: string[];
  };

  // Get component source
  GET /components/:name/:version: ComponentSource;
}
```

### 2. Style Registry

```typescript
interface StyleAPI {
  // List all styles
  GET /styles: {
    styles: Style[];
  };

  // Get style details
  GET /styles/:name: Style;

  // Get component in style
  GET /styles/:style/:component: ComponentSource;
}
```

## Future Enhancements

1. Registry Features:

   - Component versioning
   - Component previews
   - Custom transformers
   - Registry authentication
   - Component search and filtering

2. CLI Features:
   - Component updates
   - Dependency management
   - Interactive component configuration
   - Component scaffolding
   - Custom templates

## Component Publishing

### 1. Publish Command

```bash
npx fetch-ui publish [component] [options]
```

#### Options:

- `--registry <url>`: Target registry URL
- `--version <version>`: Component version
- `--access <public|private>`: Access level
- `--tag <tag>`: Version tag

#### Publishing Process:

```typescript
interface PublishConfig {
  name: string;
  version: string;
  files: string[];
  dependencies: {
    npm: string[];
    components: string[];
  };
  validation: {
    rules: ValidationRule[];
    tests: TestSpec[];
  };
}
```

## Version Management

### 1. Version Rules

- Follows Semantic Versioning (SemVer)
- Version format: MAJOR.MINOR.PATCH
- Pre-release tags: alpha, beta, rc

### 2. Version Upgrade Strategy

```typescript
interface VersionUpgrade {
  type: "major" | "minor" | "patch";
  changes: {
    breaking: boolean;
    features: string[];
    fixes: string[];
  };
  migration?: {
    from: string;
    to: string;
    steps: string[];
  };
}
```

## Component Validation

### 1. Validation Rules

```typescript
interface ValidationRule {
  type: "structure" | "style" | "typescript" | "dependency";
  check: (component: Component) => Promise<boolean>;
  message: string;
}
```

### 2. Test Specifications

```typescript
interface TestSpec {
  name: string;
  type: "unit" | "integration" | "e2e";
  runner: "jest" | "vitest";
  files: string[];
}
```

## Migration Guide

### 1. From Other Libraries

```typescript
interface MigrationSource {
  type: "shadcn" | "material-ui" | "antd";
  version: string;
  components: {
    source: string;
    target: string;
    transforms: TransformRule[];
  }[];
}
```

### 2. Compatibility Layer

```typescript
interface CompatibilityLayer {
  source: string;
  adapters: {
    [key: string]: (props: any) => JSX.Element;
  };
  styles: {
    [key: string]: string;
  };
}
```

## Dependencies

### 1. Core Dependencies

```json
{
  "dependencies": {
    "tailwindcss": "^3.0.0",
    "typescript": "^5.0.0",
    "ts-morph": "^19.0.0",
    "commander": "^11.0.0",
    "zod": "^3.0.0"
  }
}
```

### 2. Compatibility Matrix

| Library     | Version Range | Status     |
| ----------- | ------------- | ---------- |
| shadcn-ui   | ^0.5.0        | Compatible |
| tailwindcss | ^3.0.0        | Required   |
| React       | ^18.0.0       | Required   |

## Registry API Security

### 1. Authentication

```typescript
interface AuthSpec {
  type: "bearer" | "oauth2" | "apikey";
  endpoints: {
    token: string;
    refresh: string;
    revoke: string;
  };
  scopes: {
    read: string[];
    write: string[];
  };
}
```

### 2. Rate Limiting

```typescript
interface RateLimit {
  window: number; // Time window in seconds
  max: number; // Maximum requests per window
  strategy: "sliding" | "fixed";
  headers: {
    limit: string;
    remaining: string;
    reset: string;
  };
}
```

### 3. Error Responses

```typescript
interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: unknown;
  retryAfter?: number;
}
```

## Implementation Boundaries

### 1. Component Interface

```typescript
interface StandardComponent {
  // 基础信息
  name: string;
  version: string;
  description?: string;

  // 依赖管理
  dependencies: {
    npm: Record<string, string>; // 精确版本
    peer: Record<string, string>; // 版本范围
    optional: Record<string, string>; // 可选依赖
  };

  // 文件结构
  files: Array<{
    path: string;
    content: string;
    type: "source" | "style" | "test" | "doc";
  }>;

  // 元数据
  metadata: {
    author: string;
    license: string;
    tags: string[];
    deprecated?: boolean;
  };
}
```

### 2. Configuration Inheritance

```typescript
interface ConfigInheritance {
  // 继承优先级（从高到低）
  priority: [
    "local", // 本地配置
    "extends", // 继承配置
    "defaults" // 默认配置
  ];

  // 合并策略
  merge: {
    arrays: "concat" | "replace" | "unique";
    objects: "deep" | "shallow" | "replace";
    primitives: "override" | "preserve";
  };

  // 继承限制
  limits: {
    maxDepth: number; // 最大继承深度
    circular: boolean; // 是否允许循环继承
    validate: boolean; // 是否验证继承结果
  };
}
```

### 3. Transform Capabilities

```typescript
interface TransformCapabilities {
  // AST 转换能力
  ast: {
    supported: [
      "imports", // 标准 ES Module 导入
      "exports", // 命名和默认导出
      "jsx-elements", // JSX 元素和属性
      "type-annotations", // TypeScript 类型注解
      "tailwind-classes" // Tailwind 类名处理
    ];

    unsupported: [
      "dynamic-imports", // 动态导入
      "require-calls", // CommonJS 导入
      "server-components" // 服务端组件语法
    ];
  };

  // 代码转换规则
  transformRules: {
    imports: {
      // 路径别名转换
      aliasTransform: {
        from: "@/components/*";
        to: "./components/*";
      };
      // 依赖替换
      dependencyTransform: {
        from: "@radix-ui/*";
        to: "@fetch-ui/core/*";
      };
    };

    // tailwind 类名转换
    tailwind: {
      prefix: string;
      scope: string;
      customClasses: Record<string, string>;
    };
  };

  // 性能限制
  performance: {
    maxFileSize: number; // 单文件大小限制
    timeout: number; // 转换超时时间
    memory: number; // 内存使用限制
  };
}
```

### 4. Compatibility Specification

```typescript
interface CompatibilitySpec {
  shadcn: {
    version: {
      minimum: "0.5.0";
      maximum: "0.8.0";
      tested: ["0.5.0", "0.6.0", "0.7.0"];
    };

    features: {
      supported: ["basic-components", "style-variants", "theme-customization"];

      partial: ["advanced-animations", "complex-layouts"];

      unsupported: ["server-components", "streaming-ssr"];
    };

    limitations: [
      "No support for React Server Components",
      "Limited animation capabilities",
      "No support for dynamic imports in components"
    ];
  };

  dependencies: {
    // 核心依赖
    required: {
      tailwindcss: "^3.3.0 <4.0.0";
      typescript: "^5.0.0 <5.3.0";
      react: "^18.0.0 <19.0.0";
    };

    // 可选依赖
    optional: {
      "@types/react": "*";
    };

    // 不兼容的依赖
    conflicts: {
      tailwindcss: "<3.0.0";
      react: "<17.0.0";
    };
  };
}
```
