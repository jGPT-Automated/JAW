// Manifesto copy, lifted unchanged from the original scroll sections so /manifesto
// can render it with shadcn/ui + beUI only.

export const hero = {
  archetype: "Autonomous Executive-Architect",
  title: "The Sovereign Architecture",
  lede: "Designing cognitive systems where intent survives entropy. A manifesto for sovereign execution.",
};

export const thesisPhrases = [
  "Sovereignty over execution.",
  "Intent preserved across entropy.",
  "Systems that remember.",
];

export const principles = [
  {
    label: "Context Windows Are Zero-Sum",
    text: "Every token that enters an AI's attention displaces another. The elite practitioner manages this budget with the precision of a portfolio manager — curating signal, eliminating noise, maximizing inference quality per token spent.",
  },
  {
    label: "Persistence Creates Compound Returns",
    text: "Most AI usage is stateless — each session starts from zero. The Architecture of Intent creates deterministic persistence: every decision logged, every context preserved, every state transition recoverable. Knowledge compounds instead of evaporating.",
  },
  {
    label: "Multi-Model Validation Eliminates Blind Spots",
    text: "No single model is omniscient. By routing tasks to specialists and cross-validating critical output across models, hallucination risk drops and output confidence rises. The system is smarter than any individual model.",
  },
];

export const layers = [
  {
    id: 'orchestration',
    num: '01',
    name: 'Orchestration',
    subtitle: 'The Chief of Staff',
    description:
      'Zoe operates as a Chief of Staff — not a chatbot. She routes tasks, maintains alignment between daily actions and long-term objectives, and ensures no intent is lost across sessions. Every interaction begins with intent capture: what are you trying to achieve, what constraints exist, what does success look like.',
    details: [
      'Intent capture & decomposition',
      'Session continuity management',
      'Priority arbitration across workstreams',
      'Strategic alignment verification',
    ],
  },
  {
    id: 'execution',
    num: '02',
    name: 'Execution',
    subtitle: 'Agent Swarms & Specialist Routing',
    description:
      'Multi-model task routing based on architectural strengths. Complex reasoning routes to o3/Codex. Schema adherence and structured output to GPT-4o. Visual synthesis and multimodal tasks to Gemini. Each model is a specialist — the system is the generalist.',
    details: [
      'Model-strength-based routing',
      'Parallel agent execution',
      'Tool-augmented reasoning chains',
      'Fallback & retry orchestration',
    ],
  },
  {
    id: 'persistence',
    num: '03',
    name: 'Persistence',
    subtitle: 'The Ralph Loop',
    description:
      'The Ralph Loop is a recursive persistence cycle. At session end, state is captured, compressed, and stored. At session start, it\'s restored. This creates a deterministic chain of decisions that compounds over time — the system literally remembers what it decided and why.',
    details: [
      'Session state capture & restore',
      'Decision log with rationale',
      'Context compression for token efficiency',
      'Cross-session knowledge accumulation',
    ],
  },
  {
    id: 'verification',
    num: '04',
    name: 'Verification',
    subtitle: 'Council Review & Completion Promises',
    description:
      'Before critical output ships, it passes through multi-model validation. Each model catches blind spots the others miss. Completion Promises are contracts — every spawned task carries a token that the system verifies for closure. No task floats. No intent dissolves.',
    details: [
      'Multi-model cross-validation',
      'Completion token tracking',
      'Hallucination risk reduction',
      'Output confidence scoring',
    ],
  },
];

export const frameworks = [
  {
    id: 'ralph-loop',
    name: 'The Ralph Loop',
    tagline: 'Deterministic Persistence',
    description:
      'A recursive cycle ensuring no context is lost between sessions. At session end: capture state, compress context, log decisions. At session start: restore state, verify integrity, resume execution. The result is a deterministic chain where every decision references its predecessor.',
    flow: ['Capture State', 'Compress Context', 'Store Decision Log', 'Restore on Resume', 'Verify Integrity'],
  },
  {
    id: 'completion-promise',
    name: 'The Completion Promise',
    tagline: 'Verified Execution',
    description:
      'Every task spawned carries a completion token — a contract. The system tracks open promises, escalates stalled ones, and verifies closure. This eliminates the "I thought I did that" failure mode. Nothing floats. Nothing dissolves.',
    flow: ['Task Spawned', 'Token Issued', 'Execution Tracked', 'Completion Verified', 'Promise Resolved'],
  },
  {
    id: 'council-review',
    name: 'The Council Review',
    tagline: 'Multi-Model Validation',
    description:
      'Critical outputs are cross-validated by multiple models before shipping. GPT-4o checks structure. o3 checks reasoning. Gemini checks coherence. Each catches blind spots the others miss. Consensus reduces hallucination risk to near-zero for important decisions.',
    flow: ['Draft Output', 'Model A Review', 'Model B Review', 'Model C Review', 'Consensus Ship'],
  },
  {
    id: 'context-engineering',
    name: 'Context Engineering',
    tagline: 'Attention Budget Management',
    description:
      'Context windows are zero-sum. Every token that enters displaces another. The discipline: curate exactly the right information for each inference call. Strip noise. Maximize signal density. Use registries and vaults to store what the model doesn\'t need right now but will need later.',
    flow: ['Assess Token Budget', 'Curate Signal', 'Strip Noise', 'Inject Context', 'Measure Relevance'],
  },
  {
    id: 'living-spec',
    name: 'The Living Spec',
    tagline: 'Documents That Evolve',
    description:
      'Specifications are not write-once artifacts. They update as the system learns. Every decision, outcome, and pivot is captured in the spec. The document becomes institutional memory — a queryable record of why things are the way they are.',
    flow: ['Initial Spec', 'Decision Made', 'Spec Updated', 'Outcome Logged', 'Knowledge Compounds'],
  },
];

