export const reviewerProfile = {
  name: 'John Doe',
  role: 'Reviewer',
}

export const statCards = [
  {
    label: 'Pending Reviews',
    value: '04',
    change: '+2 since last hour',
    tone: 'amber',
  },
  {
    label: 'Approved Today',
    value: '18',
    change: '94% acceptance rate',
    tone: 'green',
  },
  {
    label: 'Rejected',
    value: '01',
    change: 'Bias policy catch',
    tone: 'red',
  },
  {
    label: 'Avg. Response',
    value: '200ms',
    change: 'Low-latency workflow',
    tone: 'blue',
  },
]

export const queueSummary = [
  {
    label: 'Active Reviewers',
    value: '12',
    caption: 'Distributed across policy, content, and safety queues.',
  },
  {
    label: 'Open Items',
    value: '23',
    caption: 'Tasks awaiting review or revision follow-up.',
  },
  {
    label: 'Traceability',
    value: '100%',
    caption: 'Every action is written into the audit trail.',
  },
]

export const queueItems = [
  {
    id: 'task-1',
    title: 'Customer Sentiment Analysis',
    source: 'Rubiscape homepage chatbot',
    submittedBy: 'Tejas Shastri',
    type: 'Content',
    status: 'Approved',
    fromStatus: 'Unapproved',
    risk: 'Low',
    model: 'GPT-4.1',
    prompt: 'Give me overview of AI in daily life.',
    preview:
      'The AI response summarizes customer emotion trends from live support chats and recommends clearer retention messaging for at-risk users.',
    editedCopy:
      'Customer sentiment shows increased frustration around checkout latency. Recommend prioritizing payment UX fixes and proactive support guidance.',
    createdAt: 'Apr 05, 2026 - 09:12 IST',
    confidence: '91%',
    policy: 'Customer Experience',
    history: [
      {
        timestamp: '29 Mar 2026, 02:23:45',
        action: 'Status Change',
        from: 'Unapproved',
        to: 'Approved',
      },
      {
        timestamp: '29 Mar 2026, 02:20:10',
        action: 'Edit',
        from: 'Unapproved',
        to: 'Unapproved',
      },
      {
        timestamp: '29 Mar 2026, 02:18:44',
        action: 'Edit',
        from: 'Unapproved',
        to: 'Unapproved',
      },
      {
        timestamp: '29 Mar 2026, 02:15:02',
        action: 'Edit',
        from: 'Pending',
        to: 'Unapproved',
      },
    ],
  },
  {
    id: 'task-2',
    title: 'Regulatory Update Summary',
    source: 'Compliance knowledge assistant',
    submittedBy: 'Aarav Khanna',
    type: 'Summary',
    status: 'Pending',
    fromStatus: 'Unapproved',
    risk: 'High',
    model: 'GPT-4.1 mini',
    prompt: 'Summarize the latest disclosure obligations for finance teams.',
    preview:
      'Draft summary of updated disclosure obligations for financial communications. Human verification is required before legal distribution.',
    editedCopy:
      'Disclosure obligations now require explicit labeling of AI-assisted drafts and documented human approval before circulation.',
    createdAt: 'Apr 05, 2026 - 09:35 IST',
    confidence: '73%',
    policy: 'Compliance',
    history: [
      {
        timestamp: '05 Apr 2026, 09:35:00',
        action: 'Status Change',
        from: 'Unapproved',
        to: 'Pending',
      },
      {
        timestamp: '05 Apr 2026, 09:34:11',
        action: 'Create',
        from: '-',
        to: 'Unapproved',
      },
    ],
  },
  {
    id: 'task-3',
    title: 'Product Launch Copy',
    source: 'Marketing content generator',
    submittedBy: 'Mira Nair',
    type: 'Campaign',
    status: 'Approved',
    fromStatus: 'Pending',
    risk: 'Medium',
    model: 'GPT-4.1',
    prompt: 'Write product launch copy for our analytics workflow.',
    preview:
      'AI-generated launch copy for the new analytics workflow focusing on transparency, speed, and reviewer accountability.',
    editedCopy:
      'Launch the new analytics workflow with faster reviews, clearer approvals, and complete decision traceability.',
    createdAt: 'Apr 04, 2026 - 18:10 IST',
    confidence: '88%',
    policy: 'Brand Voice',
    history: [
      {
        timestamp: '04 Apr 2026, 18:20:12',
        action: 'Status Change',
        from: 'Pending',
        to: 'Approved',
      },
      {
        timestamp: '04 Apr 2026, 18:17:31',
        action: 'Edit',
        from: 'Pending',
        to: 'Pending',
      },
    ],
  },
  {
    id: 'task-4',
    title: 'Claims Validation Report',
    source: 'Internal risk scoring engine',
    submittedBy: 'Sneha Patel',
    type: 'Analysis',
    status: 'Approved',
    fromStatus: 'Pending',
    risk: 'Low',
    model: 'GPT-4o',
    prompt: 'Explain why these claims were flagged for review.',
    preview:
      'The report explains why three low-confidence claims were flagged for human validation prior to downstream recommendation.',
    editedCopy:
      'Three claims fell below confidence thresholds and were routed for manual confirmation before automated action.',
    createdAt: 'Apr 04, 2026 - 15:22 IST',
    confidence: '89%',
    policy: 'Risk Operations',
    history: [
      {
        timestamp: '04 Apr 2026, 15:28:02',
        action: 'Status Change',
        from: 'Pending',
        to: 'Approved',
      },
    ],
  },
  {
    id: 'task-5',
    title: 'Healthcare FAQ Draft',
    source: 'Patient assistance bot',
    submittedBy: 'Riya Menon',
    type: 'Content',
    status: 'Rejected',
    fromStatus: 'Pending',
    risk: 'Critical',
    model: 'GPT-4.1',
    prompt: 'Create an FAQ answer for patient treatment guidance.',
    preview:
      'Draft FAQ response included unsupported medical guidance and was rejected to prevent harmful publication.',
    editedCopy:
      'Removed unsupported treatment recommendation. Escalated to licensed reviewer for corrected patient-safe response.',
    createdAt: 'Apr 04, 2026 - 11:08 IST',
    confidence: '42%',
    policy: 'Safety Critical',
    history: [
      {
        timestamp: '04 Apr 2026, 11:15:48',
        action: 'Status Change',
        from: 'Pending',
        to: 'Rejected',
      },
      {
        timestamp: '04 Apr 2026, 11:13:05',
        action: 'Edit',
        from: 'Pending',
        to: 'Pending',
      },
    ],
  },
]

