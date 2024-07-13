document.addEventListener('DOMContentLoaded', () => {
    let tasks = [];
    let interval; // Variable to hold setInterval reference
    let startTime; // Variable to hold task start time

    // Modal and element references
    const modal = document.getElementById('taskModal');
    const btnOpenModal = document.getElementById('openModal');
    const spanCloseModal = document.getElementsByClassName('close')[0];
    const taskTypeSelect = document.getElementById('taskType');
    const timerSetupDiv = document.getElementById('timerSetup');
    const stopwatchDiv = document.getElementById('stopwatch');
    const timerDiv = document.getElementById('timer');

    // Universe random facts card element
    const universeCard = document.querySelector('.card1');

    // Initially hide timer setup, timer, and stopwatch
    timerSetupDiv.classList.add('hidden');
    stopwatchDiv.classList.add('hidden');
    timerDiv.classList.add('hidden');

    // Event listeners for modal interactions
    btnOpenModal.addEventListener('click', () => {
        $('#taskModal').modal('show');
        timerSetupDiv.classList.add('hidden'); // Hide timer setup on modal open
    });

    spanCloseModal.addEventListener('click', () => {
        $('#taskModal').modal('hide');
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            $('#taskModal').modal('hide');
        }
    });

    // Handle task type selection in modal
    taskTypeSelect.addEventListener('change', () => {
        const selectedType = taskTypeSelect.value;

        if (selectedType === 'timer') {
            timerSetupDiv.classList.remove('hidden'); // Show timer setup inputs
        } else {
            timerSetupDiv.classList.add('hidden'); // Hide timer setup inputs
        }
    });

    // Add Task Button functionality
    document.getElementById('addTask').addEventListener('click', () => {
        const taskName = document.getElementById('taskName').value;
        const taskType = document.getElementById('taskType').value;

        if (taskName.trim() === '') {
            alert('Please enter a task name.');
            return;
        }

        if (taskType === 'stopwatch') {
            document.getElementById('taskNameDisplay').textContent = taskName;
            showStopwatch();
        } else if (taskType === 'timer') {
            const hours = parseInt(document.getElementById('timerHours').value) || 0;
            const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
            const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;

            if (hours === 0 && minutes === 0 && seconds === 0) {
                alert('Please set a valid timer duration.');
                return;
            }

            document.getElementById('taskNameDisplayTimer').textContent = taskName;
            showTimer(hours, minutes, seconds);
        }

        tasks.push({
            name: taskName,
            type: taskType,
            startTime: new Date().toLocaleString(),
            endTime: ''
        });

        updateTaskHistory();

        $('#taskModal').modal('hide');
        document.getElementById('taskName').value = '';
        resetTimerInputs();
    });

    // Stopwatch functions
    function showStopwatch() {
        stopwatchDiv.classList.remove('hidden');
        timerDiv.classList.add('hidden');
        resetStopwatch();
    }

    function startStopwatch() {
        startTime = new Date(); // Record start time

        interval = setInterval(() => {
            const currentTime = new Date() - startTime;
            let milliseconds = Math.floor((currentTime % 1000) / 10);
            let seconds = Math.floor((currentTime / 1000) % 60);
            let minutes = Math.floor((currentTime / (1000 * 60)) % 60);

            document.getElementById('milliseconds').textContent = String(milliseconds).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        }, 10);

        document.getElementById('start').disabled = true;
    }

    function stopStopwatch() {
        clearInterval(interval);
        document.getElementById('start').disabled = false;

        const endTime = new Date().toLocaleString();
        tasks[tasks.length - 1].endTime = endTime;

        updateTaskHistory();
    }

    function resetStopwatch() {
        clearInterval(interval);
        document.getElementById('start').disabled = false;
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        document.getElementById('milliseconds').textContent = '00';
    }

    document.getElementById('start').addEventListener('click', startStopwatch);
    document.getElementById('stop').addEventListener('click', stopStopwatch);
    document.getElementById('reset').addEventListener('click', resetStopwatch);

    // Timer functions
    function showTimer(hours, minutes, seconds) {
        timerDiv.classList.remove('hidden'); // Ensure timer display is shown
        stopwatchDiv.classList.add('hidden'); // Hide stopwatch display if necessary
        resetTimer();
        startTimer(hours, minutes, seconds);
    }

    function startTimer(hours, minutes, seconds) {
        interval = setInterval(() => {
            if (hours === 0 && minutes === 0 && seconds === 0) {
                clearInterval(interval);
                timerFinished();
            } else {
                seconds--;
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;
                    if (minutes < 0) {
                        minutes = 59;
                        hours--;
                    }
                }

                document.getElementById('timerHoursDisplay').textContent = String(hours).padStart(2, '0');
                document.getElementById('timerMinutesDisplay').textContent = String(minutes).padStart(2, '0');
                document.getElementById('timerSecondsDisplay').textContent = String(seconds).padStart(2, '0');
            }
        }, 1000);

        document.getElementById('timerStart').disabled = true;
    }

    function stopTimer() {
        clearInterval(interval);

        const endTime = new Date().toLocaleString();
        tasks[tasks.length - 1].endTime = endTime;

        updateTaskHistory();
    }

    function resetTimer() {
        clearInterval(interval);
        document.getElementById('timerStart').disabled = false;
        document.getElementById('timerHoursDisplay').textContent = '00';
        document.getElementById('timerMinutesDisplay').textContent = '00';
        document.getElementById('timerSecondsDisplay').textContent = '00';
    }

    function timerFinished() {
        alert('Timer Finished!');
        const endTime = new Date().toLocaleString();
        tasks[tasks.length - 1].endTime = endTime;
        updateTaskHistory();
    }

    document.getElementById('timerStart').addEventListener('click', () => {
        const hours = parseInt(document.getElementById('timerHours').value) || 0;
        const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
        const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
        startTimer(hours, minutes, seconds);
    });

    document.getElementById('timerStop').addEventListener('click', stopTimer);
    document.getElementById('timerReset').addEventListener('click', resetTimer);

    // Task history update
    function updateTaskHistory() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            const startTime = task.startTime;
            const endTime = task.endTime !== '' ? task.endTime : 'In Progress';
            li.textContent = `${task.name} (${task.type}) - Started at: ${startTime}, Ended at: ${endTime}`;
            taskList.appendChild(li);
        });
    }

    // Utility function to reset timer inputs
    function resetTimerInputs() {
        document.getElementById('timerHours').value = '';
        document.getElementById('timerMinutes').value = '';
        document.getElementById('timerSeconds').value = '';
    }

    // Update time and date for the universe card
    function updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format and handle 0 as 12
        const formattedMinutes = String(minutes).padStart(2, '0'); // Add leading zero if needed

        const timeString = `${formattedHours}:${formattedMinutes}`;
        document.getElementById('time').textContent = timeString;
        document.getElementById('ampm').textContent = ampm;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', options);
        document.getElementById('date').textContent = dateString;
    }

    setInterval(updateTime, 1000); // Update every second
    updateTime(); // Initial call to set time immediately

    // Random fun facts functionality
    const funFacts = [
        "The universe is 13.8 billion years old.",
        "A day on Venus is longer than a year on Venus.",
        "A shrimp's heart is in its head.",
         "Rubber bands last longer when refrigerated.",
         "An ostrich's eye is bigger than its brain.",
         "Most people fall asleep in seven minutes.",
        "The light emitted from some stars takes millions of years to reach Earth.",
        "A shark is the only known fish that can blink with both eyes."
    ];

    function displayRandomFunFact() {
        const randomIndex = Math.floor(Math.random() * funFacts.length);
        universeCard.textContent = funFacts[randomIndex];
    }

    universeCard.addEventListener('mouseenter', displayRandomFunFact);
});