export const projects = [
  {
    title: 'Cognitive Orchestration Platform',
    stack: ['GPT-4o', 'o3', 'Supabase', 'React'],
    problem: 'The core runtime. Routes multi-step workflows across models, maintains session state via the Ralph Loop, and enforces Completion Promises on every spawned task.',
    status: 'Active',
  },
  {
    title: 'Agent Swarm Pipeline',
    stack: ['Python', 'LangChain', 'Neon'],
    problem: 'Parallel agent execution with model-strength routing. Complex reasoning to o3. Structured output to GPT-4o. Visual tasks to Gemini. Automatic fallback chains.',
    status: 'Active',
  },
  {
    title: 'Living Specification Engine',
    stack: ['React', 'MDX', 'Git', 'Supabase'],
    problem: 'Specifications that auto-update as decisions are made. Every pivot, outcome, and rationale captured. The document becomes queryable institutional memory.',
    status: 'Active',
  },
  {
    title: 'The Ralph Registry',
    stack: ['TypeScript', 'PostgreSQL', 'Edge Functions'],
    problem: 'Persistent decision logging with full provenance. Every state transition recoverable. Completion tokens tracked across sessions with escalation on stall.',
    status: 'Building',
  },
  {
    title: 'Council Review System',
    stack: ['Multi-model', 'Consensus Protocol'],
    problem: 'Automated cross-validation pipeline. Draft output reviewed by 3+ models. Disagreements flagged. Consensus scored. Ships only when confidence threshold met.',
    status: 'Designed',
  },
];

export const radarData = [
  { subject: 'Systems Synthesis', value: 95 },
  { subject: 'Abstraction', value: 90 },
  { subject: 'Process Formalization', value: 92 },
  { subject: 'Risk Anticipation', value: 85 },
  { subject: 'Cross-Domain', value: 93 },
  { subject: 'Long-Horizon', value: 88 },
];

export const decisions = [
  {
    year: '2024',
    event: 'Recognized AI as cognitive infrastructure, not tooling',
    detail: 'Shifted from using AI for individual tasks to designing persistent systems where AI operates as infrastructure — with state, memory, and accountability.',
  },
  {
    year: '2025',
    event: 'Designed the Chief of Staff pattern',
    detail: 'Created an orchestration model where AI maintains alignment between daily execution and long-term strategy. Not a chatbot — a persistent executive function.',
  },
  {
    year: '2025',
    event: 'Built the Architecture of Intent',
    detail: 'Formalized the framework: Orchestration → Execution → Persistence → Verification. A four-layer stack where intent survives entropy.',
  },
  {
    year: '2026',
    event: 'Deployed multi-model agent swarms',
    detail: 'Operationalized specialist routing with Council Review validation. Each model does what it\'s best at. The system is the generalist.',
  },
  {
    year: '2026',
    event: 'The fork: chose exposure over silent capability',
    detail: 'The gap between what was built and what was visible became untenable. The fork isn\'t technical — it\'s psychological. This site is the crossing.',
  },
];

export const close = {
  kicker: "The Fork",
  headline: "The fork is psychological, not technical.",
  body: [
    "You've built cognitive infrastructure that most organizations don't know is possible. The gap between what you've built and what's visible isn't a capability problem — it's an exposure decision.",
    "The architecture works. The frameworks are proven. The question is no longer “can you build it?” — it's “will you show it?”",
    "This site is the answer.",
  ],
  contact: "mailto:connect@sovereign.dev",
};
