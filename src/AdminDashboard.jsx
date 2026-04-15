import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import { reviewerProfile } from './data/mockData'
import { AdminHeader } from './components/AdminHeader'
import { AdminSidebar } from './components/AdminSidebar'
import { Button } from './components/Button'
import { DataTable } from './components/DataTable'
import { InfoPair } from './components/InfoPair'
import { StatusPill } from './components/StatusPill'

const queueItems = [
  { id: 'all', label: 'All Users', accent: 'blue' },
  { id: 'approved', label: 'Approved', accent: 'green' },
  { id: 'rejected', label: 'Rejected', accent: 'red' },
  { id: 'pending', label: 'Pending', accent: 'amber' },
]

const toolItems = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
  { id: 'help', label: 'Help' },
]

const reviewerColumns = [
  { key: 'name', label: 'Reviewer' },
  { key: 'total', label: 'Content Reviewed', render: (row) => row.approved + row.rejected + row.pending },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'pending', label: 'Pending' },
]

const historyColumns = [
  { key: 'updatedAt', label: 'Timestamp', render: (row) => new Date(row.status?.updatedAt || row.createdAt).toLocaleString() },
  { key: 'type', label: 'Status', render: (row) => <StatusPill status={row.status?.type || 'pending'} /> },
  {
    key: 'aiPrompt',
    label: 'AI Prompt',
    render: (row) => <TruncatedCell value={row.aiPrompt} />,
  },
  {
    key: 'aiOutput',
    label: 'AI Output',
    render: (row) => <TruncatedCell value={row.aiOutput} />,
  },
]

function AdminDashboard() {
  const [searchValue, setSearchValue] = useState('')
  const [activeQueue, setActiveQueue] = useState('all')
  const [activeTool, setActiveTool] = useState('')
  const [screen, setScreen] = useState('overview')
  
  const [reviewers, setReviewers] = useState([])
  const [selectedReviewerId, setSelectedReviewerId] = useState(null)
  const [reviewerHistory, setReviewerHistory] = useState({ approved: [], rejected: [], pending: [] })
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch stats on mount
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReviewers(response.data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const selectedReviewer = reviewers.find((r) => r.reviewerId === selectedReviewerId)

  const dynamicQueueItems = useMemo(() => {
    return queueItems.map(item => {
      let count = 0;
      if (item.id === 'all') count = reviewers.length;
      if (item.id === 'approved') count = reviewers.filter(r => r.approved > 0).length;
      if (item.id === 'rejected') count = reviewers.filter(r => r.rejected > 0).length;
      if (item.id === 'pending') count = reviewers.filter(r => r.pending > 0).length;
      return { ...item, count };
    });
  }, [reviewers]);

  const filteredReviewers = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase()

    return reviewers.filter((reviewer) => {
      const matchesQueue =
        activeQueue === 'all'
          ? true
          : activeQueue === 'approved'
            ? reviewer.approved > 0
            : activeQueue === 'rejected'
              ? reviewer.rejected > 0
              : reviewer.pending > 0

      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${reviewer.name} ${reviewer.email}`
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesQueue && matchesQuery
    })
  }, [activeQueue, searchValue, reviewers])

  const handleQueueSelect = (itemId) => {
    setActiveQueue(itemId)
    setActiveTool('')
    setScreen('overview')
  }

  const handleToolSelect = (itemId) => {
    setActiveTool(itemId)
  }

  const fetchReviewerDetails = async (reviewerId) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`/api/admin/${reviewerId}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReviewerHistory(response.data)
    } catch (err) {
      console.error('Failed to fetch details:', err)
    } finally {
      setLoading(false)
    }
  }

  const openReviewerHistory = (reviewerId) => {
    setSelectedReviewerId(reviewerId)
    fetchReviewerDetails(reviewerId)
    setScreen('history')
  }

  const openRecordDetail = (record) => {
    setSelectedRecord(record)
    setScreen('detail')
  }

  const handleReassign = async (reviewId, reviewerId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/admin/${reviewId}/reassign`, { reviewerId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchStats()
      if (selectedReviewerId) fetchReviewerDetails(selectedReviewerId)
      setScreen('history')
    } catch (err) {
      console.error('Failed to reassign:', err)
    }
  }

  const handleAdminModify = async (reviewId, decision, comment) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/admin/${reviewId}/modify`, { decision, comment }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Refresh data
      if (selectedReviewerId) fetchReviewerDetails(selectedReviewerId)
      fetchStats()
      setScreen('history')
    } catch (err) {
      console.error('Failed to modify review:', err)
    }
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        brand="Rubiscape"
        queueItems={dynamicQueueItems}
        toolItems={toolItems}
        activeQueue={activeQueue}
        activeTool={activeTool}
        onQueueSelect={handleQueueSelect}
        onToolSelect={handleToolSelect}
      />

      <main className="admin-main">
        <AdminHeader
          reviewer={reviewerProfile}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          showSearch={screen === 'overview'}
          backLabel={
            screen === 'history'
              ? 'Go Back'
              : screen === 'detail'
                ? 'Back To List'
                : ''
          }
          onBack={
            screen === 'history'
              ? () => setScreen('overview')
              : screen === 'detail'
                ? () => setScreen(selectedReviewerId ? 'history' : 'overview')
                : undefined
          }
        />

        <section className="admin-content">
          {screen === 'overview' ? (
            <AdminOverview
              reviewers={filteredReviewers}
              onReviewerSelect={openReviewerHistory}
            />
          ) : null}

          {screen === 'history' ? (
            <AdminHistory
              reviewer={selectedReviewer}
              history={reviewerHistory}
              onRecordSelect={openRecordDetail}
            />
          ) : null}

          {screen === 'detail' ? (
            <AdminDetail 
              reviewer={selectedReviewer} 
              record={selectedRecord} 
              onModify={handleAdminModify}
              onReassign={handleReassign}
              reviewers={reviewers}
            />
          ) : null}
        </section>
      </main>
    </div>
  )
}

