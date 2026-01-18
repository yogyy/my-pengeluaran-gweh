<script lang="ts">
  interface Expense {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
  }

  let expenses: Expense[] = [];
  let amount = '';
  let description = '';
  let category = 'food';
  let date = new Date().toISOString().split('T')[0];

  const categories = [
    { value: 'food', label: 'Food', icon: '🍔' },
    { value: 'transport', label: 'Transport', icon: '🚗' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'bills', label: 'Bills', icon: '💡' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  function addExpense() {
    if (!amount || !description || parseFloat(amount) <= 0) {
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      category,
      date
    };

    expenses = [newExpense, ...expenses];
    
    // Reset form
    amount = '';
    description = '';
    category = 'food';
    date = new Date().toISOString().split('T')[0];
  }

  function deleteExpense(id: string) {
    expenses = expenses.filter(exp => exp.id !== id);
  }

  function getTotalExpenses(): number {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }

  function getCategoryTotal(cat: string): number {
    return expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  }

  function getCategoryInfo(cat: string) {
    return categories.find(c => c.value === cat) || categories[categories.length - 1];
  }
</script>

<div class="expense-app">
  <header class="header">
    <h1>My Pengeluaran</h1>
    <div class="total-summary">
      <span class="total-label">Total Expenses</span>
      <span class="total-amount">{formatCurrency(getTotalExpenses())}</span>
    </div>
  </header>

  <div class="content">
    <section class="add-expense-section">
      <h2>Add Expense</h2>
      <form on:submit|preventDefault={addExpense} class="expense-form">
        <div class="form-group">
          <label for="amount">Amount</label>
          <input
            id="amount"
            type="number"
            bind:value={amount}
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <input
            id="description"
            type="text"
            bind:value={description}
            placeholder="What did you spend on?"
            required
          />
        </div>

        <div class="form-group">
          <label for="category">Category</label>
          <select id="category" bind:value={category}>
            {#each categories as cat}
              <option value={cat.value}>{cat.icon} {cat.label}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label for="date">Date</label>
          <input
            id="date"
            type="date"
            bind:value={date}
            required
          />
        </div>

        <button type="submit" class="btn-add">Add Expense</button>
      </form>
    </section>

    <section class="expenses-section">
      <div class="section-header">
        <h2>Recent Expenses</h2>
        <span class="expense-count">{expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}</span>
      </div>

      {#if expenses.length === 0}
        <div class="empty-state">
          <div class="empty-icon">💰</div>
          <p>No expenses yet</p>
          <p class="empty-hint">Add your first expense above</p>
        </div>
      {:else}
        <div class="expenses-list">
          {#each expenses as expense (expense.id)}
            <div class="expense-item">
              <div class="expense-icon">
                {getCategoryInfo(expense.category).icon}
              </div>
              <div class="expense-details">
                <div class="expense-description">{expense.description}</div>
                <div class="expense-meta">
                  <span class="expense-category">{getCategoryInfo(expense.category).label}</span>
                  <span class="expense-date">{formatDate(expense.date)}</span>
                </div>
              </div>
              <div class="expense-amount">{formatCurrency(expense.amount)}</div>
              <button 
                class="btn-delete" 
                on:click={() => deleteExpense(expense.id)}
                aria-label="Delete expense"
              >
                🗑️
              </button>
            </div>
          {/each}
        </div>

        <div class="category-breakdown">
          <h3>By Category</h3>
          <div class="category-list">
            {#each categories as cat}
              {@const total = getCategoryTotal(cat.value)}
              {#if total > 0}
                <div class="category-item">
                  <span class="category-icon">{cat.icon}</span>
                  <span class="category-name">{cat.label}</span>
                  <span class="category-amount">{formatCurrency(total)}</span>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </section>
  </div>
</div>

<style>
  .expense-app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: var(--background);
    color: var(--foreground);
  }

  .header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    color: white;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }

  .header h1 {
    margin: 0 0 15px 0;
    font-size: 2rem;
    font-weight: 700;
  }

  .total-summary {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .total-label {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .total-amount {
    font-size: 2rem;
    font-weight: 700;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .add-expense-section,
  .expenses-section {
    background: var(--card);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .add-expense-section h2,
  .expenses-section h2 {
    margin: 0 0 20px 0;
    font-size: 1.5rem;
    color: var(--foreground);
  }

  .expense-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-weight: 500;
    color: var(--foreground);
    font-size: 0.9rem;
  }

  .form-group input,
  .form-group select {
    padding: 12px;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 1rem;
    background: var(--background);
    color: var(--foreground);
    transition: border-color 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #667eea;
  }

  .btn-add {
    padding: 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 8px;
  }

  .btn-add:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-add:active {
    transform: translateY(0);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .expense-count {
    color: var(--muted-foreground);
    font-size: 0.9rem;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted-foreground);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 16px;
  }

  .empty-state p {
    margin: 8px 0;
  }

  .empty-hint {
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .expenses-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .expense-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: var(--background);
    border-radius: 12px;
    border: 1px solid var(--border);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .expense-item:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .expense-icon {
    font-size: 2rem;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary);
    border-radius: 12px;
  }

  .expense-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .expense-description {
    font-weight: 600;
    color: var(--foreground);
  }

  .expense-meta {
    display: flex;
    gap: 12px;
    font-size: 0.85rem;
    color: var(--muted-foreground);
  }

  .expense-category {
    text-transform: capitalize;
  }

  .expense-amount {
    font-weight: 700;
    font-size: 1.1rem;
    color: #ef4444;
  }

  .btn-delete {
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: background 0.2s;
    opacity: 0.6;
  }

  .btn-delete:hover {
    background: var(--destructive);
    opacity: 1;
  }

  .category-breakdown {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 2px solid var(--border);
  }

  .category-breakdown h3 {
    margin: 0 0 16px 0;
    font-size: 1.2rem;
    color: var(--foreground);
  }

  .category-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .category-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--background);
    border-radius: 8px;
  }

  .category-icon {
    font-size: 1.5rem;
  }

  .category-name {
    flex: 1;
    font-weight: 500;
  }

  .category-amount {
    font-weight: 600;
    color: #ef4444;
  }

  @media (max-width: 640px) {
    .expense-app {
      padding: 12px;
    }

    .header h1 {
      font-size: 1.5rem;
    }

    .total-amount {
      font-size: 1.5rem;
    }

    .add-expense-section,
    .expenses-section {
      padding: 16px;
    }

    .expense-item {
      padding: 12px;
    }

    .expense-icon {
      width: 40px;
      height: 40px;
      font-size: 1.5rem;
    }

    .expense-amount {
      font-size: 1rem;
    }
  }
</style>