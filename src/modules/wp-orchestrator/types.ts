export type AgentId = "architect" | "designer" | "content" | "tech" | "builder" | "qa";

export type StepStatus = "draft" | "needs-confirmation" | "approved" | "running" | "completed" | "blocked";

export type ActionStatus = "queued" | "running" | "completed" | "failed";
export type RiskLevel = "low" | "medium" | "high";
export type FlowState = "empty" | "briefing" | "planning" | "review" | "building" | "qa" | "completed";
export type TimelineStatus = "waiting" | "running" | "needs_confirmation" | "completed";

export type DecisionAction =
  | "accept"
  | "revise"
  | "add_step"
  | "remove_plugin"
  | "add_plugin"
  | "mark_optional";

export type ActionType =
  | "wp_cli"
  | "rest_create"
  | "rest_update"
  | "theme_config"
  | "plugin_config"
  | "qa_check";

export interface WpAgent {
  id: AgentId;
  name: string;
  role: string;
  summary: string;
}

export interface WpPlanStep {
  id: string;
  title: string;
  agentId: AgentId;
  status: StepStatus;
  summary: string;
  output: string[];
}

export interface TimelineStep {
  id: "brief" | "plan" | "design" | "content" | "plugins" | "build" | "qa" | "result";
  label: string;
  status: TimelineStatus;
  agentId?: AgentId;
}

export interface WpAction {
  id: string;
  stepId: string;
  agentId: AgentId;
  type: ActionType;
  target: string;
  command: string;
  status: ActionStatus;
  durationMs: number;
  result: string;
  createdAt: string;
  payload: Record<string, string | number | boolean | string[]>;
  requiresConfirmation: boolean;
  riskLevel: RiskLevel;
  rollbackHint: string;
  logs: string[];
}

export interface QaCheck {
  id: string;
  label: string;
  status: "pending" | "passed" | "warning";
  detail: string;
}

export interface OrchestratorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface DecisionCard {
  id: string;
  title: string;
  description: string;
  action: DecisionAction;
  status: "open" | "accepted" | "dismissed";
  targetStepId?: string;
  pluginSlug?: string;
  createdAt: string;
}

export interface SitePreviewPage {
  id: string;
  title: string;
  slug: string;
  status: "planned" | "created" | "verified";
  sections: string[];
  cta: string;
}

export interface SitePreview {
  theme: string;
  homepage: string;
  navigation: string[];
  pages: SitePreviewPage[];
  plugins: Array<{
    slug: string;
    name: string;
    purpose: string;
    status: "planned" | "active" | "optional";
  }>;
  nextBackendContract: string[];
}

export interface WpOrchestratorSettings {
  localUrl: string;
  wpCliPath: string;
  preferredTheme: string;
  pluginPolicy: "minimal" | "balanced" | "feature-rich";
  confirmationMode: "all" | "risky" | "none";
}

export interface WpOrchestratorWorkspace {
  flowState: FlowState;
  projectTemplateId: string;
  projectName: string;
  brief: string;
  industry: string;
  targetAudience: string;
  siteGoal: string;
  progress: number;
  runState: "idle" | "planning" | "ready" | "running" | "completed";
  timeline: TimelineStep[];
  steps: WpPlanStep[];
  actions: WpAction[];
  qaChecks: QaCheck[];
  messages: OrchestratorMessage[];
  decisionCards: DecisionCard[];
  sitePreview: SitePreview;
  settings: WpOrchestratorSettings;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  industry: string;
  targetAudience: string;
  siteGoal: string;
  brief: string;
  pages: string[];
  plugins: Array<{
    slug: string;
    name: string;
    purpose: string;
  }>;
  cta: string;
  tone: string;
}
