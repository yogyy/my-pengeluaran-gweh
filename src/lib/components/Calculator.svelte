<script lang="ts">
  let display = '0';
  let previousValue = '';
  let operation = '';
  let shouldResetDisplay = false;

  function inputNumber(num: string) {
    if (shouldResetDisplay) {
      display = num;
      shouldResetDisplay = false;
    } else {
      display = display === '0' ? num : display + num;
    }
  }

  function inputDecimal() {
    if (shouldResetDisplay) {
      display = '0.';
      shouldResetDisplay = false;
    } else if (!display.includes('.')) {
      display += '.';
    }
  }

  function clear() {
    display = '0';
    previousValue = '';
    operation = '';
    shouldResetDisplay = false;
  }

  function performOperation(op: string) {
    if (previousValue && operation && !shouldResetDisplay) {
      calculate();
    } else {
      previousValue = display;
    }
    operation = op;
    shouldResetDisplay = true;
  }

  function calculate() {
    if (!previousValue || !operation) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = prev / current;
        break;
      default:
        return;
    }

    display = result.toString();
    previousValue = '';
    operation = '';
    shouldResetDisplay = true;
  }

  function handleEquals() {
    if (previousValue && operation) {
      calculate();
    }
  }

  function formatDisplay(value: string): string {
    if (value.length > 12) {
      const num = parseFloat(value);
      if (isNaN(num)) return value;
      return num.toExponential(6);
    }
    return value;
  }
</script>

<div class="calculator">
  <div class="display">
    {formatDisplay(display)}
  </div>
  <div class="buttons">
    <button class="btn btn-clear" on:click={clear}>C</button>
    <button class="btn btn-operator" on:click={() => performOperation('÷')}>÷</button>
    <button class="btn btn-operator" on:click={() => performOperation('×')}>×</button>
    <button class="btn btn-operator" on:click={() => performOperation('-')}>−</button>
    
    <button class="btn btn-number" on:click={() => inputNumber('7')}>7</button>
    <button class="btn btn-number" on:click={() => inputNumber('8')}>8</button>
    <button class="btn btn-number" on:click={() => inputNumber('9')}>9</button>
    <button class="btn btn-operator" on:click={() => performOperation('+')}>+</button>
    
    <button class="btn btn-number" on:click={() => inputNumber('4')}>4</button>
    <button class="btn btn-number" on:click={() => inputNumber('5')}>5</button>
    <button class="btn btn-number" on:click={() => inputNumber('6')}>6</button>
    <button class="btn btn-equals" on:click={handleEquals}>=</button>
    
    <button class="btn btn-number" on:click={() => inputNumber('1')}>1</button>
    <button class="btn btn-number" on:click={() => inputNumber('2')}>2</button>
    <button class="btn btn-number" on:click={() => inputNumber('3')}>3</button>
    
    <button class="btn btn-number btn-zero" on:click={() => inputNumber('0')}>0</button>
    <button class="btn btn-number" on:click={inputDecimal}>.</button>
  </div>
</div>

<style>
  .calculator {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 320px;
    margin: 0 auto;
  }

  .display {
    background: rgba(0, 0, 0, 0.3);
    color: white;
    font-size: 2.5rem;
    font-weight: 300;
    padding: 20px;
    text-align: right;
    border-radius: 10px;
    margin-bottom: 20px;
    min-height: 60px;
    display: flex;
    justify-content: flex-end;
    word-break: break-all;
    font-family: 'Courier New', monospace;
    backdrop-filter: blur(10px);
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .btn {
    border: none;
    border-radius: 12px;
    font-size: 1.5rem;
    font-weight: 500;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    font-family: system-ui, -apple-system, sans-serif;
  }

  .btn:active {
    transform: scale(0.95);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .btn-number {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  }

  .btn-number:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .btn-operator {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    font-weight: 600;
  }

  .btn-operator:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  .btn-clear {
    background: rgba(255, 87, 87, 0.8);
    backdrop-filter: blur(10px);
  }

  .btn-clear:hover {
    background: rgba(255, 87, 87, 1);
  }

  .btn-equals {
    background: rgba(76, 175, 80, 0.8);
    backdrop-filter: blur(10px);
    grid-row: span 2;
    font-weight: 600;
  }

  .btn-equals:hover {
    background: rgba(76, 175, 80, 1);
  }

  .btn-zero {
    grid-column: span 1;
  }

  @media (max-width: 480px) {
    .calculator {
      max-width: 100%;
      padding: 15px;
    }

    .display {
      font-size: 2rem;
      padding: 15px;
      min-height: 50px;
    }

    .btn {
      font-size: 1.3rem;
      padding: 18px;
    }
  }
</style>