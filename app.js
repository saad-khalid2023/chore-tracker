// ================================
// DATA
// ================================

const kids = [
    {
        name: "Nadia",
        id: "nadia",
        pin: "0918",
        color: "#534AB7",
        lightColor: "#EEEDFE",
        balance: 0,
        history: [],
        pending: [],
        lastCleared: null
    },
    {
        name: "Sophia",
        id: "sophia",
        pin: "0321",
        color: "#185FA5",
        lightColor: "#E6F1FB",
        balance: 0,
        history: [],
        pending: [],
        lastCleared: null
    },
    {
        name: "Mina",
        id: "mina",
        pin: "1234",
        color: "#993C1D",
        lightColor: "#FAECE7",
        balance: 0,
        history: [],
        pending: [],
        lastCleared: null
    }
];

const chores = [
    {
        id: "bed",
        name: "Make Your Bed",
        icon: "🛏️",
        type: "individual",
        amount: 1.00
    },
    {
        id: "own-room",
        name: "Clean Own Room",
        icon: "🧹",
        type: "individual",
        amount: 1.00
    },
    {
        id: "own-bathroom",
        name: "Clean Own Bathroom",
        icon: "🚿",
        type: "individual",
        amount: 1.00
    },
    {
        id: "living-room",
        name: "Clean Living Room",
        icon: "🛋️",
        type: "individual",
        amount: 1.00
    },
    {
        id: "playroom",
        name: "Clean Playroom",
        icon: "🧸",
        type: "individual",
        amount: 1.00
    },
    {
        id: "math",
        name: "Math Practice",
        icon: "📐",
        type: "individual",
        amount: 1.00
    },
    {
        id: "quran",
        name: "Quran Practice",
        icon: "📖",
        type: "individual",
        amount: 1.00
    },
    {
        id: "namaz",
        name: "Namaz Practice",
        icon: "🤲",
        type: "individual",
        amount: 1.00
    },
    {
        id: "dining-room",
        name: "Clean Dining Room",
        icon: "🍽️",
        type: "household",
        amount: 1.00
    },
    {
        id: "laundry-room",
        name: "Clean Laundry Room",
        icon: "🫧",
        type: "household",
        amount: 1.00
    },
    {
        id: "half-bath",
        name: "Clean Half Bathroom",
        icon: "🚽",
        type: "household",
        amount: 1.00
    },
    {
        id: "trash",
        name: "Take Out Trash and Recycling",
        icon: "🗑️",
        type: "household",
        amount: 1.00
    },
    {
        id: "laundry",
        name: "Fold Laundry",
        icon: "👕",
        type: "household",
        amount: 1.00
    }
];

const ADMIN_PASSWORD = "start123!";

// ================================
// STATE
// ================================

let currentKid = null;
let currentTab = "chores";

// ================================
// STARTUP
// ================================

function init() {
    loadDataFromStorage();
    renderLoginScreen();
}

// ================================
// STORAGE
// ================================

function saveDataToStorage() {
    localStorage.setItem(
        "choreData",
        JSON.stringify(kids)
    );
}

function loadDataFromStorage() {
    const saved = localStorage.getItem("choreData");
    if (saved) {
        const savedKids = JSON.parse(saved);
        savedKids.forEach(function(savedKid) {
            const kid = kids.find(function(k) {
                return k.id === savedKid.id;
            });
            if (kid) {
                kid.balance = savedKid.balance;
                kid.history = savedKid.history;
                kid.pending = savedKid.pending || [];
                kid.lastCleared = 
                   savedKid.lastCleared || null;
            }
        });
    }
}

// ================================
// LOGIN SCREEN
// ================================

