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
  { id: 'all_reviewers', label: 'All Reviewers', accent: 'slate' },
  { id: 'all', label: 'All Tasks', accent: 'blue' },
  { id: 'under_review', label: 'Under Review', accent: 'purple' },
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
  { key: 'total', label: 'Total Tasks' },
  { key: 'under_review', label: 'Active' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'pending', label: 'Pending' },
]

const historyColumns = [
  { key: 'updatedAt', label: 'Timestamp', render: (row) => new Date(row.status?.updatedAt || row.updatedAt || row.createdAt).toLocaleString() },
  { key: 'state', label: 'Status', render: (row) => <StatusPill status={row.status?.state || row.status || 'pending'} /> },
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
  const [activeQueue, setActiveQueue] = useState('all_reviewers')
  const [activeTool, setActiveTool] = useState('')
  const [screen, setScreen] = useState('overview')
  const [viewMode, setViewMode] = useState('reviewers') // 'reviewers' or 'tasks'
  
  const [reviewers, setReviewers] = useState([])
  const [summary, setSummary] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, under_review: 0 })
  const [globalTasks, setGlobalTasks] = useState([])
  const [selectedReviewerId, setSelectedReviewerId] = useState(null)
  const [reviewerHistory, setReviewerHistory] = useState({ approved: [], rejected: [], pending: [], underReview: [] })
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [recordLogs, setRecordLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState({ action: '', reviewId: '', defaultComment: '' })

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
      setReviewers(response.data.reviewers)
      setSummary(response.data.summary)
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
      if (item.id === 'all_reviewers') {
        count = reviewers.length;
      } else {
        const key = item.id === 'all' ? 'total' : item.id;
        // Use global summary from backend (includes unassigned)
        count = summary[key] || 0;
      }
      return { ...item, count };
    });
  }, [reviewers, summary]);

  const filteredReviewers = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase()

    const list = reviewers.filter((reviewer) => {
      // Show ALL reviewers if activeQueue is 'all_reviewers'
      if (activeQueue === 'all_reviewers') return true;

      const matchesQueue =
        activeQueue === 'approved'
          ? reviewer.approved > 0
          : activeQueue === 'rejected'
            ? reviewer.rejected > 0
            : activeQueue === 'under_review'
              ? reviewer.under_review > 0
              : reviewer.pending > 0

      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${reviewer.name} ${reviewer.email}`
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesQueue && matchesQuery
    })

    // SORT: Reviewers with any work (total > 0) come first
    return [...list].sort((a, b) => {
      if (a.total > 0 && b.total === 0) return -1;
      if (a.total === 0 && b.total > 0) return 1;
      return b.total - a.total; // Then sort by volume
    });
  }, [activeQueue, searchValue, reviewers])

  const handleQueueSelect = (itemId) => {
    setActiveQueue(itemId)
    setActiveTool('')
    
    if (itemId === 'all_reviewers') {
      setViewMode('reviewers')
      setScreen('overview')
    } else {
      setViewMode('tasks')
      setScreen('tasks')
      fetchGlobalTasks(itemId)
    }
  }

  const fetchGlobalTasks = async (status) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`/api/admin/tasks?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGlobalTasks(response.data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
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

  const openRecordDetail = async (record) => {
    setSelectedRecord(record)
    setScreen('detail')
    
    // Fetch logs for history
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`/api/reviews/${record._id}/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRecordLogs(response.data)
    } catch (err) {
      console.error('Failed to fetch logs:', err)
    }
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

  const handleAdminModify = (reviewId, action, defaultComment) => {
    setModalConfig({ reviewId, action, defaultComment });
    setModalOpen(true);
  }

  const submitAdminModify = async (comment, target) => {
    const { reviewId, action } = modalConfig;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/${reviewId}/modify`, { 
        decision: action, 
        comment,
        target: action === 'send_back' ? target : 'reviewer'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setModalOpen(false);
      // Refresh data
      if (selectedReviewerId) fetchReviewerDetails(selectedReviewerId);
      fetchStats();
      if (selectedRecord && selectedRecord._id === reviewId) {
        const refreshRes = await axios.get('/api/admin/tasks', { headers: { Authorization: `Bearer ${token}` } });
        const updatedRecord = refreshRes.data.find(r => r._id === reviewId);
        if (updatedRecord) {
             setSelectedRecord(updatedRecord);
             // Also refresh logs
             const logsRes = await axios.get(`/api/reviews/${reviewId}/logs`, { headers: { Authorization: `Bearer ${token}` } });
             setRecordLogs(logsRes.data);
        }
      }
      setScreen('overview'); // Return for safety
    } catch (err) {
      console.error('Action failed:', err);
      alert(err.response?.data?.error || "Action failed");
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

          {screen === 'tasks' ? (
            <AdminGlobalQueue
              title={`${activeQueue.charAt(0).toUpperCase() + activeQueue.slice(1).replace('_', ' ')} Tasks`}
              tasks={globalTasks}
              onRecordSelect={openRecordDetail}
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
              logs={recordLogs}
              onModify={handleAdminModify}
              onReassign={handleReassign}
              reviewers={reviewers}
              showHistory={showHistory}
              onToggleHistory={() => setShowHistory(!showHistory)}
            />
          ) : null}
        </section>
      </main>

      {modalOpen && (
        <AdminActionModal 
          config={modalConfig} 
          onClose={() => setModalOpen(false)} 
          onSubmit={submitAdminModify} 
        />
      )}
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
  // Combine approved, rejected, pending, underReview into one list
  const allHistory = [
    ...(history.approved || []),
    ...(history.rejected || []),
    ...(history.pending || []),
    ...(history.underReview || [])
  ];

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

function AdminGlobalQueue({ title, tasks, onRecordSelect }) {
  const globalColumns = [
    ...historyColumns,
    { 
      key: 'assignedTo', 
      label: 'Assigned To', 
      render: (row) => row.assignedTo?.name || 'Unassigned' 
    },
    { 
      key: 'lockedBy', 
      label: 'Lock Status', 
      render: (row) => row.isLocked ? (
        <span className="lock-badge">🔒 {row.lockedBy?.name || 'Locked'}</span>
      ) : '---' 
    }
  ];

  return (
    <div className="admin-screen">
      <div className="admin-copy-block">
        <div className="admin-section-label">Queue:</div>
        <div className="admin-section-title">{title}</div>
      </div>

      <section className="admin-table-card">
        <DataTable
          columns={globalColumns}
          rows={tasks}
          onRowClick={(row) => onRecordSelect(row)}
        />
      </section>
    </div>
  )
}

function AdminActionModal({ config, onClose, onSubmit }) {
  const [comment, setComment] = useState(config.defaultComment || '')
  const [target, setTarget] = useState('pool')

  return (
    <div className="modal-overlay">
      <div className="modal-card animate-scale-in">
        <h3 className="modal-title">Admin Override: {config.action.replace('_', ' ').toUpperCase()}</h3>
        <p className="modal-subtitle">Provide mandatory reasoning for this structural workflow change.</p>
        
        <div className="modal-body">
          <label className="modal-label">Decision Reason:</label>
          <textarea 
            className="modal-textarea"
            placeholder="Describe why this manual intervention is necessary..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {config.action === 'send_back' && (
            <div className="target-selector">
              <label className="modal-label">Assignment Target:</label>
              <div className="selector-group">
                <button 
                  className={`selector-btn ${target === 'pool' ? 'is-active' : ''}`} 
                  onClick={() => setTarget('pool')}
                >
                  Global Pool
                </button>
                <button 
                  className={`selector-btn ${target === 'reviewer' ? 'is-active' : ''}`} 
                  onClick={() => setTarget('reviewer')}
                >
                  Original Reviewer
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button 
            className="btn-primary" 
            disabled={!comment.trim()} 
            onClick={() => onSubmit(comment, target)}
          >
            Execute Override
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminDetail({ reviewer, record, logs, onModify, onReassign, reviewers, showHistory, onToggleHistory }) {
  if (!record) return <div>No record selected</div>;

  return (
    <div className="admin-detail-layout">
      <aside className="admin-detail-rail">
        <button className="admin-detail-chip" type="button">
          Content Details
        </button>
        <button className="admin-detail-chip" type="button">
          {record.assignedTo?.name || reviewer?.name || 'Unassigned'}
        </button>
        
        {record.isLocked && (
          <div className="lock-indicator-card">
            <div className="admin-detail-label">Current Lock:</div>
            <div className="lock-badge is-active">
              🔒 Locked by {record.lockedBy?.name || 'Reviewer'}
            </div>
          </div>
        )}

        {(record.status?.state === 'approved' || record.status?.state === 'rejected') && !record.isLocked && (
          <div className="reassign-box" style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>
              Assign to New Reviewer:
            </label>
            <select 
              onChange={(e) => {
                if (e.target.value) onReassign(record._id, e.target.value);
              }}
              className="reassign-select"
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', background: 'white' }}
            >
              <option value="">Select User...</option>
              {reviewers.map(r => (
                <option key={r.reviewerId} value={r.reviewerId}>{r.name}</option>
              ))}
            </select>
            <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '8px' }}>
              * This will reset the task to Pending.
            </p>
          </div>
        )}
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

        <div className="admin-detail-block">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div className="admin-detail-label" style={{ marginBottom: 0 }}>Audit History:</div>
            <Button variant="ghost" size="sm" onClick={onToggleHistory}>
              {showHistory ? 'Hide History' : 'View Audit History'}
            </Button>
          </div>
          
          {showHistory && (
             <div className="audit-timeline-shell fade-in">
               {logs.length === 0 ? (
                 <div className="no-logs">No activity recorded yet for this task.</div>
               ) : (
                 <div className="timeline-trail">
                   {logs.map((log, i) => (
                     <div key={i} className="timeline-item">
                       <div className="timeline-marker">
                         <div className={`marker-dot marker--${log.action}`}></div>
                         {i !== logs.length - 1 && <div className="marker-line"></div>}
                       </div>
                       <div className="timeline-content">
                         <div className="timeline-header">
                           <span className="timeline-action">{log.action.replace('_', ' ')}</span>
                           <span className="timeline-time">{new Date(log.createdAt).toLocaleString()}</span>
                         </div>
                         <div className="timeline-meta">
                           <span className="timeline-user">
                             By: {log.performedBy?.name || `User (${log.performedBy?.role || 'Unknown'})`}
                           </span>
                           <span className="timeline-role" style={{ fontSize: '0.7rem', opacity: 0.8 }}> ({log.performedBy?.role || log.role})</span>
                           {log.assignedTo && (
                             <div className="timeline-assignment-note" style={{ fontSize: '0.75rem', marginTop: '4px', color: '#64748b' }}>
                               <span style={{ fontWeight: 600 }}>Assigned To:</span> {log.assignedTo.name || 'Unassigned'}
                             </div>
                           )}
                         </div>
                         <div className="timeline-message">{log.comment}</div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          )}
        </div>

        <div className="admin-detail-footer">
          <InfoPair label="Last Updated" value={new Date(record.status?.updatedAt || record.createdAt).toLocaleString()} />
          <div className="admin-detail-status">
            <div className="info-pair__label">Current Status</div>
            <StatusPill status={record.status?.state || 'pending'} />
          </div>
          <div className="admin-detail-actions">
            {(record.status?.state === 'approved' || record.status?.state === 'rejected') ? (
              <>
                <Button 
                  variant="warning" 
                  icon="warning" 
                  onClick={() => onModify(record._id, 'send_back', 'Sent for manual verification.')}
                >
                  Send Back
                </Button>
                <Button 
                  variant="primary" 
                  icon="edit"
                  onClick={() => onModify(record._id, 'approved', 'Re-verified by admin')}
                >
                  Force Approve
                </Button>
              </>
            ) : (
               <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%' }}>
                 <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>
                   🔒 Task is currently in workflow ({record.status?.state}). Actions locked for supervisors.
                 </p>
               </div>
            )}
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
