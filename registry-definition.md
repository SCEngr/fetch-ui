# Fetch UI Registry Definition

## 1. Data Structure Definitions

### 1.1 Component Definition

```typescript
interface Component {
  // Basic Information
  name: string;                 // Component name
  version: string;             // Component version
  description: string;         // Component description
  author: string;             // Author
  license: string;            // License
  
  // Component Metadata
  metadata: {
    tags: string[];           // Tags
    category: string;         // Category
    framework: string;        // Framework
    compatibility: string[];  // Compatibility requirements
    created: string;         // Creation time
    updated: string;         // Update time
  };
  
  // Dependency Information
  dependencies: {
    required: Dependency[];   // Required dependencies
    optional: Dependency[];   // Optional dependencies
    peer: Dependency[];      // Peer dependencies
  };
  
  // Resource Information
  resources: {
    source: string;          // Source code path
    dist: string;           // Distribution path
    styles: string[];       // Style files
    assets: string[];       // Asset files
    docs: string;          // Documentation path
  };
  
  // Configuration Information
  config: {
    props: PropDefinition[];  // Property definitions
    slots: SlotDefinition[];  // Slot definitions
    events: EventDefinition[];// Event definitions
    styles: StyleDefinition[];// Style definitions
  };
}

interface Dependency {
  name: string;              // Dependency name
  version: string;           // Version requirement
  type: DependencyType;      // Dependency type
}

type DependencyType = 'component' | 'package' | 'plugin';

interface PropDefinition {
  name: string;              // Property name
  type: string;             // Type
  required: boolean;        // Is required
  default?: any;           // Default value
  description: string;      // Description
  validator?: string;      // Validation function
}

interface SlotDefinition {
  name: string;             // Slot name
  description: string;      // Description
  props?: PropDefinition[]; // Slot properties
}

interface EventDefinition {
  name: string;             // Event name
  description: string;      // Description
  payload?: any;           // Event payload type
}

interface StyleDefinition {
  name: string;             // Style name
  type: string;            // Type
  default?: string;        // Default value
  description: string;     // Description
}
```

### 1.2 Registry Definition

```typescript
interface Registry {
  // Basic Information
  id: string;               // Registry ID
  name: string;            // Registry name
  url: string;             // Registry URL
  type: RegistryType;      // Registry type
  
  // Authentication Information
  auth: {
    type: AuthType;        // Authentication type
    token?: string;        // Access token
    username?: string;     // Username
    password?: string;     // Password
  };
  
  // Configuration Information
  config: {
    timeout: number;       // Timeout duration
    retries: number;       // Retry count
    cache: CacheConfig;    // Cache configuration
    proxy?: string;        // Proxy settings
  };
  
  // Status Information
  status: {
    isActive: boolean;     // Is active
    lastSync: string;      // Last sync time
    health: HealthStatus;  // Health status
  };
}

type RegistryType = 'npm' | 'git' | 'local' | 'custom';
type AuthType = 'none' | 'token' | 'basic' | 'oauth';
type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

interface CacheConfig {
  enabled: boolean;        // Enable cache
  ttl: number;            // Time to live
  maxSize: number;        // Maximum cache size
  strategy: CacheStrategy;// Cache strategy
}

type CacheStrategy = 'lru' | 'fifo' | 'lfu';
```

## 2. Interface Definitions

### 2.1 Registry Management Interface

```typescript
interface RegistryManager {
  // Registry Management
  addRegistry(registry: Registry): Promise<void>;
  removeRegistry(id: string): Promise<void>;
  updateRegistry(id: string, config: Partial<Registry>): Promise<void>;
  getRegistry(id: string): Promise<Registry>;
  listRegistries(): Promise<Registry[]>;
  
  // Registry Status
  checkHealth(id: string): Promise<HealthStatus>;
  syncRegistry(id: string): Promise<void>;
  clearCache(id: string): Promise<void>;
  
  // Default Registry
  setDefaultRegistry(id: string): Promise<void>;
  getDefaultRegistry(): Promise<Registry>;
}
```

### 2.2 Component Management Interface