function renderLoginScreen() {
    showScreen("login-screen");
    const container = document.getElementById(
        "kid-buttons"
    );
    container.innerHTML = "";

    kids.forEach(function(kid) {
        const pendingCount = kid.pending.length;
        const button = document.createElement("button");
        button.className = "kid-btn";
        button.innerHTML = `
            <div class="kid-btn-left">
                <div class="kid-avatar" 
                     style="background:${kid.lightColor};
                            color:${kid.color}">
                    ${kid.name.charAt(0)}
                </div>
                <div>
                    <div>${kid.name}</div>
                    ${pendingCount > 0 ? `
                    <div style="font-size:11px;
                                color:#999;">
                        ${pendingCount} waiting approval
                    </div>` : ""}
                </div>
            </div>
            <span class="kid-balance-preview">
                $${kid.balance.toFixed(2)}
            </span>
        `;
        button.onclick = function() {
            promptPIN(kid);
        };
        container.appendChild(button);
    });

    const adminLink = document.getElementById(
        "admin-link"
    );
    adminLink.onclick = function() {
        showAdminLogin();
    };
}

// ================================
// PIN LOGIN
// ================================

function promptPIN(kid) {
    const entered = prompt(
        `Hi ${kid.name}! Enter your 4-digit PIN:`
    );
    if (entered === null) return;
    if (entered === kid.pin) {
        loginAs(kid);
    } else {
        alert("Incorrect PIN. Please try again.");
    }
}

// ================================
// LOGIN AND LOGOUT
// ================================

function loginAs(kid) {
    currentKid = kid;
    updateHeaderBalance();
    renderDashboard();
    showScreen("dashboard-screen");
}

function logout() {
    currentKid = null;
    document.getElementById("header-balance")
        .style.display = "none";
    renderLoginScreen();
}

function showAdminLogin() {
    const password = prompt("Enter parent password:");
    if (password === null) return;
    if (password === ADMIN_PASSWORD) {
        showScreen("admin-screen");
        renderAdminScreen();
    } else {
        alert("Incorrect password. Try again.");
    }
}

// ================================
// SCREEN NAVIGATION
// ================================

function showScreen(screenId) {
    const screens = document.querySelectorAll(".screen");
    screens.forEach(function(screen) {
        screen.style.display = "none";
    });
    document.getElementById(screenId)
        .style.display = "block";
}

// ================================
// HEADER
// ================================

function updateHeaderBalance() {
    const headerBalance = document.getElementById(
        "header-balance"
    );
    const headerAmount = document.getElementById(
        "header-amount"
    );
    headerBalance.style.display = "block";
    headerAmount.textContent =
        "$" + currentKid.balance.toFixed(2);
}

// ================================
// DASHBOARD
// ================================

function renderDashboard() {
    document.getElementById(
        "balance-display"
    ).textContent = "$" + currentKid.balance.toFixed(2);
    document.getElementById(
        "today-count"
    ).textContent = getTodayCount();
    renderChores();
    renderHistory();
}

function getTodayCount() {
    const today = new Date().toDateString();
    return currentKid.history.filter(function(entry) {
        return entry.date === today &&
               entry.status === "approved";
    }).length;
}

// ================================
// CHORE STATUS HELPERS
// ================================

function isChoreCompletedToday(kid, choreId) {
    const today = new Date().toDateString();
    const inHistory = kid.history.some(function(entry) {
        return entry.choreId === choreId &&
               entry.date === today &&
               entry.status !== "rejected";
    });
    const inPending = kid.pending.some(function(entry) {
        return entry.choreId === choreId &&
               entry.date === today;
    });
    return inHistory || inPending;
}

function isHouseholdChoreDoneByAnyone(choreId) {
    const today = new Date().toDateString();
    return kids.some(function(kid) {
        const inHistory = kid.history.some(
            function(entry) {
                return entry.choreId === choreId &&
                       entry.date === today &&
                       entry.status !== "rejected";
            }
        );
        const inPending = kid.pending.some(
            function(entry) {
                return entry.choreId === choreId &&
                       entry.date === today;
            }
        );
        return inHistory || inPending;
    });
}

function whoDidHouseholdChore(choreId) {
    const today = new Date().toDateString();
    const finder = kids.find(function(kid) {
        const inHistory = kid.history.some(
            function(entry) {
                return entry.choreId === choreId &&
                       entry.date === today;
            }
        );
        const inPending = kid.pending.some(
            function(entry) {
                return entry.choreId === choreId &&
                       entry.date === today;
            }
        );
        return inHistory || inPending;
    });
    return finder ? finder.name : null;
}

// ================================
// CHORES
// ================================

