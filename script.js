/* =====================================================================
   CLARITYCHECK - JAVASCRIPT APPLICATION LOGIC
   ===================================================================== */

// ---------------------------------------------------------------------
// 1. DATA STRUCTURE (LESSON TOPICS & QUIZZES)
// ---------------------------------------------------------------------
const lessonData = [
    {
        id: "topic-1",
        title: "Newton's First Law (Inertia)",
        description: "An object stays at rest or in motion unless acted upon by an external net force.",
        status: "fuzzy", // Options: "lost", "fuzzy", "got-it"
        simpleExplanation: "Think of a hockey puck on frictionless ice. Once you push it, it will keep sliding forever until it hits a wall or friction stops it. Inertia just means objects are lazy—they want to keep doing whatever they are already doing!",
        quiz: {
            question: "Why does a passenger lurch forward when a car suddenly brakes?",
            options: [
                "A force pushes the passenger forward.",
                "The passenger's body wants to keep moving forward due to inertia.",
                "Gravity increases suddenly when braking."
            ],
            correctIndex: 1,
            explanation: "Because of inertia, your body tries to keep moving at the car's original speed even after the brakes stop the vehicle!"
        }
    },
    {
        id: "topic-2",
        title: "Newton's Second Law (F = ma)",
        description: "Force equals mass multiplied by acceleration.",
        status: "got-it",
        simpleExplanation: "Heavy things are harder to speed up! If you push a lightweight shopping cart, it speeds up quickly. If you push a heavy truck with the exact same force, it barely moves because it has more mass.",
        quiz: {
            question: "If you double the force on an object without changing its mass, what happens to acceleration?",
            options: [
                "It gets cut in half.",
                "It stays exactly the same.",
                "It doubles."
            ],
            correctIndex: 2,
            explanation: "Since Force = Mass × Acceleration, pushing twice as hard makes the object accelerate twice as fast!"
        }
    },
    {
        id: "topic-3",
        title: "Newton's Third Law (Action & Reaction)",
        description: "For every action force, there is an equal and opposite reaction force.",
        status: "lost",
        simpleExplanation: "Forces always come in pairs. When you push on a wall, the wall pushes back on your hands with equal force. That's how rockets work: they blast gas downwards, and the gas pushes the rocket upwards!",
        quiz: {
            question: "When a bug hits a bus windshield, which experiences a greater force?",
            options: [
                "The bug experiences a much larger force.",
                "Both experience the exact same amount of force.",
                "The bus experiences a much larger force."
            ],
            correctIndex: 1,
            explanation: "According to Newton's 3rd Law, the force is identical on both! The bug squashes more simply because it has vastly less mass."
        }
    }
];

// Mock aggregated data for Teacher View heatmap
const teacherStatsData = [
    { title: "Newton's First Law", lost: 15, fuzzy: 35, gotIt: 50 },
    { title: "Newton's Second Law", lost: 10, fuzzy: 20, gotIt: 70 },
    { title: "Newton's Third Law", lost: 45, fuzzy: 35, gotIt: 20 }
];

// ---------------------------------------------------------------------
// 2. DOM ELEMENT REFERENCES
// ---------------------------------------------------------------------
const btnStudentView = document.getElementById("btn-student-view");
const btnTeacherView = document.getElementById("btn-teacher-view");
const studentViewContainer = document.getElementById("student-view");
const teacherViewContainer = document.getElementById("teacher-view");

const topicsListContainer = document.getElementById("topics-list");
const teacherHeatmapContainer = document.getElementById("teacher-heatmap-container");

const explainerModal = document.getElementById("explainer-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalDoneBtn = document.getElementById("modal-done-btn");

// ---------------------------------------------------------------------
// 3. INITIALIZATION & EVENT LISTENERS
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    renderStudentTopics();
    renderTeacherHeatmap();
    setupRoleSwitcher();
    setupModalListeners();
});

// Role Switcher Setup (Toggle Student vs Teacher views)
function setupRoleSwitcher() {
    btnStudentView.addEventListener("click", () => {
        studentViewContainer.classList.remove("hidden");
        teacherViewContainer.classList.add("hidden");
        
        btnStudentView.className = "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-indigo-600 text-white shadow-md";
        btnTeacherView.className = "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-white";
    });

    btnTeacherView.addEventListener("click", () => {
        teacherViewContainer.classList.remove("hidden");
        studentViewContainer.classList.add("hidden");
        
        btnTeacherView.className = "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 bg-indigo-600 text-white shadow-md";
        btnStudentView.className = "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 text-slate-400 hover:text-white";
    });
}

