import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import {
  auditEvents,
  reviewerProfile,
  statCards,
  workflowSteps,
} from './data/mockData'
import { Sidebar } from './components/Sidebar'
import { Navbar } from './components/Navbar'
import { PageHeader } from './components/PageHeader'
import { StatCard } from './components/StatCard'
import { DataTable } from './components/DataTable'
import { Panel } from './components/Panel'
import { Button } from './components/Button'
import { ActivityList } from './components/ActivityList'
import { StatusPill } from './components/StatusPill'

const tableColumns = [
  {
    key: 'task',
    label: 'Task/Source',
    render: (item) => (
      <div>
        <div className="table-title">Review Request</div>
        <div className="table-subtitle">{item._id}</div>
      </div>
    ),
  },
  { key: 'createdAt', label: 'Submitted At', render: (item) => new Date(item.createdAt).toLocaleString() },
  { key: 'type', label: 'Type', render: () => 'LLM Output' },
  {
    key: 'status',
    label: 'Status',
    render: (item) => <StatusPill status={item.status?.type || 'pending'} />,
  },
]

function Dashboard() {
  const [activePage, setActivePage] = useState('overview')
  const [tasks, setTasks] = useState([])
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [history, setHistory] = useState([])
  const [reviewView, setReviewView] = useState('review')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchLogs = async (taskId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`/api/reviews/${taskId}/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHistory(response.data)
    } catch (err) {
      console.error('Failed to fetch logs:', err)
    }
  }

  useEffect(() => {
    if (selectedTaskId && reviewView === 'history') {
      fetchLogs(selectedTaskId)
    }
  }, [selectedTaskId, reviewView])

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/reviews', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTasks(response.data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskSelect = async (taskId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/reviews/${taskId}/lock`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSelectedTaskId(taskId)
      setReviewView('review')
      setActivePage('review')
    } catch (err) {
      console.error('Failed to lock task:', err)
    }
  }

  const handleSubmitDecision = async (decision) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/reviews/${selectedTaskId}/submit`, { 
        decision, 
        comment: `${decision.charAt(0).toUpperCase() + decision.slice(1)} by reviewer` 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Refresh tasks and return to overview
      fetchTasks()
      setActivePage('overview')
      setSelectedTaskId(null)
    } catch (err) {
      console.error('Failed to submit decision:', err)
    }
  }

  const selectedTask = tasks.find((item) => item._id === selectedTaskId)

  const navItems = useMemo(() => [
    { id: 'overview', label: 'All My Tasks', count: tasks.length, accent: 'blue' },
    { id: 'pending', label: 'Pending', count: tasks.filter(t => !t.status?.type).length, accent: 'amber' },
    { id: 'completed', label: 'Approved', count: tasks.filter(t => t.status?.type === 'approved').length, accent: 'green' },
    { id: 'rejected', label: 'Rejected', count: tasks.filter(t => t.status?.type === 'rejected').length, accent: 'red' },
  ], [tasks])

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return tasks.filter((item) => {
      const matchesPage =
        activePage === 'overview'
          ? true
          : activePage === 'completed'
            ? item.status?.type === 'approved'
            : item.status?.type === activePage || (!item.status?.type && activePage === 'pending')
      
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${item._id} ${item.aiPrompt}`
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesPage && matchesQuery
    })
  }, [activePage, query, tasks])

  return (
    <div className="app-shell">
      <Sidebar
        brand="Rubiscape"
        navItems={navItems}
        secondaryItems={[]}
        activeItem={activePage}
        onItemSelect={setActivePage}
      />

      <main className="app-main">
        <Navbar
          reviewer={reviewerProfile}
          searchValue={query}
          onSearchChange={setQuery}
        />

        <div className="app-content">
          {activePage === 'overview' && (
            <OverviewPage
              items={filteredItems}
              onTaskSelect={handleTaskSelect}
              selectedTask={selectedTask}
            />
          )}

          {activePage === 'pending' && (
            <QueuePage
              title="Pending Review Queue"
              description="Items waiting for human approval, rejection, or revision."
              items={filteredItems}
              onTaskSelect={handleTaskSelect}
            />
          )}

          {activePage === 'completed' && (
            <QueuePage
              title="Completed Reviews"
              description="Recently resolved items with final reviewer decisions."
              items={filteredItems}
              onTaskSelect={handleTaskSelect}
            />
          )}

          {activePage === 'rejected' && (
            <QueuePage
              title="Rejected Outputs"
              description="AI outputs that were blocked and sent back for correction."
              items={filteredItems}
              onTaskSelect={handleTaskSelect}
            />
          )}

          {activePage === 'review' && (
            <ReviewDetailPage
              task={selectedTask}
              history={history}
              reviewView={reviewView}
              onReviewViewChange={setReviewView}
              onBack={() => setActivePage('overview')}
              onSubmit={handleSubmitDecision}
            />
          )}
          {activePage === 'audit' && <AuditPage />}
          {activePage === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  )
}

function OverviewPage({ items, onTaskSelect, selectedTask }) {
  return (
    <section className="page-section">
      <PageHeader
        eyebrow="Queue"
        title="Reviewer Command Center"
        description="Monitor AI content flow, triage risky outputs, and keep every decision fully auditable."
      />

      <div className="stats-grid">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <Panel
        title="Stats"
        subtitle="Live review queue modeled after your reference screen."
      >
        <DataTable
          columns={tableColumns}
          rows={items}
          onRowClick={(row) => onTaskSelect(row._id)}
        />
      </Panel>
    </section>
  )
}

