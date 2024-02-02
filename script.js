document.getElementById('addExercise').addEventListener('click', function() {
    const container = document.getElementById('exercisesContainer');
    container.appendChild(createExerciseEntry());
});

document.getElementById('workoutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const workout = getWorkoutData();
    addWorkoutLog(workout);
    displayWorkouts();
    clearForm();
});

function createExerciseEntry(data = {}) {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.className = 'exercise';

    exerciseDiv.innerHTML = `
        <input type="text" class="exerciseName" placeholder="Exercise Name" value="${data.name || ''}" required>
        <input type="number" class="sets" placeholder="Sets" value="${data.sets || ''}" required>
        <input type="number" class="reps" placeholder="Reps" value="${data.reps || ''}" required>
        <input type="number" class="weight" placeholder="Weight (lbs/kg)" value="${data.weight || ''}" required>
        <select class="exerciseType">
            <option value="regular" ${data.type === 'regular' ? 'selected' : ''}>Regular</option>
            <option value="myoreps" ${data.type === 'myoreps' ? 'selected' : ''}>Myo-reps</option>
        </select>
    `;
    return exerciseDiv;
}

function getWorkoutData() {
    const workoutDate = document.getElementById('workoutDate').value;
    const exercises = Array.from(document.getElementsByClassName('exercise')).map(exerciseDiv => ({
        name: exerciseDiv.querySelector('.exerciseName').value,
        sets: exerciseDiv.querySelector('.sets').value,
        reps: exerciseDiv.querySelector('.reps').value,
        weight: exerciseDiv.querySelector('.weight').value,
        type: exerciseDiv.querySelector('.exerciseType').value
    }));
    return { date: workoutDate, exercises: exercises };
}

function addWorkoutLog(workout) {
    const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
}

function displayWorkouts() {
    const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    const workoutLogsDiv = document.getElementById('workoutLogs');
    workoutLogsDiv.innerHTML = '<table id="workoutTable"><tr><th>Date</th><th>Exercise</th><th>Sets</th><th>Reps</th><th>Weight</th><th>Type</th></tr></table>';

    const workoutTable = document.getElementById('workoutTable');
    workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
            const row = workoutTable.insertRow();
            row.innerHTML = `
                <td>${workout.date}</td>
                <td>${exercise.name}</td>
                <td>${exercise.sets}</td>
                <td>${exercise.reps}</td>
                <td>${exercise.weight}</td>
                <td>${exercise.type}</td>
            `;
        });
    });
}

function clearForm() {
    document.getElementById('workoutDate').value = '';
    const exercisesContainer = document.getElementById('exercisesContainer');
    exercisesContainer.innerHTML = '';
    exercisesContainer.appendChild(createExerciseEntry()); // Add a blank exercise entry
}

function exportWorkoutsToCSV() {
    const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    let csvContent = "data:text/csv;charset=utf-8,Date,Exercise,Sets,Reps,Weight,Type\n";

    workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
            let row = `${workout.date},${exercise.name},${exercise.sets},${exercise.reps},${exercise.weight},${exercise.type}`;
            csvContent += row + "\n";
        });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "workout_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

displayWorkouts();