export const workflowSteps = [
  {
    title: 'Pending',
    copy: 'Fresh AI outputs enter a controlled review queue.',
    tone: 'amber',
  },
  {
    title: 'Approved',
    copy: 'Human reviewers validate content and unlock downstream use.',
    tone: 'green',
  },
  {
    title: 'Needs Revision',
    copy: 'Edits or feedback are captured before rerunning the workflow.',
    tone: 'blue',
  },
  {
    title: 'Rejected',
    copy: 'Unsafe or inaccurate outputs are blocked with audit evidence.',
    tone: 'red',
  },
]

export const auditEvents = [
  {
    id: 'evt-1',
    title: 'Aarav requested revision',
    time: '2 min ago',
    description:
      'Regulatory Update Summary was returned to compliance review due to unsupported citation language.',
  },
  {
    id: 'evt-2',
    title: 'John approved marketing copy',
    time: '14 min ago',
    description:
      'Product Launch Copy moved from Pending to Approved with two wording edits.',
  },
  {
    id: 'evt-3',
    title: 'Safety escalation triggered',
    time: '26 min ago',
    description:
      'Healthcare FAQ Draft was rejected and escalated because it contained medical advice outside policy.',
  },
]

export const adminReviewers = [
  {
    id: 'reviewer-tejas',
    reviewer: 'Tejas Shastri',
    role: 'Reviewer',
    contentReviewed: 10,
    approved: 4,
    edited: 3,
    rejected: 3,
    pending: 1,
    history: [
      {
        id: 'tejas-entry-1',
        timestamp: '29 Mar 2026, 02:23:45',
        action: 'Status Change',
        from: 'Unapproved',
        to: 'Approved',
        aiPrompt: 'Give me overview of AI in daily life.',
        aiOutput:
          'Artificial Intelligence has quietly become part of everyday life, powering features like recommendations, chatbots, and smart devices while helping industries such as healthcare, education, and business work more efficiently. It automates repetitive tasks and enables faster decision-making, allowing humans to focus on more creative work. However, it also raises concerns about privacy, jobs, and ethics, making it important to balance innovation with responsibility as AI continues to grow.',
        currentStatus: 'Pending',
      },
      {
        id: 'tejas-entry-2',
        timestamp: '29 Mar 2026, 02:23:45',
        action: 'Edit',
        from: 'Unapproved',
        to: 'Unapproved',
        aiPrompt: 'Summarize AI adoption in healthcare.',
        aiOutput:
          'Artificial intelligence improves triage, assists diagnostics, and reduces repetitive documentation for care teams while still requiring human supervision.',
        currentStatus: 'Pending',
      },
      {
        id: 'tejas-entry-3',
        timestamp: '29 Mar 2026, 02:23:45',
        action: 'Edit',
        from: 'Unapproved',
        to: 'Unapproved',
        aiPrompt: 'Explain how AI supports business operations.',
        aiOutput:
          'AI helps businesses by forecasting demand, routing support tickets, and generating reports that teams can review before publishing.',
        currentStatus: 'Pending',
      },
      {
        id: 'tejas-entry-4',
        timestamp: '29 Mar 2026, 02:23:45',
        action: 'Edit',
        from: 'Pending',
        to: 'Unapproved',
        aiPrompt: 'Write a short note on ethical AI use.',
        aiOutput:
          'Ethical AI use depends on transparency, fairness, safety checks, and people staying responsible for the final decision.',
        currentStatus: 'Pending',
      },
    ],
  },
  {
    id: 'reviewer-aarav',
    reviewer: 'Aarav Khanna',
    role: 'Reviewer',
    contentReviewed: 6,
    approved: 3,
    edited: 2,
    rejected: 1,
    pending: 2,
    history: [
      {
        id: 'aarav-entry-1',
        timestamp: '05 Apr 2026, 09:35:00',
        action: 'Status Change',
        from: 'Unapproved',
        to: 'Pending',
        aiPrompt: 'Summarize the latest disclosure obligations for finance teams.',
        aiOutput:
          'Disclosure obligations require labeling AI-assisted drafts and documenting human approval before circulation.',
        currentStatus: 'Pending',
      },
    ],
  },
  {
    id: 'reviewer-mira',
    reviewer: 'Mira Nair',
    role: 'Reviewer',
    contentReviewed: 4,
    approved: 2,
    edited: 1,
    rejected: 1,
    pending: 0,
    history: [
      {
        id: 'mira-entry-1',
        timestamp: '04 Apr 2026, 18:20:12',
        action: 'Status Change',
        from: 'Pending',
        to: 'Approved',
        aiPrompt: 'Write product launch copy for our analytics workflow.',
        aiOutput:
          'Launch the new analytics workflow with faster reviews, clearer approvals, and complete decision traceability.',
        currentStatus: 'Approved',
      },
    ],
  },
]
