
 let semesterCount = 0;

  // Add event listeners to all inputs and selects in a semester's course row
  function attachInputListeners(row) {
    row.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', () => recalculate());
      el.addEventListener('change', () => recalculate());
    });
  }
function addSemester() {
  semesterCount++;
  const semesterDiv = document.createElement("div");
  semesterDiv.className = "semester";
  semesterDiv.dataset.semester = semesterCount;
  semesterDiv.innerHTML = `
  <div style="margin-top: 8px;" class="container" semesterNG>
  <details>
    <summary>Semester ${semesterCount} <button id="deleteBtn" class="btn" onclick="deleteSemester(this)">Delete Semester</button></summary>
    <div class="semester-title">
      <div class="btn-wrap">
        <button id="addcourseBtn" class="btn" onclick="addCourse(this)"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>Add Course</button>
        <button class="btn" onclick="clearCourses(this)">Clear All Courses</button>
<!--button was here -->
      </div>
    </div>

    <!-- Table-like header -->
    <div class="course-header">
      <span>Course</span>
      <span>Grade</span>
      <span>Credits</span>
      <span></span> <!-- For delete button space -->
    </div>

    <div class="courses"></div>
    <div class="gpa-display">Semester GPA: <span class="semester-gpa">0.00</span></div>
  </details>`;
  document.getElementById("semestersContainer").appendChild(semesterDiv);
}
  /*function addSemester() {
    semesterCount++;
    const semesterDiv = document.createElement("div");
    semesterDiv.className = "semester";
    semesterDiv.dataset.semester = semesterCount;
    semesterDiv.innerHTML = `
      <div class="semester-title">
        <h3>Semester ${semesterCount}</h3>
        <div class="btn-wrap">
          <button class="btn" onclick="addCourse(this)">Add Course</button>
          <button class="btn" onclick="clearCourses(this)">Clear All</button>
          <button id="deleteBtn" class="btn" onclick="deleteSemester(this)">Delete Semester</button>
        </div>
      </div>
      <div class="courses"></div>
      <div class="gpa-display">Semester GPA: <span class="semester-gpa">0.00</span></div>
    `;
    document.getElementById("semestersContainer").appendChild(semesterDiv);
  }*/

  function deleteSemester(btn) {
    const sem = btn.closest(".semester");
    sem.remove();
    recalculate();
  }

  function addCourse(btn) {
    const courseDiv = document.createElement("div");
    courseDiv.className = "course-row";
    courseDiv.innerHTML = `
  
  
      <input type="text" placeholder="Course Name">
      <select>
        <option value="5">A</option>
        <option value="4">B</option>
        <option value="3">C</option>
        <option value="2">D</option>
        <option value="1">E</option>
        <option value="0">F</option>
      </select>
      <input type="number" min="0" >
      <button class="delete-course"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
      
    `;
    btn.closest(".semester").querySelector(".courses").appendChild(courseDiv);

    // Attach listeners for new inputs and delete button
    attachInputListeners(courseDiv);
    courseDiv.querySelector('button.delete-course').addEventListener('click', () => {
      courseDiv.remove();
      recalculate();
    });

    recalculate();
  }

  function clearCourses(btn) {
    const sem = btn.closest(".semester");
    sem.querySelector(".courses").innerHTML = "";
    sem.querySelector(".semester-gpa").textContent = "0.00";
    recalculate();
  }

  function recalculate() {
    const semesters = document.querySelectorAll(".semester");
    let totalPoints = 0, totalUnits = 0;

    semesters.forEach(sem => {
      let semPoints = 0, semUnits = 0;
      const courses = sem.querySelectorAll(".course-row");
      courses.forEach(row => {
        const grade = parseFloat(row.querySelector("select").value);
        const units = parseFloat(row.querySelector("input[type='number']").value);
        if (!isNaN(units)) {
          semPoints += grade * units;
          semUnits += units;
        }
      });

      const gpa = semUnits ? (semPoints / semUnits).toFixed(2) : "0.00";
      sem.querySelector(".semester-gpa").textContent = gpa;

      totalPoints += semPoints;
      totalUnits += semUnits;
    });

    const cgpa = totalUnits ? (totalPoints / totalUnits).toFixed(2) : "0.00";
    document.getElementById("cgpaDisplay").textContent = cgpa;
    document.getElementById("totalUnits").textContent = totalUnits;

    const percent = Math.min((cgpa / 5) * 100, 100);
    const circle = document.getElementById("progressCircle");
    animateCircle(circle, percent);

    saveToLocalStorage();
  }

  // Animate circle progress bar
  function animateCircle(circle, targetPercent) {
    let currentPercent = parseFloat(circle.style.getPropertyValue('--percent')) || 0;
    currentPercent = parseFloat(currentPercent);
    let start = currentPercent;
    let end = targetPercent;
    const duration = 800;
    const startTime = performance.now();

    function animate(time) {
      let elapsed = time - startTime;
      if (elapsed > duration) elapsed = duration;
      const progress = start + (end - start) * (elapsed / duration);
      circle.style.setProperty('--percent', progress + '%');
      circle.textContent = (progress * 5 / 100).toFixed(2);

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }

  // Save all semesters and courses to localStorage
  function saveToLocalStorage() {
    const semesters = document.querySelectorAll(".semester");
    const data = Array.from(semesters).map(sem => {
      const courses = sem.querySelectorAll(".course-row");
      return {
        courses: Array.from(courses).map(row => ({
          name: row.querySelector("input[type=text]").value,
          grade: parseFloat(row.querySelector("select").value),
          credits: parseFloat(row.querySelector("input[type=number]").value)
        }))
      };
    });
    localStorage.setItem("cgpa_data", JSON.stringify(data));
  }

  // Load from localStorage on page load
  window.onload = () => {
    const savedData = localStorage.getItem("cgpa_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      parsed.forEach(sem => {
        addSemester();
        const semesters = document.querySelectorAll(".semester");
        const semester = semesters[semesters.length - 1];
        sem.courses.forEach(course => {
          const addCourseBtn = semester.querySelector("button.btn");
          addCourse(addCourseBtn);
          const courseRows = semester.querySelectorAll(".course-row");
          const lastRow = courseRows[courseRows.length - 1];
          lastRow.querySelector("input[type=text]").value = course.name;
          lastRow.querySelector("select").value = course.grade;
          lastRow.querySelector("input[type=number]").value = course.credits;
        });
      });
      recalculate();
    }
  };