function renderChores() {
    const container = document.getElementById(
        "chores-panel"
    );
    container.innerHTML = "";

    chores.forEach(function(chore) {
        let status = "available";
        let lockedBy = null;

        if (chore.type === "individual") {
            if (isChoreCompletedToday(
                currentKid, chore.id
            )) {
                status = "done";
            }
        } else {
            if (isHouseholdChoreDoneByAnyone(chore.id)) {
                const who = whoDidHouseholdChore(
                    chore.id
                );
                if (who === currentKid.name) {
                    status = "done";
                } else {
                    status = "locked";
                    lockedBy = who;
                }
            }
        }

        const rejectedEntry = currentKid.history.find(
            function(entry) {
                return entry.choreId === chore.id &&
                       entry.status === "rejected" &&
                       entry.date ===
                           new Date().toDateString();
            }
        );

        const item = document.createElement("div");
        item.className = "chore-item";

        let buttonHTML = "";
        if (status === "available") {
            buttonHTML = `
                <button class="earn-btn"
                    onclick="submitChore('${chore.id}')">
                    Submit
                </button>`;
        } else if (status === "done") {
            buttonHTML = `
                <button class="earn-btn done" disabled>
                    Pending
                </button>`;
            const approved = currentKid.history.find(
                function(e) {
                    return e.choreId === chore.id &&
                           e.status === "approved" &&
                           e.date ===
                               new Date().toDateString();
                }
            );
            if (approved) {
                buttonHTML = `
                    <button class="earn-btn done" 
                            disabled>
                        ✓ Done
                    </button>`;
            }
        } else if (status === "locked") {
            buttonHTML = `
                <button class="earn-btn done" disabled>
                    Done by ${lockedBy}
                </button>`;
        }

        item.innerHTML = `
            <div class="chore-left">
                <div class="chore-icon">
                    ${chore.icon}
                </div>
                <div>
                    <div class="chore-name">
                        ${chore.name}
                    </div>
                    <div class="chore-amount">
                        +$${chore.amount.toFixed(2)}
                    </div>
                    ${rejectedEntry ? `
                    <div style="font-size:11px;
                                color:#A32D2D;
                                margin-top:3px;">
                        Rejected: 
                        ${rejectedEntry.rejectionReason}
                    </div>` : ""}
                </div>
            </div>
            <div class="chore-right">
                ${buttonHTML}
            </div>
        `;
        container.appendChild(item);
    });
}

function submitChore(choreId) {
    const chore = chores.find(function(c) {
        return c.id === choreId;
    });
    if (!chore) return;

    const confirmed = confirm(
        `Submit "${chore.name}" for Dad's approval?`
    );
    if (!confirmed) return;

    currentKid.pending.push({
        choreId: chore.id,
        choreName: chore.name,
        amount: chore.amount,
        date: new Date().toDateString(),
        time: new Date().toLocaleTimeString(),
        status: "pending"
    });

    saveDataToStorage();
    renderDashboard();
}

// ================================
// HISTORY
// ================================