function AdminOverview({ reviewers, onReviewerSelect }) {
  return (
    <div className="admin-screen">
      <div className="admin-copy-block">
        <div className="admin-section-label">Stats:</div>
        <div className="admin-section-title">Reviewer Performance</div>
      </div>

      <section className="admin-table-card">
        <DataTable
          columns={reviewerColumns}
          rows={reviewers}
          onRowClick={(row) => onReviewerSelect(row.reviewerId)}
        />
      </section>
    </div>
  )
}

function AdminHistory({ reviewer, history, onRecordSelect }) {
  // Combine approved, rejected, pending into one list
  const allHistory = [...history.approved, ...history.rejected, ...history.pending];

  return (
    <div className="admin-screen admin-screen--panel">
      <div className="admin-history-head">
        <div>
          <div className="admin-section-title">History</div>
          <div className="admin-history-owner">
            <span className="admin-history-dot"></span>
            <span>{reviewer?.name || 'Reviewer'}</span>
          </div>
        </div>
      </div>

      <section className="admin-table-card admin-table-card--soft">
        <DataTable
          columns={historyColumns}
          rows={allHistory}
          onRowClick={(row) => onRecordSelect(row)}
        />
      </section>
    </div>
  )
}

function AdminDetail({ reviewer, record, onModify, onReassign, reviewers }) {
  if (!record) return <div>No record selected</div>;

  return (
    <div className="admin-detail-layout">
      <aside className="admin-detail-rail">
        <button className="admin-detail-chip" type="button">
          Content Details
        </button>
        <button className="admin-detail-chip" type="button">
          {reviewer?.name || 'Unassigned'}
        </button>
        
        <div className="reassign-box" style={{ marginTop: '20px', padding: '10px' }}>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {reviewer ? 'Reassign to:' : 'Assign to:'}
          </label>
          <select 
            onChange={(e) => onReassign(record._id, e.target.value)}
            className="reassign-select"
            style={{ width: '100%', padding: '5px', marginTop: '5px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
          >
            <option value="">Select Reviewer</option>
            {reviewers.map(r => (
              <option key={r.reviewerId} value={r.reviewerId}>{r.name}</option>
            ))}
          </select>
        </div>
      </aside>

      <section className="admin-detail-stage">
        <div className="admin-detail-block">
          <div className="admin-detail-label">Prompt:</div>
          <div className="admin-bubble admin-bubble--prompt">{record.aiPrompt}</div>
        </div>

        <div className="admin-detail-block">
          <div className="admin-detail-label">Answer:</div>
          <div className="admin-bubble admin-bubble--answer">{record.aiOutput}</div>
        </div>

        <div className="admin-detail-footer">
          <InfoPair label="Timestamp" value={new Date(record.status?.updatedAt || record.createdAt).toLocaleString()} />
          <div className="admin-detail-status">
            <div className="info-pair__label">Current Status</div>
            <StatusPill status={record.status?.type || 'pending'} />
          </div>
          <div className="admin-detail-actions">
            <Button 
              variant="warning" 
              icon="warning" 
              onClick={() => onModify(record._id, 'pending', 'Sent back by admin')}
            >
              Send Back
            </Button>
            <Button 
              variant="primary" 
              icon="edit"
              onClick={() => onModify(record._id, 'approved', 'Approved by admin')}
            >
              Approve
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function TruncatedCell({ value }) {
  return <span className="admin-truncate">{value}</span>
}

export default AdminDashboard
