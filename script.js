<script>
        // -------------------------------------------------------------------
        // 3.1 APPLICATION STATE STORE
        // Stores all lesson data, student self-ratings, and quiz questions.
        // -------------------------------------------------------------------
        const state = {
            currentRole: 'student', // 'student' or 'teacher'
            
            topics: [
                {
                    id: 'kinematics',
                    title: 'Kinematics & Speed',
                    description: 'Understanding position, velocity, and how objects move over time.',
                    status: null, // 'got_it', 'fuzzy', or 'lost'
                    analogy: "Think of Kinematics like recording a race on your phone camera. Velocity is how fast you run, and acceleration is how hard you step on the gas pedal!",
                    keypoints: [
                        'Speed is distance divided by time.',
                        'Velocity is speed PLUS a direction (e.g., 50 mph North).',
                        'Acceleration happens whenever velocity changes.'
                    ],
                    teacherStats: { got_it: 65, fuzzy: 25, lost: 10 },
                    questions: [
                        {
                            q: "What is the key difference between speed and velocity?",
                            options: [
                                "Velocity is always faster than speed",
                                "Velocity includes direction, while speed does not",
                                "Speed uses meters, velocity uses miles",
                                "There is no difference"
                            ],
                            correct: 1,
                            explanation: "Correct! Velocity includes both how fast an object moves AND where it is heading."
                        },
                        {
                            q: "If a car moves at a constant 60 mph in a circle, is it accelerating?",
                            options: [
                                "No, because the speed is constant",
                                "Yes, because its direction is constantly changing",
                                "No, because it moves smoothly",
                                "Yes, but only when braking"
                            ],
                            correct: 1,
                            explanation: "Yes! Acceleration occurs whenever speed OR direction changes."
                        },
                        {
                            q: "What is the formula for average speed?",
                            options: [
                                "Speed = Distance × Time",
                                "Speed = Mass / Acceleration",
                                "Speed = Distance / Time",
                                "Speed = Time / Distance"
                            ],
                            correct: 2,
                            explanation: "Distance divided by Time gives speed (e.g., 60 miles / 1 hour = 60 mph)."
                        }
                    ]
                },
                {
                    id: 'freefall',
                    title: 'Free Fall & Gravity',
                    description: 'How Earth gravity accelerates falling objects at 9.8 m/s².',
                    status: null,
                    analogy: "Imagine throwing a basketball up. It slows down climbing up, stops for a split second at the top, then zooms faster and faster on the way down because gravity won't stop pulling it!",
                    keypoints: [
                        'Earth gravity accelerates all falling objects at ~9.8 m/s².',
                        'In a vacuum with no air, a feather and a rock fall at the exact same speed.',
                        'At the exact peak of a vertical throw, velocity is 0 m/s.'
                    ],
                    teacherStats: { got_it: 20, fuzzy: 35, lost: 45 },
                    questions: [
                        {
                            q: "What is gravitational acceleration near Earth's surface?",
                            options: ["5.0 m/s²", "9.8 m/s²", "15.2 m/s²", "100 m/s²"],
                            correct: 1,
                            explanation: "Earth gravity accelerates falling objects at approximately 9.8 meters per second squared."
                        },
                        {
                            q: "What is a ball's velocity at the highest point of a vertical throw?",
                            options: ["9.8 m/s", "Maximum speed", "0 m/s", "-9.8 m/s"],
                            correct: 2,
                            explanation: "At the peak height, the ball stops ascending before turning downward, making velocity 0 m/s."
                        },
                        {
                            q: "In a vacuum (no air resistance), which falls faster?",
                            options: [
                                "A heavy rock",
                                "A light feather",
                                "Both fall at the exact same speed",
                                "Neither falls"
                            ],
                            correct: 2,
                            explanation: "Without air drag, gravity pulls all masses with the exact same acceleration!"
                        }
                    ]
                },
                {
                    id: 'newton_laws',
                    title: "Newton's Laws of Motion",
                    description: 'The 3 universal laws governing force, mass, and reaction.',
                    status: null,
                    analogy: "1st Law: You stay on the couch unless pushed. 2nd Law: Pushing an empty shopping cart is easy; pushing a heavy car takes way more force! 3rd Law: Trampolines push back up when you jump on them.",
                    keypoints: [
                        '1st Law (Inertia): Objects keep moving unless acted upon by an outside force.',
                        '2nd Law (F = m × a): Force equals Mass times Acceleration.',
                        '3rd Law: For every action, there is an equal and opposite reaction.'
                    ],
                    teacherStats: { got_it: 60, fuzzy: 25, lost: 15 },
                    questions: [
                        {
                            q: "Which law explains why seatbelts stop you when a car brakes suddenly?",
                            options: [
                                "Newton's 1st Law (Inertia)",
                                "Newton's 2nd Law (F=ma)",
                                "Newton's 3rd Law (Action/Reaction)",
                                "Law of Friction"
                            ],
                            correct: 0,
                            explanation: "First Law! Your body wants to keep moving forward until an external force (seatbelt) stops it."
                        },
                        {
                            q: "If you push against a solid brick wall, what force does the wall exert on you?",
                            options: [
                                "No force",
                                "Half your force",
                                "An equal force in the opposite direction",
                                "Double your force"
                            ],
                            correct: 2,
                            explanation: "Third Law! Action and reaction forces are always equal and opposite."
                        },
                        {
                            q: "If you double the mass of an object (F=ma), how much force is needed for the same acceleration?",
                            options: ["Half force", "Double force", "Four times force", "Same force"],
                            correct: 1,
                            explanation: "Because Force and Mass are directly proportional, doubling mass requires double the force."
                        }
                    ]
                }
            ],

            // Active Quiz State variables
            activeQuizTopicId: null,
            currentQuestionIndex: 0,
            selectedOption: null,
            isAnswerSubmitted: false
        };

        // -------------------------------------------------------------------
        // 3.2 INITIALIZATION
        // Runs on initial page load to render topic cards and analytics.
        // -------------------------------------------------------------------
        document.addEventListener('DOMContentLoaded', () => {
            renderTopicCards();
            renderTeacherAnalytics();
        });

        // -------------------------------------------------------------------
        // 3.3 ROLE SWITCHING LOGIC (STUDENT <-> TEACHER)
        // -------------------------------------------------------------------
        function switchRole(role) {
            state.currentRole = role;
            const studentView = document.getElementById('student-view');
            const teacherView = document.getElementById('teacher-view');
            const btnStudent = document.getElementById('btn-student-view');
            const btnTeacher = document.getElementById('btn-teacher-view');
            const roleBadge = document.getElementById('role-badge');

            if (role === 'student') {
                studentView.classList.remove('hidden');
                teacherView.classList.add('hidden');
                roleBadge.innerText = 'Student Mode';
                
                btnStudent.className = "px-4 py-1.5 rounded-lg text-sm font-medium transition-all-custom bg-indigo-600 text-white shadow";
                btnTeacher.className = "px-4 py-1.5 rounded-lg text-sm font-medium transition-all-custom text-slate-400 hover:text-white";
            } else {
                studentView.classList.add('hidden');
                teacherView.classList.remove('hidden');
                roleBadge.innerText = 'Teacher Mode';

                btnTeacher.className = "px-4 py-1.5 rounded-lg text-sm font-medium transition-all-custom bg-indigo-600 text-white shadow";
                btnStudent.className = "px-4 py-1.5 rounded-lg text-sm font-medium transition-all-custom text-slate-400 hover:text-white";

                renderTeacherAnalytics(); // Refresh bars
            }
        }

        // -------------------------------------------------------------------
        // 3.4 STUDENT DASHBOARD & TOPIC RATING
        // Render cards & handle confidence check-in clicks ("Got It", "Fuzzy", "Lost")
        // -------------------------------------------------------------------
        function renderTopicCards() {
            const container = document.getElementById('topics-list');
            container.innerHTML = '';

            state.topics.forEach(topic => {
                // Determine current status badge styling
                let statusBadge = `<span class="bg-slate-700/60 text-slate-400 text-xs px-2.5 py-1 rounded-full font-medium">Not Rated</span>`;
                
                if (topic.status === 'got_it') {
                    statusBadge = `<span class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-medium">🟢 Got It!</span>`;
                } else if (topic.status === 'fuzzy') {
                    statusBadge = `<span class="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-medium">🟡 A Bit Fuzzy</span>`;
                } else if (topic.status === 'lost') {
                    statusBadge = `<span class="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs px-2.5 py-1 rounded-full font-medium">🔴 Totally Lost</span>`;
                }

                const card = document.createElement('div');
                card.className = "bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover-card-lift transition-all-custom space-y-4";
                
                card.innerHTML = `
                    <div class="space-y-2">
                        <div class="flex justify-between items-start gap-2">
                            <h4 class="text-base font-bold text-white">${topic.title}</h4>
                            ${statusBadge}
                        </div>
                        <p class="text-xs text-slate-400 leading-relaxed">${topic.description}</p>
                    </div>

                    <!-- Interactive Rating Buttons -->
                    <div class="space-y-1.5">
                        <p class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Your Confidence:</p>
                        <div class="grid grid-cols-3 gap-1.5">
                            <button onclick="setTopicStatus('${topic.id}', 'got_it')" 
                                class="py-1.5 px-1 rounded-lg text-xs font-semibold border transition-all-custom flex items-center justify-center gap-1
                                ${topic.status === 'got_it' ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30' : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-emerald-500/50'}">
                                🟢 Got It
                            </button>
                            <button onclick="setTopicStatus('${topic.id}', 'fuzzy')" 
                                class="py-1.5 px-1 rounded-lg text-xs font-semibold border transition-all-custom flex items-center justify-center gap-1
                                ${topic.status === 'fuzzy' ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30' : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-amber-500/50'}">
                                🟡 Fuzzy
                            </button>
                            <button onclick="setTopicStatus('${topic.id}', 'lost')" 
                                class="py-1.5 px-1 rounded-lg text-xs font-semibold border transition-all-custom flex items-center justify-center gap-1
                                ${topic.status === 'lost' ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30' : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-rose-500/50'}">
                                🔴 Lost
                            </button>
                        </div>
                    </div>

                    <!-- Action Links -->
                    <div class="flex items-center justify-between pt-3 border-t border-slate-700/60">
                        <button onclick="openExplainModal('${topic.id}')" class="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1.5 transition-colors">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> Explain Simple
                        </button>
                        <button onclick="startQuiz('${topic.id}')" class="text-xs bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 px-3 py-1.5 rounded-lg font-medium transition-all-custom flex items-center gap-1">
                            <i class="fa-solid fa-pen-to-square"></i> Take Quiz
                        </button>
                    </div>
                `;

                container.appendChild(card);
            });
        }

        function setTopicStatus(topicId, status) {
            const topic = state.topics.find(t => t.id === topicId);
            if (topic) {
                topic.status = status;
                renderTopicCards();
            }
        }

        // -------------------------------------------------------------------
        // 3.5 "EXPLAIN IT SIMPLE" MODAL LOGIC
        // Populates analogies and key takeaways for struggling students.
        // -------------------------------------------------------------------
        function openExplainModal(topicId) {
            const topic = state.topics.find(t => t.id === topicId);
            if (!topic) return;

            document.getElementById('modal-topic-title').innerText = topic.title;
            document.getElementById('modal-analogy').innerText = topic.analogy;

            const keypointsList = document.getElementById('modal-keypoints');
            keypointsList.innerHTML = '';
            topic.keypoints.forEach(point => {
                const li = document.createElement('li');
                li.innerText = point;
                keypointsList.appendChild(li);
            });

            document.getElementById('explain-modal').classList.remove('hidden');
        }

        function closeExplainModal() {
            document.getElementById('explain-modal').classList.add('hidden');
        }

        // -------------------------------------------------------------------
        // 3.6 INTERACTIVE MICRO-QUIZ ENGINE
        // Handles question stepping, option selection, feedback & scoring.
        // -------------------------------------------------------------------
        function startQuiz(topicId) {
            state.activeQuizTopicId = topicId;
            state.currentQuestionIndex = 0;
            state.selectedOption = null;
            state.isAnswerSubmitted = false;

            document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });
            renderQuizCard();
        }

        function renderQuizCard() {
            const container = document.getElementById('quiz-container');
            const topic = state.topics.find(t => t.id === state.activeQuizTopicId);

            if (!topic) return;

            // Update Header Title & Progress
            document.getElementById('quiz-title').innerText = `${topic.title} Quiz`;
            document.getElementById('quiz-progress').innerText = `Question ${state.currentQuestionIndex + 1} of ${topic.questions.length}`;

            const currentQ = topic.questions[state.currentQuestionIndex];

            // Render Multiple Choice Buttons
            let optionsHTML = '';
            currentQ.options.forEach((opt, idx) => {
                let btnStyle = "bg-slate-900 border-slate-700 text-slate-200 hover:border-indigo-500/50";
                
                if (state.isAnswerSubmitted) {
                    if (idx === currentQ.correct) {
                        btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold";
                    } else if (idx === state.selectedOption) {
                        btnStyle = "bg-rose-950/70 border-rose-500 text-rose-200 font-semibold";
                    } else {
                        btnStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-40";
                    }
                } else if (state.selectedOption === idx) {
                    btnStyle = "bg-indigo-900/50 border-indigo-500 text-indigo-200 font-semibold shadow-md shadow-indigo-500/20";
                }

                optionsHTML += `
                    <button 
                        onclick="selectQuizOption(${idx})" 
                        ${state.isAnswerSubmitted ? 'disabled' : ''}
                        class="w-full text-left p-3.5 rounded-xl border ${btnStyle} transition-all-custom text-sm flex items-center justify-between">
                        <span>${opt}</span>
                        ${state.isAnswerSubmitted && idx === currentQ.correct ? '<i class="fa-solid fa-circle-check text-emerald-400 text-lg"></i>' : ''}
                        ${state.isAnswerSubmitted && idx === state.selectedOption && idx !== currentQ.correct ? '<i class="fa-solid fa-circle-xmark text-rose-400 text-lg"></i>' : ''}
                    </button>
                `;
            });

            // Instant Feedback Box
            let feedbackHTML = '';
            if (state.isAnswerSubmitted) {
                const isCorrect = state.selectedOption === currentQ.correct;
                feedbackHTML = `
                    <div class="p-4 rounded-xl border ${isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/30 border-rose-500/40 text-rose-200'} space-y-1 fade-in">
                        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}">
                            <i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i>
                            ${isCorrect ? 'Correct Answer!' : 'Concept Check Needed'}
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed">${currentQ.explanation}</p>
                    </div>
                `;
            }

            // Navigation Button
            let actionBtnHTML = '';
            if (!state.isAnswerSubmitted) {
                actionBtnHTML = `
                    <button onclick="submitQuizAnswer()" 
                        ${state.selectedOption === null ? 'disabled class="w-full bg-slate-700/50 text-slate-500 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed"' : 'class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium transition-all-custom shadow-lg shadow-indigo-600/30"'}>
                        Submit Answer
                    </button>
                `;
            } else {
                const isLast = state.currentQuestionIndex >= topic.questions.length - 1;
                actionBtnHTML = `
                    <button onclick="${isLast ? 'finishQuiz()' : 'nextQuizQuestion()'}" 
                        class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium transition-all-custom shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
                        ${isLast ? 'Complete Quiz 🎉' : 'Next Question <i class="fa-solid fa-arrow-right"></i>'}
                    </button>
                `;
            }

            container.innerHTML = `
                <div class="space-y-4 fade-in">
                    <h4 class="text-base font-semibold text-white">${currentQ.q}</h4>
                    <div class="space-y-2.5">
                        ${optionsHTML}
                    </div>
                    ${feedbackHTML}
                    <div class="pt-2">
                        ${actionBtnHTML}
                    </div>
                </div>
            `;
        }

        function selectQuizOption(index) {
            state.selectedOption = index;
            renderQuizCard();
        }

        function submitQuizAnswer() {
            if (state.selectedOption === null) return;
            state.isAnswerSubmitted = true;
            renderQuizCard();
        }

        function nextQuizQuestion() {
            state.currentQuestionIndex++;
            state.selectedOption = null;
            state.isAnswerSubmitted = false;
            renderQuizCard();
        }

        function finishQuiz() {
            const container = document.getElementById('quiz-container');
            container.innerHTML = `
                <div class="text-center py-8 space-y-4 fade-in">
                    <div class="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl border border-emerald-500/30">
                        <i class="fa-solid fa-trophy"></i>
                    </div>
                    <div>
                        <h4 class="text-xl font-bold text-white">Micro-Quiz Completed!</h4>
                        <p class="text-xs text-slate-400 mt-1">Great job reinforcing your understanding of this topic.</p>
                    </div>
                    <button onclick="startQuiz('${state.activeQuizTopicId}')" class="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-xl text-xs font-medium transition-all-custom">
                        Retake Quiz
                    </button>
                </div>
            `;
        }

        // -------------------------------------------------------------------
        // 3.7 TEACHER HEATMAP ANALYTICS
        // Generates class-wide understanding distribution bars.
        // -------------------------------------------------------------------
        function renderTeacherAnalytics() {
            const container = document.getElementById('teacher-heatmap-container');
            container.innerHTML = '';

            state.topics.forEach(topic => {
                const stats = topic.teacherStats;

                const heatmapItem = document.createElement('div');
                heatmapItem.className = "space-y-2";
                heatmapItem.innerHTML = `
                    <div class="flex justify-between items-center text-sm">
                        <span class="font-semibold text-white">${topic.title}</span>
                        <span class="text-xs text-slate-400">Class Responses</span>
                    </div>

                    <!-- Multi-color Progress Heatmap -->
                    <div class="w-full h-4 bg-slate-900 rounded-full overflow-hidden flex border border-slate-700/60">
                        <div style="width: ${stats.got_it}%" class="bg-emerald-500 h-full transition-all" title="${stats.got_it}% Got It"></div>
                        <div style="width: ${stats.fuzzy}%" class="bg-amber-500 h-full transition-all" title="${stats.fuzzy}% Fuzzy"></div>
                        <div style="width: ${stats.lost}%" class="bg-rose-500 h-full transition-all" title="${stats.lost}% Lost"></div>
                    </div>

                    <!-- Legend & Distribution Numbers -->
                    <div class="flex items-center justify-between text-xs text-slate-400">
                        <div class="flex gap-4">
                            <span class="flex items-center gap-1.5">
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Got It: <strong class="text-white">${stats.got_it}%</strong>
                            </span>
                            <span class="flex items-center gap-1.5">
                                <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Fuzzy: <strong class="text-white">${stats.fuzzy}%</strong>
                            </span>
                            <span class="flex items-center gap-1.5">
                                <span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Lost: <strong class="text-white">${stats.lost}%</strong>
                            </span>
                        </div>
                    </div>
                `;

                container.appendChild(heatmapItem);
            });
        }
    </script>
</body>
</html>
