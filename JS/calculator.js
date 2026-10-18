let expr = "";
let lastAnswer = 0;
let isDeg = true;
let justCalculated = false;

// ---------- DISPLAY ----------
function update() {
    const screen = document.getElementById("screen");
    screen.value = expr || "0";
}

function updateCursor(pos) {
    const screen = document.getElementById("screen");
    screen.value = expr;
    // Small timeout to ensure focus happens after DOM updates
    setTimeout(() => {
        screen.focus();
        screen.setSelectionRange(pos, pos);
    }, 0);
}

// ---------- INPUT ----------
function input(val) {
    const screen = document.getElementById("screen");

    // Clear screen if typing a number immediately after a result
    if (justCalculated) {
        // If typing an operator, keep the previous answer
        if (['+', '-', '*', '/', '^', '%'].includes(val)) {
            expr = lastAnswer.toString();
        } else {
            expr = "";
        }
        justCalculated = false;
    }

    let start = screen.selectionStart;
    let end = screen.selectionEnd;

    // Handle "NaN" or "Error" state
    if (expr === "Error" || expr === "NaN") {
        expr = "";
        start = 0;
        end = 0;
    }

    expr = expr.slice(0, start) + val + expr.slice(end);
    updateCursor(start + val.length);
}

function backspace() {
    const screen = document.getElementById("screen");
    let pos = screen.selectionStart;

    if (justCalculated) {
        expr = "";
        update();
        justCalculated = false;
        return;
    }

    if (pos > 0) {
        expr = expr.slice(0, pos - 1) + expr.slice(pos);
        updateCursor(pos - 1);
    }
}

function clearAll() {
    expr = "";
    document.getElementById("history").innerText = "";
    update();
}

function ans() {
    input(lastAnswer.toString());
}

// ---------- MODES ----------
function toggleDegRad() {
    isDeg = !isDeg;
    const btn = document.getElementById("degBtn");
    btn.innerText = isDeg ? "DEG" : "RAD";
    btn.style.color = isDeg ? "#8ab4f8" : "#e8eaed";
}

// ---------- MATH HELPERS ----------

// Custom Factorial Function
function factorial(n) {
    if (n < 0) return NaN;
    if (!Number.isInteger(n)) return NaN; // Standard factorial is for integers
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

// Safe formatting
function cleanResult(n) {
    // If n is Infinity, -Infinity or NaN, return it as string directly
    if (!isFinite(n)) return n.toString();

    // Check if it's practically an integer
    if (Number.isInteger(n)) return n;

    // Fix floating point garbage (e.g. 0.1 + 0.2 = 0.30000000000000004)
    let fixed = parseFloat(n.toFixed(10));

    // Remove trailing zeros if any
    return fixed;
}

// ---------- CALCULATION CORE ----------
function calculate() {
    if (!expr) return;

    try {
        // 1. Pre-processing string for symbols
        let processed = expr;
        processed = processed.replace(/×/g, "*");
        processed = processed.replace(/÷/g, "/");
        processed = processed.replace(/−/g, "-"); // Replace special minus char
        processed = processed.replace(/π/g, "Math.PI");
        processed = processed.replace(/e/g, "Math.E");
        processed = processed.replace(/\^/g, "**");
        processed = processed.replace(/%/g, "/100");

        // 2. Define Custom Math Functions within the scope of execution
        // We use a closure approach to inject `isDeg` logic safely

        const degToRad = (angle) => angle * (Math.PI / 180);

        const scope = {
            sin: (x) => isDeg ? Math.sin(degToRad(x)) : Math.sin(x),
            cos: (x) => isDeg ? Math.cos(degToRad(x)) : Math.cos(x),
            // FIX FOR TAN(90): Explicitly check boundaries
            tan: (x) => {
                if (isDeg) {
                    // Check if x is 90, 270, 450... (90 + k*180)
                    if (Math.abs((x - 90) % 180) < 1e-9) return Infinity; // or throw "Error"
                    return Math.tan(degToRad(x));
                }
                return Math.tan(x);
            },
            // FIX FOR LN/LOG ERRORS:
            ln: (x) => Math.log(x),
            log: (x) => Math.log10(x),
            sqrt: (x) => Math.sqrt(x),
            fact: (x) => factorial(x)
        };

        // 3. Create the function with keys of scope as arguments
        const keys = Object.keys(scope);
        const values = Object.values(scope);

        // "fact(5) + sin(30)" -> This works naturally now
        const calcFunc = new Function(...keys, `return ${processed}`);

        let raw = calcFunc(...values);

        // 4. Handle Result
        if (isNaN(raw)) {
            throw new Error("NaN");
        }

        let result = cleanResult(raw);

        document.getElementById("history").innerText = expr + " =";
        document.getElementById("screen").value = result;

        lastAnswer = result;
        expr = result.toString();
        justCalculated = true;

    } catch (e) {
        console.error(e);
        document.getElementById("screen").value = "Error";
        expr = "";
        justCalculated = true; // So typing a number clears "Error"
    }
}