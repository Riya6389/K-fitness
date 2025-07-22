import React, { useState } from 'react';
import './Registration.css';

/* --- API BASE --- */
const API_BASE = 'https://qna8e4qakd.execute-api.ap-south-1.amazonaws.com/prod';
const API_REGISTER = `${API_BASE}/registerUser`;
const API_SEARCH   = `${API_BASE}/searchUser`;                 // GET ?name=
const API_UPDATE   = `${API_BASE}/updateUser`;                  // PUT body JSON
const API_DELETE   = `${API_BASE}/deleteUser`;                  // DELETE /{rfid_id}

const CATEGORY_OPTIONS = ['aerobics', 'yoga', 'dance', 'zumba'];

const EMPTY_USER = {
  rfid_id: '',
  name: '',
  email: '',
  phone: '',
  emergency_contact: '',
  age: '',
  location: '',
  categories: [],
  membership_type: '',
  membership_plan: '',
  start_date: '',
  end_date: '',
  due_date: '',
  payment_mode: '',
  total_amount: '',
  amount_received: '',
  discount: '',
  balance_due: ''
};

export default function Registration() {
  /* ---------------- Registration state (unchanged baseline) ---------------- */
  const [formData, setFormData] = useState({ ...EMPTY_USER });
  const [message, setMessage] = useState('');

  /* ---------------- Update/Delete state ---------------- */
  const [updateSearchQuery, setUpdateSearchQuery] = useState('');
  const [updateSearchResults, setUpdateSearchResults] = useState([]);
  const [deleteSearchQuery, setDeleteSearchQuery] = useState('');
  const [deleteSearchResults, setDeleteSearchResults] = useState([]);

  // user selected (for both update & delete convenience)
  const [selectedUser, setSelectedUser] = useState(null);

  // editable copy for update form
  const [updateData, setUpdateData] = useState({ ...EMPTY_USER });

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [deleteManualRfid, setDeleteManualRfid] = useState('');

  /* ------------------------------------------------------------------ */
  /* Registration handlers                                              */
  /* ------------------------------------------------------------------ */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'category') {
      setFormData((prev) => {
        const next = checked
          ? [...prev.categories, value]
          : prev.categories.filter((c) => c !== value);
        return { ...prev, categories: next };
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Registering...');
    try {
      const res = await fetch(API_REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setMessage(res.ok ? `✅ ${data.message}` : `❌ Error: ${data.message}`);
      if (res.ok) setFormData({ ...EMPTY_USER });
    } catch (err) {
      setMessage('❌ Network Error: ' + err.message);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Shared search helper                                               */
  /* ------------------------------------------------------------------ */
  async function searchUsersByName(query, setResults) {
    if (!query.trim()) {
      setMessage('Enter a name to search.');
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`${API_SEARCH}?name=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) {
        setResults(Array.isArray(data.users) ? data.users : []);
        setMessage(`Found ${Array.isArray(data.users) ? data.users.length : 0} result(s).`);
      } else {
        setResults([]);
        setMessage(`❌ Search error: ${data.message || 'Failed'}`);
      }
    } catch (err) {
      setMessage('❌ Network error searching: ' + err.message);
      setResults([]);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Update section handlers                                            */
  /* ------------------------------------------------------------------ */
  const handleUpdateSearch = () => searchUsersByName(updateSearchQuery, setUpdateSearchResults);

  const handleSelectUserForUpdate = (user) => {
    setSelectedUser(user);              // track globally
    setUpdateData({
      ...EMPTY_USER,
      ...user,
      categories: Array.isArray(user.categories) ? user.categories : []
    });
    setUpdateSearchResults([]);
    setUpdateSearchQuery(user.name || '');
    setMessage(`Loaded ${user.name} (${user.rfid_id}) for update.`);
  };

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Update category checkboxes
    if (type === 'checkbox' && name === 'update_category') {
      setUpdateData((prev) => {
        const next = checked
          ? [...prev.categories, value]
          : prev.categories.filter((c) => c !== value);
        return { ...prev, categories: next };
      });
      return;
    }

    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateData.rfid_id) {
      setMessage('❌ RFID ID required to update.');
      return;
    }
    setUpdating(true);
    setMessage('Updating...');

    // Build payload: send only defined values
    const payload = {};
    Object.entries(updateData).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        if (v.length) payload[k] = v;
      } else if (v !== '' && v !== null && v !== undefined) {
        payload[k] = v;
      }
    });
    payload.rfid_id = updateData.rfid_id.toUpperCase();

    try {
      const res = await fetch(API_UPDATE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setMessage(res.ok ? `✅ ${data.message}` : `❌ Error: ${data.message}`);
      if (res.ok && data.item) {
        setSelectedUser(data.item);
        setUpdateData({
          ...EMPTY_USER,
          ...data.item,
          categories: Array.isArray(data.item.categories) ? data.item.categories : []
        });
      }
    } catch (err) {
      setMessage('❌ Network error updating: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Delete section handlers                                            */
  /* ------------------------------------------------------------------ */
  const handleDeleteSearch = () => searchUsersByName(deleteSearchQuery, setDeleteSearchResults);

  const handleSelectUserForDelete = (user) => {
    setSelectedUser(user);                // global
    setDeleteSearchResults([]);
    setDeleteSearchQuery(user.name || '');
    setDeleteManualRfid(user.rfid_id || '');
    setMessage(`Selected ${user.name} (${user.rfid_id}) for delete.`);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();

    // Determine which RFID to delete: manual overrides selection
    let rfid = deleteManualRfid.trim().toUpperCase();
    if (!rfid && selectedUser?.rfid_id) {
      rfid = selectedUser.rfid_id.toUpperCase();
    }
    if (!rfid) {
      setMessage('❌ Enter or select an RFID to delete.');
      return;
    }

    if (!window.confirm(`Delete user with RFID ${rfid}? This cannot be undone.`)) return;

    setDeleting(true);
    setMessage('Deleting...');
    try {
      const res = await fetch(`${API_DELETE}/${encodeURIComponent(rfid)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      setMessage(res.ok ? `✅ ${data.message}` : `❌ Error: ${data.message}`);
      if (res.ok) {
        // clear if we deleted selected
        if (selectedUser?.rfid_id?.toUpperCase() === rfid) {
          setSelectedUser(null);
          setUpdateData({ ...EMPTY_USER });
        }
        setDeleteManualRfid('');
        setDeleteSearchQuery('');
      }
    } catch (err) {
      setMessage('❌ Network error deleting: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Render helpers                                                      */
  /* ------------------------------------------------------------------ */
  const renderCategoryCheckboxesReg = () => (
    <div className="form-group category-checkboxes">
      {CATEGORY_OPTIONS.map((cat) => (
        <label key={cat}>
          <input
            type="checkbox"
            name="category"
            value={cat}
            checked={formData.categories.includes(cat)}
            onChange={handleChange}
          />
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </label>
      ))}
    </div>
  );

  const renderCategoryCheckboxesUpdate = () => (
    <div className="form-group category-checkboxes">
      {CATEGORY_OPTIONS.map((cat) => (
        <label key={cat}>
          <input
            type="checkbox"
            name="update_category"
            value={cat}
            checked={updateData.categories?.includes(cat) || false}
            onChange={handleUpdateChange}
          />
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </label>
      ))}
    </div>
  );

  /* ------------------------------------------------------------------ */
  /* JSX                                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <div className="registration-container">
      <h1>🏋️ Member Registration</h1>
      {message && <p className="status-message">{message}</p>}

      {/* ------------------ Registration Form ------------------ */}
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>New Member Registration</h2>

        {/* Personal Info */}
        <input type="text" name="rfid_id" placeholder="RFID ID" value={formData.rfid_id} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input type="tel" name="emergency_contact" placeholder="Emergency Contact" value={formData.emergency_contact} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />

        {/* Category */}
        <p className="form-section-title">Category (select one or more):</p>
        {renderCategoryCheckboxesReg()}

        {/* Membership Selection */}
        <select name="membership_type" value={formData.membership_type} onChange={handleChange} required>
          <option value="">Select Membership Type</option>
          <option value="cardio-hardcore">Cardio + Hardcore</option>
          <option value="only-hardcore">Only Hardcore</option>
        </select>

        {/* Membership Plan */}
        <select name="membership_plan" value={formData.membership_plan} onChange={handleChange} required>
          <option value="">Select Plan</option>
          <option value="cardio-1">Cardio+Hardcore - 1 Month ₹1999</option>
          <option value="cardio-3">Cardio+Hardcore - 3 Months ₹5499</option>
          <option value="cardio-6">Cardio+Hardcore - 6 Months ₹8499</option>
          <option value="cardio-12">Cardio+Hardcore - 12 Months ₹11999</option>
          <option value="hardcore-1">Only Hardcore - 1 Month ₹1199</option>
          <option value="hardcore-3">Only Hardcore - 3 Months ₹2999</option>
          <option value="hardcore-6">Only Hardcore - 6 Months ₹4999</option>
          <option value="hardcore-12">Only Hardcore - 12 Months ₹8999</option>
        </select>

        {/* Dates */}
        <div className="form-group">
          <label htmlFor="startDate">Membership Start Date</label>
          <input type="date" id="startDate" name="start_date" value={formData.start_date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">Membership End Date</label>
          <input type="date" id="endDate" name="end_date" value={formData.end_date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Last Due Date</label>
          <input type="date" id="dueDate" name="due_date" value={formData.due_date} onChange={handleChange} required />
        </div>

        {/* Payment Info */}
        <select name="payment_mode" value={formData.payment_mode} onChange={handleChange} required>
          <option value="">Payment Mode</option>
          <option value="net-banking">Net Banking</option>
          <option value="upi">UPI</option>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
        </select>

        <div className="form-group">
          <label>Total Amount</label>
          <input type="text" name="total_amount" value={formData.total_amount} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Amount Received</label>
          <input type="text" name="amount_received" value={formData.amount_received} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Discount Given</label>
          <input type="text" name="discount" value={formData.discount} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Balance Due</label>
          <input type="text" name="balance_due" value={formData.balance_due} onChange={handleChange} required />
        </div>

        <button type="submit" className="submit-btn">Register</button>
      </form>

      {/* ------------------ Update & Delete Section ------------------ */}
      <div className="update-delete-section">
        {/* Update Member */}
        <form className="form-box half-box" onSubmit={handleUpdateSubmit}>
          <h2>Update Member Info</h2>

          {/* Search User */}
          <div className="form-group search-bar">
            <input
              type="text"
              placeholder="Enter name to search"
              value={updateSearchQuery}
              onChange={(e) => setUpdateSearchQuery(e.target.value)}
            />
            <button type="button" className="search-btn" onClick={handleUpdateSearch}>
              Search
            </button>
          </div>

          {/* Search Results */}
          {updateSearchResults.length > 0 && (
            <ul className="search-results">
              {updateSearchResults.map((u) => (
                <li key={u.rfid_id} onClick={() => handleSelectUserForUpdate(u)}>
                  {u.name} ({u.rfid_id})
                </li>
              ))}
            </ul>
          )}

          {/* Show full update form only if a user is selected */}
          {updateData.rfid_id && (
            <>
              {/* Show RFID (read-only) */}
              <input
                type="text"
                name="rfid_id"
                value={updateData.rfid_id}
                onChange={handleUpdateChange}
                placeholder="RFID ID"
                disabled
              />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={updateData.name || ''}
                onChange={handleUpdateChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={updateData.email || ''}
                onChange={handleUpdateChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={updateData.phone || ''}
                onChange={handleUpdateChange}
                required
              />
              <input
                type="tel"
                name="emergency_contact"
                placeholder="Emergency Contact"
                value={updateData.emergency_contact || ''}
                onChange={handleUpdateChange}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={updateData.age || ''}
                onChange={handleUpdateChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={updateData.location || ''}
                onChange={handleUpdateChange}
              />

              {/* Categories */}
              <p className="form-section-title">Category (select one or more):</p>
              {renderCategoryCheckboxesUpdate()}

              {/* Membership type/plan */}
              <select
                name="membership_type"
                value={updateData.membership_type || ''}
                onChange={handleUpdateChange}
              >
                <option value="">Select Membership Type</option>
                <option value="cardio-hardcore">Cardio + Hardcore</option>
                <option value="only-hardcore">Only Hardcore</option>
              </select>

              <select
                name="membership_plan"
                value={updateData.membership_plan || ''}
                onChange={handleUpdateChange}
              >
                <option value="">Select Plan</option>
                <option value="cardio-1">Cardio+Hardcore - 1 Month ₹1999</option>
                <option value="cardio-3">Cardio+Hardcore - 3 Months ₹5499</option>
                <option value="cardio-6">Cardio+Hardcore - 6 Months ₹8499</option>
                <option value="cardio-12">Cardio+Hardcore - 12 Months ₹11999</option>
                <option value="hardcore-1">Only Hardcore - 1 Month ₹1199</option>
                <option value="hardcore-3">Only Hardcore - 3 Months ₹2999</option>
                <option value="hardcore-6">Only Hardcore - 6 Months ₹4999</option>
                <option value="hardcore-12">Only Hardcore - 12 Months ₹8999</option>
              </select>

              {/* Dates */}
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={updateData.start_date || ''}
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={updateData.end_date || ''}
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="form-group">
                <label>Last Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={updateData.due_date || ''}
                  onChange={handleUpdateChange}
                />
              </div>

              {/* Payment */}
              <select
                name="payment_mode"
                value={updateData.payment_mode || ''}
                onChange={handleUpdateChange}
              >
                <option value="">Payment Mode</option>
                <option value="net-banking">Net Banking</option>
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
              </select>

              <div className="form-group">
                <label>Total Amount</label>
                <input
                  type="text"
                  name="total_amount"
                  value={updateData.total_amount || ''}
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="form-group">
                <label>Amount Received</label>
                <input
                  type="text"
                  name="amount_received"
                  value={updateData.amount_received || ''}
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="form-group">
                <label>Discount Given</label>
                <input
                  type="text"
                  name="discount"
                  value={updateData.discount || ''}
                  onChange={handleUpdateChange}
                />
              </div>
              <div className="form-group">
                <label>Balance Due</label>
                <input
                  type="text"
                  name="balance_due"
                  value={updateData.balance_due || ''}
                  onChange={handleUpdateChange}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={updating}>
                {updating ? 'Updating...' : 'Update'}
              </button>
            </>
          )}
        </form>

        {/* Delete Member */}
        <form className="form-box half-box" onSubmit={handleDeleteSubmit}>
          <h2>Delete Member</h2>

          {/* Search by Name (delete box) */}
          <div className="form-group search-bar">
            <input
              type="text"
              placeholder="Search name to delete"
              value={deleteSearchQuery}
              onChange={(e) => setDeleteSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="search-btn"
              onClick={handleDeleteSearch}
            >
              Search
            </button>
          </div>

          {/* Delete search results */}
          {deleteSearchResults.length > 0 && (
            <ul className="search-results">
              {deleteSearchResults.map((u) => (
                <li key={u.rfid_id} onClick={() => handleSelectUserForDelete(u)}>
                  {u.name} ({u.rfid_id})
                </li>
              ))}
            </ul>
          )}

          {/* Manual RFID delete */}
          <div className="form-group">
            <label htmlFor="deleteRfid">RFID ID to delete</label>
            <input
              id="deleteRfid"
              type="text"
              placeholder="Enter RFID"
              value={deleteManualRfid}
              onChange={(e) => setDeleteManualRfid(e.target.value)}
            />
          </div>

          {/* Selected user summary */}
          {selectedUser && (
            <p className="delete-selected-note">
              Selected: <strong>{selectedUser.name}</strong> ({selectedUser.rfid_id})
            </p>
          )}

          <button type="submit" className="delete-btn" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </form>
      </div>
    </div>
  );
}