// ---------------------------------------------------------------------
// 4. RENDER STUDENT VIEW TOPICS & QUIZZES
// ---------------------------------------------------------------------
function renderStudentTopics() {
    topicsListContainer.innerHTML = "";

    lessonData.forEach((topic) => {
        const card = document.createElement("div");
        card.className = "bg-slate-800 border border-slate-700 rounded-2xl p-6 topic-card space-y-4 animate-fade-in";

        // Generate status button color classes
        const getStatusClass = (statusType) => {
            if (topic.status === statusType) {
                if (statusType === "lost") return "bg-rose-500 text-white border-rose-500 shadow-md";
                if (statusType === "fuzzy") return "bg-amber-500 text-white border-amber-500 shadow-md";
                if (statusType === "got-it") return "bg-emerald-500 text-white border-emerald-500 shadow-md";
            }
            return "bg-slate-900/60 text-slate-400 border-slate-700 hover:border-slate-500";
        };

        card.innerHTML = `
            <!-- Topic Header -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 class="text-xl font-bold text-white">${topic.title}</h3>
                    <p class="text-sm text-slate-400 mt-1">${topic.description}</p>
                </div>

                <!-- Simple Explanation Button -->
                <button onclick="openExplainerModal('${topic.id}')" class="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold rounded-xl flex items-center gap-2 self-start md:self-auto transition">
                    <span>💡</span> Explain Simple
                </button>
            </div>

            <!-- Confidence Rating Buttons -->
            <div class="pt-2">
                <span class="text-xs text-slate-400 font-medium block mb-2">How well do you understand this right now?</span>
                <div class="grid grid-cols-3 gap-2 max-w-md">
                    <button onclick="updateTopicStatus('${topic.id}', 'lost')" class="px-3 py-2 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${getStatusClass('lost')}">
                        🔴 Lost
                    </button>
                    <button onclick="updateTopicStatus('${topic.id}', 'fuzzy')" class="px-3 py-2 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${getStatusClass('fuzzy')}">
                        🟡 A Bit Fuzzy
                    </button>
                    <button onclick="updateTopicStatus('${topic.id}', 'got-it')" class="px-3 py-2 border rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${getStatusClass('got-it')}">
                        🟢 Got It!
                    </button>
                </div>
            </div>

            <!-- Embedded Micro-Quiz -->
            <div class="mt-4 pt-4 border-t border-slate-700/60 bg-slate-900/50 p-4 rounded-xl space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-indigo-400 uppercase tracking-wider">Quick Understanding Check</span>
                </div>
                <p class="text-sm text-slate-200 font-medium">${topic.quiz.question}</p>
                
                <!-- Quiz Options -->
                <div class="space-y-2">
                    ${topic.quiz.options.map((option, index) => `
                        <button onclick="checkAnswer('${topic.id}',${index})" class="w-full text-left p-3 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 text-xs text-slate-300 transition">
                            ${option}
                        </button>
                    `).join('')}
                </div>

                <!-- Quiz Feedback Container -->
                <div id="quiz-feedback-${topic.id}" class="hidden p-3 rounded-lg text-xs leading-relaxed"></div>
            </div>
        `;

        topicsListContainer.appendChild(card);
    });
}

// Update topic status and re-render view
function updateTopicStatus(topicId, newStatus) {
    const topic = lessonData.find(t => t.id === topicId);
    if (topic) {
        topic.status = newStatus;
        renderStudentTopics();
    }
}

// Check quiz answer and show instant feedback
function checkAnswer(topicId, selectedIndex) {
    const topic = lessonData.find(t => t.id === topicId);
    const feedbackBox = document.getElementById(`quiz-feedback-${topicId}`);
    
    if (!topic || !feedbackBox) return;

    feedbackBox.classList.remove("hidden", "bg-emerald-950/50", "border-emerald-700", "text-emerald-300", "bg-rose-950/50", "border-rose-700", "text-rose-300");

    if (selectedIndex === topic.quiz.correctIndex) {
        feedbackBox.classList.add("bg-emerald-950/50", "border", "border-emerald-700", "text-emerald-300");
        feedbackBox.innerHTML = `<strong>✓ Correct!</strong> ${topic.quiz.explanation}`;
    } else {
        feedbackBox.classList.add("bg-rose-950/50", "border", "border-rose-700", "text-rose-300");
        feedbackBox.innerHTML = `<strong>✕ Not quite.</strong> ${topic.quiz.explanation}`;
    }
}

// ---------------------------------------------------------------------
// 5. EXPLAINER MODAL CONTROLLER
// ---------------------------------------------------------------------
function openExplainerModal(topicId) {
    const topic = lessonData.find(t => t.id === topicId);
    if (!topic) return;

    modalTitle.textContent = topic.title;
    modalBody.innerHTML = `
        <p class="font-medium text-slate-200">${topic.simpleExplanation}</p>
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-700/80 text-xs text-slate-400">
            📌 <strong>Key takeaway:</strong> Try explaining this concept in your own words to a classmate to make it stick!
        </div>
    `;

    explainerModal.classList.remove("hidden");
}

function setupModalListeners() {
    const closeModal = () => explainerModal.classList.add("hidden");
    
    modalCloseBtn.addEventListener("click", closeModal);
    modalDoneBtn.addEventListener("click", closeModal);
    
    // Close modal if user clicks on dark background backdrop
    explainerModal.addEventListener("click", (e) => {
        if (e.target === explainerModal) closeModal();
    });
}

// ---------------------------------------------------------------------
// 6. RENDER TEACHER HEATMAP VIEW
// ---------------------------------------------------------------------
function renderTeacherHeatmap() {
    teacherHeatmapContainer.innerHTML = "";

    teacherStatsData.forEach((stat) => {
        const item = document.createElement("div");
        item.className = "bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-2";

        item.innerHTML = `
            <div class="flex justify-between items-center text-sm font-semibold text-white">
                <span>${stat.title}</span>
                <span class="text-xs text-slate-400">${stat.gotIt}% Prepared</span>
            </div>

            <!-- Heatmap Progress Bar -->
            <div class="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style="width: ${stat.gotIt}%" class="bg-emerald-500 h-full" title="${stat.gotIt}% Got It"></div>
                <div style="width: ${stat.fuzzy}%" class="bg-amber-500 h-full" title="${stat.fuzzy}% Fuzzy"></div>
                <div style="width: ${stat.lost}%" class="bg-rose-500 h-full" title="${stat.lost}% Lost"></div>
            </div>

            <!-- Legend breakdown percentages -->
            <div class="flex justify-between text-xs text-slate-400 pt-1">
                <span class="text-emerald-400">🟢 Got It: ${stat.gotIt}%</span>
                <span class="text-amber-400">🟡 Fuzzy: ${stat.fuzzy}%</span>
                <span class="text-rose-400">🔴 Lost: ${stat.lost}%</span>
            </div>
        `;

        teacherHeatmapContainer.appendChild(item);
    });
}