function renderHistory() {
    const container = document.getElementById(
        "history-panel"
    );
    container.innerHTML = "";

    const allEntries = [
        ...currentKid.history,
        ...currentKid.pending
    ];

    if (allEntries.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;
                        padding:40px;
                        color:#black;">
                No chores yet. Start earning!
            </div>
        `;
        return;
    }

    allEntries.forEach(function(entry) {
        const item = document.createElement("div");
        item.className = "history-item";

        let statusBadge = "";
        if (entry.status === "pending") {
            statusBadge = `
                <span style="font-size:11px;
                             background:#FAEEDA;
                             color:#854F0B;
                             padding:3px 8px;
                             border-radius:20px;">
                    Waiting
                </span>`;
        } else if (entry.status === "approved") {
            statusBadge = `
                <span style="font-size:11px;
                             background:#EAF3DE;
                             color:#27500A;
                             padding:3px 8px;
                             border-radius:20px;">
                    Approved
                </span>`;
        } else if (entry.status === "rejected") {
            statusBadge = `
                <span style="font-size:11px;
                             background:#FCEBEB;
                             color:#A32D2D;
                             padding:3px 8px;
                             border-radius:20px;">
                    Rejected
                </span>`;
        }

        item.innerHTML = `
            <div>
                <div class="history-chore-name">
                    ${entry.choreName}
                </div>
                <div class="history-date">
                    ${entry.date} at ${entry.time}
                </div>
                ${entry.rejectionReason ? `
                <div style="font-size:11px;
                            color:#A32D2D;
                            margin-top:2px;">
                    Reason: ${entry.rejectionReason}
                </div>` : ""}
            </div>
            <div style="display:flex;
                        flex-direction:column;
                        align-items:flex-end;
                        gap:4px;">
                <div class="history-amount">
                    +$${entry.amount.toFixed(2)}
                </div>
                ${statusBadge}
            </div>
        `;
        container.appendChild(item);
    });
}

// ================================
// TAB SWITCHING
// ================================

function switchTab(tab) {
    currentTab = tab;
    document.getElementById(
        "chores-panel"
    ).style.display = tab === "chores" ? "block" : "none";
    document.getElementById(
        "history-panel"
    ).style.display =
        tab === "history" ? "block" : "none";
    document.getElementById(
        "tab-chores"
    ).className = "tab" + (
        tab === "chores" ? " active" : ""
    );
    document.getElementById(
        "tab-history"
    ).className = "tab" + (
        tab === "history" ? " active" : ""
    );
}

// ================================
// Pay and Clear
// ================================

function getDaysSinceCleared(lastCleared) {
    if (!lastCleared) return null;
    
    const cleared = new Date(lastCleared);
    const today = new Date();
    const diffTime = today - cleared;
    const diffDays = Math.floor(
        diffTime / (1000 * 60 * 60 * 24)
    );
    return diffDays;
}

// ================================
// ADMIN SCREEN
// ================================

function renderAdminScreen() {
    const container = document.getElementById(
        "admin-kids"
    );
    container.innerHTML = "";

    const pendingSection = document.createElement("div");
    pendingSection.innerHTML = `
        <h3 style="font-size:16px;
                   font-weight:600;
                   margin-bottom:12px;
                   color:#1a1a1a;">
            Pending Approvals
        </h3>
    `;

    let hasPending = false;

    kids.forEach(function(kid) {
        kid.pending.forEach(function(entry) {
            hasPending = true;
            const card = document.createElement("div");
            card.className = "admin-kid-card";
            card.style.flexDirection = "column";
            card.style.alignItems = "stretch";
            card.style.gap = "12px";
            card.innerHTML = `
                <div style="display:flex;
                            align-items:center;
                            justify-content:space-between;">
                    <div class="admin-kid-info">
                        <div class="kid-avatar"
                             style="background:
                                 ${kid.lightColor};
                                    color:${kid.color}">
                            ${kid.name.charAt(0)}
                        </div>
                        <div>
                            <div class="admin-kid-name">
                                ${kid.name}
                            </div>
                            <div class="admin-kid-stats">
                                ${entry.choreName} — 
                                $${entry.amount.toFixed(2)}
                            </div>
                            <div class="admin-kid-stats">
                                ${entry.date} at 
                                ${entry.time}
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button class="earn-btn"
                            style="background:#27500A;"
                            onclick="approveChore(
                                '${kid.id}',
                                '${entry.choreId}',
                                '${entry.time}')">
                            Approve
                        </button>
                        <button class="pay-btn"
                            onclick="rejectChore(
                                '${kid.id}',
                                '${entry.choreId}',
                                '${entry.time}')">
                            Reject
                        </button>
                    </div>
                </div>
            `;
            pendingSection.appendChild(card);
        });
    });

    if (!hasPending) {
        pendingSection.innerHTML += `
            <div style="text-align:center;
                        padding:20px;
                        color:#999;
                        background:white;
                        border-radius:12px;
                        border:1.5px solid #e8e8e8;
                        margin-bottom:10px;">
                No pending approvals right now.
            </div>
        `;
    }

    container.appendChild(pendingSection);

    const balanceSection = document.createElement("div");
    balanceSection.innerHTML = `
        <h3 style="font-size:16px;
                   font-weight:600;
                   margin:20px 0 12px;
                   color:#1a1a1a;">
            Kid Balances
        </h3>
    `;

kids.forEach(function(kid) {
    const totalChores = kid.history.filter(
        function(e) {
            return e.status === "approved";
        }
    ).length;

    const daysSince = getDaysSinceCleared(
        kid.lastCleared
    );

    let clearedText = "";
    if (daysSince === null) {
        clearedText = "Never cleared";
    } else if (daysSince === 0) {
        clearedText = "Cleared today";
    } else if (daysSince === 1) {
        clearedText = "Cleared yesterday";
    } else {
        clearedText = `Last cleared ${daysSince} days ago`;
    }

    let clearedColor = "#999";
    if (daysSince !== null && daysSince >= 14) {
        clearedColor = "#A32D2D";
    } else if (daysSince !== null && daysSince >= 7) {
        clearedColor = "#854F0B";
    }

    const card = document.createElement("div");
    card.className = "admin-kid-card";
    card.innerHTML = `
        <div class="admin-kid-info">
            <div class="kid-avatar"
                 style="background:${kid.lightColor};
                        color:${kid.color}">
                ${kid.name.charAt(0)}
            </div>
            <div>
                <div class="admin-kid-name">
                    ${kid.name}
                </div>
                <div class="admin-kid-stats">
                    ${totalChores} chores approved
                </div>
                <div style="font-size:11px;
                            color:${clearedColor};
                            margin-top:2px;
                            font-weight:500;">
                    ${clearedText}
                </div>
            </div>
        </div>
        <div style="display:flex;
                    align-items:center;
                    gap:12px;">
            <div class="admin-balance">
                $${kid.balance.toFixed(2)}
            </div>
            <button class="pay-btn"
                onclick="payAndClear('${kid.id}')">
                Pay &amp; clear
            </button>
        </div>
    `;
    balanceSection.appendChild(card);
});

    container.appendChild(balanceSection);
}

// ================================
// APPROVE AND REJECT
// ================================

function approveChore(kidId, choreId, time) {
    const kid = kids.find(function(k) {
        return k.id === kidId;
    });
    if (!kid) return;

    const pendingIndex = kid.pending.findIndex(
        function(entry) {
            return entry.choreId === choreId &&
                   entry.time === time;
        }
    );
    if (pendingIndex === -1) return;

    const entry = kid.pending[pendingIndex];
    entry.status = "approved";

    kid.balance += entry.amount;
    kid.history.unshift(entry);
    kid.pending.splice(pendingIndex, 1);

    saveDataToStorage();
    renderAdminScreen();
    alert(`Approved! $${entry.amount.toFixed(2)} 