```typescript
interface ComponentManager {
  // Component Query
  searchComponents(query: ComponentQuery): Promise<Component[]>;
  getComponent(name: string, version?: string): Promise<Component>;
  listComponents(filter?: ComponentFilter): Promise<Component[]>;
  
  // Component Validation
  validateComponent(component: Component): Promise<ValidationResult>;
  checkCompatibility(component: Component): Promise<CompatibilityResult>;
  verifyIntegrity(component: Component): Promise<IntegrityResult>;
  
  // Component Operations
  installComponent(name: string, version?: string): Promise<void>;
  uninstallComponent(name: string): Promise<void>;
  updateComponent(name: string, version?: string): Promise<void>;
  
  // Dependency Management
  resolveDependencies(component: Component): Promise<Dependency[]>;
  validateDependencies(deps: Dependency[]): Promise<ValidationResult>;
  installDependencies(deps: Dependency[]): Promise<void>;
}

interface ComponentQuery {
  keyword?: string;        // Keyword search
  tags?: string[];         // Tag filter
  category?: string;       // Category filter
  framework?: string;      // Framework filter
  author?: string;         // Author filter
  limit?: number;          // Result limit
  offset?: number;         // Page offset
}

interface ComponentFilter {
  installed?: boolean;     // Is installed
  outdated?: boolean;      // Is outdated
  hasUpdates?: boolean;    // Has updates
  type?: string[];         // Component types
}

interface ValidationResult {
  valid: boolean;          // Is valid
  errors: ValidationError[];// Validation errors
  warnings: ValidationWarning[];// Validation warnings
}

interface CompatibilityResult {
  compatible: boolean;     // Is compatible
  issues: CompatibilityIssue[];// Compatibility issues
  suggestions: string[];   // Suggestions
}

interface IntegrityResult {
  valid: boolean;          // Is valid
  missing: string[];       // Missing files
  corrupted: string[];     // Corrupted files
}
```

### 2.3 Security Interface

```typescript
interface SecurityManager {
  // Authentication Management
  authenticate(registry: Registry): Promise<void>;
  refreshToken(registry: Registry): Promise<void>;
  revokeToken(registry: Registry): Promise<void>;
  
  // Permission Control
  checkPermission(operation: Operation): Promise<boolean>;
  validateAccess(component: Component): Promise<boolean>;
  
  // Security Check
  scanComponent(component: Component): Promise<SecurityScanResult>;
  validateChecksum(component: Component): Promise<boolean>;
  verifySignature(component: Component): Promise<boolean>;
}

interface SecurityScanResult {
  safe: boolean;           // Is safe
  vulnerabilities: Vulnerability[];// Vulnerabilities
  recommendations: string[];// Security recommendations
}

interface Vulnerability {
  id: string;              // Vulnerability ID
  severity: VulnerabilitySeverity;// Severity level
  description: string;     // Vulnerability description
  solution?: string;       // Solution
}

type VulnerabilitySeverity = 'low' | 'medium' | 'high' | 'critical';
```

## 3. Error Handling

```typescript
// Registry Errors
class RegistryError extends Error {
  constructor(
    message: string,
    public code: RegistryErrorCode,
    public registry: Registry
  ) {
    super(message);
  }
}

enum RegistryErrorCode {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  COMPONENT_NOT_FOUND = 'COMPONENT_NOT_FOUND',
  VERSION_NOT_FOUND = 'VERSION_NOT_FOUND',
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CACHE_ERROR = 'CACHE_ERROR',
  INTEGRITY_CHECK_FAILED = 'INTEGRITY_CHECK_FAILED'
}

// Component Errors
class ComponentError extends Error {
  constructor(
    message: string,
    public code: ComponentErrorCode,
    public component: Component
  ) {
    super(message);
  }
}

enum ComponentErrorCode {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  DEPENDENCY_RESOLUTION_FAILED = 'DEPENDENCY_RESOLUTION_FAILED',
  INSTALLATION_FAILED = 'INSTALLATION_FAILED',
  COMPATIBILITY_CHECK_FAILED = 'COMPATIBILITY_CHECK_FAILED',
  SECURITY_CHECK_FAILED = 'SECURITY_CHECK_FAILED',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND'
}