function QueuePage({ title, description, items, onTaskSelect }) {
  return (
    <section className="page-section">
      <PageHeader
        eyebrow="Tasks"
        title={title}
        description={description}
        actions={
          <>
            <Button variant="ghost">Filter</Button>
          </>
        }
      />

      <Panel title="Review Items" subtitle={`${items.length} results`}>
        <DataTable
          columns={tableColumns}
          rows={items}
          onRowClick={(row) => onTaskSelect(row._id)}
        />
      </Panel>
    </section>
  )
}

function ReviewDetailPage({
  task,
  history,
  reviewView,
  onReviewViewChange,
  onBack,
  onSubmit,
}) {
  if (!task) return <div>No task selected</div>;

  const historyColumns = [
    { key: 'createdAt', label: 'Timestamp', render: (row) => new Date(row.createdAt).toLocaleString() },
    { key: 'action', label: 'Action' },
    { key: 'performedBy', label: 'Performed By' },
    { key: 'comment', label: 'Comment' },
  ]

  return (
    <div className="review-screen">
      <aside className="review-rail">
        <button className="back-circle" type="button" onClick={onBack}>
          {'<-'}
        </button>

        <div className="review-rail__actions">
          <button
            className={`review-mode-button ${
              reviewView === 'review' ? 'is-active' : ''
            }`}
            type="button"
            onClick={() => onReviewViewChange('review')}
          >
            Review
          </button>
          <button
            className={`review-mode-button ${
              reviewView === 'history' ? 'is-active' : ''
            }`}
            type="button"
            onClick={() => onReviewViewChange('history')}
          >
            History
          </button>
        </div>
      </aside>

      <section className="review-stage">
        {reviewView === 'review' ? (
          <div className="review-card review-card--plain">
            {task.status?.comment && (
              <div className="review-block admin-feedback">
                <label className="review-label">Admin Feedback:</label>
                <div className="review-bubble review-bubble--admin">{task.status.comment}</div>
              </div>
            )}

            <div className="review-block">
              <label className="review-label">Prompt:</label>
              <div className="review-bubble review-bubble--prompt">{task.aiPrompt}</div>
            </div>

            <div className="review-block">
              <label className="review-label">Answer:</label>
              <div className="review-bubble review-bubble--answer">{task.aiOutput}</div>
            </div>

            <div className="review-block">
              <label className="review-label">Actions:</label>
              <div className="review-actions">
                <Button variant="danger" onClick={() => onSubmit('rejected')}>Reject</Button>
                <Button variant="warning" onClick={() => onSubmit('needs_review')}>Mark As Review</Button>
                <Button variant="success" onClick={() => onSubmit('approved')}>Approve</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="history-shell">
            <div className="history-card">
              <div className="history-title">History Logs</div>
              <div className="history-owner">
                <span className="history-owner__dot"></span>
                <span>Traceability Trace</span>
              </div>
              <div className="history-table-shell">
                <DataTable columns={historyColumns} rows={Array.isArray(history) ? history : []} />
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function AuditPage() {
  return (
    <section className="page-section">
      <PageHeader
        eyebrow="Audit"
        title="Decision Traceability"
        description="Every reviewer action, timestamp, and content change stays visible for compliance and debugging."
        actions={
          <>
            <Button variant="ghost">Download CSV</Button>
            <Button>Open Report</Button>
          </>
        }
      />

      <div className="audit-layout">
        <Panel title="Recent Activity" subtitle="Latest reviewer events">
          <ActivityList items={auditEvents} />
        </Panel>
        <Panel title="SLA Snapshot" subtitle="Operational health">
          <div className="sla-stack">
            <div className="sla-card">
              <span>Median response</span>
              <strong>00:11:42</strong>
            </div>
            <div className="sla-card">
              <span>Escalation rate</span>
              <strong>3.1%</strong>
            </div>
            <div className="sla-card">
              <span>Audit coverage</span>
              <strong>100%</strong>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  )
}

function SettingsPage() {
  return (
    <section className="page-section">
      <PageHeader
        eyebrow="Admin"
        title="Workspace Settings"
        description="Control reviewer thresholds, workflow defaults, and notification preferences."
        actions={<Button>Save Changes</Button>}
      />

      <div className="settings-grid">
        <Panel title="Review Rules" subtitle="Core workflow controls">
          <div className="settings-list">
            <SettingRow
              label="Auto-expire stale pending reviews"
              value="After 48 hours"
            />
            <SettingRow
              label="High-risk items require dual approval"
              value="Enabled"
            />
            <SettingRow label="Default reviewer queue" value="Fraud & Safety" />
          </div>
        </Panel>

        <Panel title="Notifications" subtitle="Team coordination">
          <div className="settings-list">
            <SettingRow label="Slack alerts" value="#rubiscape-review" />
            <SettingRow label="Escalation email" value="ops@rubiscape.ai" />
            <SettingRow label="Latency threshold" value="200ms target" />
          </div>
        </Panel>
      </div>
    </section>
  )
}

function SettingRow({ label, value }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default Dashboard