added to ${kid.name}'s balance.`);
}

function rejectChore(kidId, choreId, time) {
    const kid = kids.find(function(k) {
        return k.id === kidId;
    });
    if (!kid) return;

    const reason = prompt(
        `Why are you rejecting this chore for ${kid.name}?
Write a short reason they will see:`
    );
    if (reason === null) return;
    if (reason.trim() === "") {
        alert("Please provide a reason.");
        return;
    }

    const pendingIndex = kid.pending.findIndex(
        function(entry) {
            return entry.choreId === choreId &&
                   entry.time === time;
        }
    );
    if (pendingIndex === -1) return;

    const entry = kid.pending[pendingIndex];
    entry.status = "rejected";
    entry.rejectionReason = reason;

    kid.history.unshift(entry);
    kid.pending.splice(pendingIndex, 1);

    saveDataToStorage();
    renderAdminScreen();
    alert(`Rejected. ${kid.name} will see your reason.`);
}

// ================================
// PAY AND CLEAR
// ================================

function payAndClear(kidId) {
    const kid = kids.find(function(k) {
        return k.id === kidId;
    });
    if (!kid) return;

    if (kid.balance === 0) {
        alert(`${kid.name} has no balance to clear.`);
        return;
    }

    const confirmed = confirm(
        `Pay ${kid.name} $${kid.balance.toFixed(2)} 
and clear their balance?`
    );
    if (confirmed) {
        kid.balance = 0;
        kid.history = [];
        kid.lastCleared = new Date().toDateString();
        saveDataToStorage();
        renderAdminScreen();
        alert(`${kid.name}'s balance cleared!`);
    }
}

// ================================
// START THE APP
// ================================

window.onload = init;