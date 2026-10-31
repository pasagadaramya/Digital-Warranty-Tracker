
import { useMemo, useState } from 'react'
import './App.css'

function App() {
  const [productName, setProductName] = useState('')
  const [brand, setBrand] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [warrantyMonths, setWarrantyMonths] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [records, setRecords] = useState([])
  const [activePage, setActivePage] = useState('Dashboard')
  const [popup, setPopup] = useState('')

  const getStatus = (message) => {
    const text = message.toLowerCase()

    if (text.includes('expired')) return 'Expired'
    if (text.includes('active') || text.includes('valid')) return 'Active'

    return 'Checked'
  }

  const checkWarranty = async (event) => {
    event.preventDefault()

    setLoading(true)
    setResult('Checking warranty...')

    try {
      const response = await fetch(
        'http://localhost:8081/api/warranty/check',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productName,
            brand,
            serialNumber,
            purchaseDate,
            warrantyMonths: Number(warrantyMonths),
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Unable to check warranty')
      }

      const data = await response.text()

      setResult(data)

      const newRecord = {
        id: Date.now(),
        productName,
        brand,
        serialNumber,
        purchaseDate,
        warrantyMonths,
        status: getStatus(data),
        message: data,
      }

      setRecords((previous) => [newRecord, ...previous])

      setShowForm(false)

      setProductName('')
      setBrand('')
      setSerialNumber('')
      setPurchaseDate('')
      setWarrantyMonths('')
      setActivePage('Warranties')
    } catch (error) {
      setResult(
        'Could not connect to the warranty service. Please make sure your Spring Boot backend is running on port 8081.'
      )
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return records.filter((record) =>
      `${record.productName} ${record.brand} ${record.serialNumber}`
        .toLowerCase()
        .includes(searchText)
    )
  }, [records, search])

  const activeCount = records.filter(
    (record) => record.status === 'Active'
  ).length

  const expiredCount = records.filter(
    (record) => record.status === 'Expired'
  ).length

  const checkedCount = records.filter(
    (record) => record.status === 'Checked'
  ).length

  const openAddForm = () => {
    setActivePage('Add Warranty')
    setShowForm(true)
    setPopup('')
    setResult('')
  }

  const openPage = (page) => {
    setActivePage(page)
    setPopup('')
    setShowForm(false)
    setResult('')
  }

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          <span className="logo-icon">W</span>
          <span>
            Warranty<span className="logo-light">Hub</span>
          </span>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav className="side-nav">

          <button
            className={activePage === 'Dashboard' ? 'nav-item selected' : 'nav-item'}
            onClick={() => openPage('Dashboard')}
          >
            <span>▦</span> Dashboard
          </button>

          <button
            className={activePage === 'Warranties' ? 'nav-item selected' : 'nav-item'}
            onClick={() => openPage('Warranties')}
          >
            <span>▤</span> Warranties
          </button>

          <button
            className={activePage === 'Add Warranty' ? 'nav-item selected' : 'nav-item'}
            onClick={openAddForm}
          >
            <span>＋</span> Add Warranty
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div
            className="help-card"
            onClick={() => setPopup('help')}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                setPopup('help')
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <span>✦</span>
            <h4>Need help?</h4>
            <p>Click here for help and instructions.</p>
          </div>

          <p className="sidebar-footer">
            DIGITAL WARRANTY CHECKER
          </p>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">

          <div>
            <span className="breadcrumb">Workspace / </span>
            <strong>{activePage}</strong>
          </div>

          <div className="top-actions">

            <div className="search-box">
              <span>⌕</span>

              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setActivePage('Warranties')
                  setShowForm(false)
                }}
              />

            </div>

            <button
              className="notification"
              title="Notifications"
              onClick={() => setPopup('notifications')}
            >
              ♧
            </button>

            <div
              className="profile"
              onClick={() => setPopup('profile')}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  setPopup('profile')
                }
              }}
              style={{ cursor: 'pointer' }}
            >

              <div className="avatar">U</div>

              <div className="profile-text">
                <strong>User</strong>
                <span>Administrator</span>
              </div>

            </div>

          </div>
        </header>

        {/* PAGE HEADING */}
        <section className="welcome-section">

          <div>
            <p className="eyebrow">YOUR WARRANTY SPACE</p>

            <h1>
              Good day! <span>✦</span>
            </h1>

            <p className="welcome-description">
              Manage and track all your product warranties in one place.
            </p>
          </div>

          <button
            className="add-button"
            onClick={openAddForm}
          >
            + Add Warranty
          </button>

        </section>

        {/* SUMMARY CARDS */}
        {activePage === 'Dashboard' && (
          <section className="stats-grid">

            <div className="stat-card">
              <div className="stat-top">
                <span>Total Checks</span>
                <span className="stat-icon purple">▤</span>
              </div>
              <h2>{records.length}</h2>
              <p>Warranty checks this session</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Active Warranties</span>
                <span className="stat-icon green">✓</span>
              </div>
              <h2>{activeCount}</h2>
              <p>Currently valid checks</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Expired Warranties</span>
                <span className="stat-icon coral">◷</span>
              </div>
              <h2>{expiredCount}</h2>
              <p>Expired checks</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Other Results</span>
                <span className="stat-icon blue">◈</span>
              </div>
              <h2>{checkedCount}</h2>
              <p>Other responses</p>
            </div>

          </section>
        )}

        {/* FORM */}
        {showForm && (
          <section className="form-card">

            <div className="section-heading">

              <div>
                <p className="eyebrow">NEW ENTRY</p>
                <h2>Add a Warranty</h2>
                <p>Enter your product details to check its warranty.</p>
              </div>

              <button
                className="close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>

            </div>

            <form onSubmit={checkWarranty}>

              <div className="form-grid">

                <div className="form-field">
                  <label>Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mobile Phone"
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Product Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Samsung"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Serial Number</label>
                  <input
                    type="text"
                    placeholder="Enter serial number"
                    value={serialNumber}
                    onChange={(event) => setSerialNumber(event.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Purchase Date</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(event) => setPurchaseDate(event.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Warranty Period (Months)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 24"
                    value={warrantyMonths}
                    onChange={(event) => setWarrantyMonths(event.target.value)}
                    required
                  />
                </div>

              </div>

              <div className="form-footer">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Checking...' : 'Check Warranty →'}
                </button>

              </div>

            </form>
          </section>
        )}

        {/* RESULT MESSAGE */}
        {result && (
          <div className="result-message" role="status">
            <strong>Warranty Check:</strong> {result}
          </div>
        )}

        {/* WARRANTY TABLE */}
        {(activePage === 'Warranties' || activePage === 'Dashboard') && (
          <section className="table-card">

            <div className="table-heading">

              <div>
                <p className="eyebrow">YOUR PRODUCTS</p>
                <h2>
                  {search ? 'Search Results' : 'Recent Warranty Checks'}
                </h2>
                <p>View the results of your recent warranty checks.</p>
              </div>

              <span className="record-count">
                {filteredRecords.length} records
              </span>

            </div>

            <div className="table-scroll">

              <table>

                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>BRAND</th>
                    <th>SERIAL NUMBER</th>
                    <th>PURCHASE DATE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <tr key={record.id}>

                        <td>
                          <strong>{record.productName}</strong>
                        </td>

                        <td>{record.brand}</td>
                        <td>{record.serialNumber}</td>
                        <td>{record.purchaseDate}</td>

                        <td>
                          <span className={`status ${record.status.toLowerCase()}`}>
                            {record.status}
                          </span>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="empty-state">

                        <span className="empty-icon">▤</span>

                        <strong>
                          {search
                            ? 'No matching products found'
                            : 'No warranty records yet'}
                        </strong>

                        <p>
                          {search
                            ? 'Try searching with another product name, brand, or serial number.'
                            : 'Add a product and check its warranty to see it here.'}
                        </p>

                        {!search && (
                          <button
                            className="empty-button"
                            onClick={openAddForm}
                          >
                            + Add your first warranty
                          </button>
                        )}

                      </td>
                    </tr>
                  )}

                </tbody>

              </table>
            </div>

          </section>
        )}

        {/* HELP, PROFILE AND NOTIFICATION POPUPS */}
        {popup && (
          <div
            onClick={() => setPopup('')}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(30, 20, 45, 0.35)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
          >

            <div
              onClick={(event) => event.stopPropagation()}
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '420px',
                color: '#302744',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              }}
            >

              <button
                onClick={() => setPopup('')}
                style={{
                  float: 'right',
                  border: 'none',
                  background: '#f5f1f8',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontSize: '20px',
                }}
                aria-label="Close popup"
              >
                ×
              </button>

              {popup === 'help' && (
                <>
                  <h2>Need Help?</h2>
                  <p>Welcome to Digital Warranty Checker!</p>
                  <ol>
                    <li>Click Add Warranty.</li>
                    <li>Enter your product name and brand.</li>
                    <li>Enter the serial number and purchase date.</li>
                    <li>Enter the warranty period in months.</li>
                    <li>Click Check Warranty to get the result.</li>
                  </ol>
                  <p>Your checked products will appear in the Warranties section.</p>
                </>
              )}

              {popup === 'profile' && (
                <>
                  <h2>User Profile</h2>
                  <div className="avatar" style={{ marginBottom: '15px' }}>U</div>
                  <p><strong>Name:</strong> User</p>
                  <p><strong>Role:</strong> Administrator</p>
                  <p><strong>Account:</strong> Local Demo Account</p>
                  <p>This is a sample profile for your warranty dashboard.</p>
                </>
              )}

              {popup === 'notifications' && (
                <>
                  <h2>Notifications</h2>
                  {records.length === 0 ? (
                    <p>No notifications yet. Check a warranty to see updates here.</p>
                  ) : (
                    <>
                      <p>You have {records.length} warranty check(s).</p>
                      {records.slice(0, 5).map((record) => (
                        <p key={record.id}>
                          <strong>{record.productName}</strong> — {record.status}
                        </p>
                      ))}
                    </>
                  )}
                </>
              )}

            </div>
          </div>
        )}

        <footer className="page-footer">
          © 2026 Digital Warranty Checker. All rights reserved.
        </footer>

      </main>
    </div>
  )
}

export default App
