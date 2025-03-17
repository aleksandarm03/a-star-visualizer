import { useEffect, useRef, useState } from "react";

// Funkcija za računanje Manhattan distance između dve tačke
const manhattanDistance = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

// Funkcija za računanje Euclidean distance između dve tačke
const euclideanDistance = (a, b) => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));

// Funkcija za računanje Chebyshev distance između dve tačke
const chebyshevDistance = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));

// Funkcija za računanje Diagonal distance između dve tačke
const diagonalDistance = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) - Math.min(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));

const heuristicDescriptions = {
  manhattan: "Manhattan heuristika se računa kao zbir apsolutnih razlika koordinata dve tačke na mreži, idealna za sisteme gde je kretanje ograničeno na horizontalno/vertikalno pomeranje. Nazvana po pravougaonoj strukturi ulica Njujorka, efikasno ocenjuje udaljenost u grid-based okruženjima.",

  euclidean: "Euklidska heuristika je standardna metrika za računanje udaljenosti između dve tačke u dvodimenzionalnom ili višedimenzionalnom prostoru. Računa se kao kvadratni koren zbira kvadrata razlika koordinata, što odgovara 'pravoj liniji' između tačaka. Koristi se kada je kretanje dozvoljeno u bilo kom pravcu, a ne samo horizontalno ili vertikalno.",

  chebyshev: "Chebyshev heuristika se računa kao maksimalna apsolutna razlika između koordinata tačaka. Ova metrika je korisna u situacijama gde je kretanje dozvoljeno u svim pravcima, uključujući dijagonale, što je često korišćeno u igrama i simulacijama.",

  diagonal: "Dijagonalna heuristika je metrika koja kombinuje elemente Menhetn i Čebiševljeve udaljenosti. Koristi se kada je kretanje dozvoljeno i horizontalno, vertikalno i dijagonalno. Računa se kao zbir apsolutnih razlika koordinata, umanjen za minimalnu razliku kako bi se uzela u obzir dijagonalna kretanja. Ova heuristika je efikasna za pronalaženje putanje u mrežama sa dijagonalnim potezima.",
};

const aStar = (grid, start, end, heuristic) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const openList = [];
  const closedList = [];
  const cameFrom = [];
  const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const path = [];
  const steps = [];
  
  openList.push(start);
  gScore[start[0]][start[1]] = 0;
  fScore[start[0]][start[1]] = heuristic(start, end);

  let stepCount = 0;  

  while (openList.length > 0) {
    const current = openList.reduce((a, b) => fScore[a[0]][a[1]] < fScore[b[0]][b[1]] ? a : b);
    if (current[0] === end[0] && current[1] === end[1]) {
      let temp = current;
      while (temp) {
        path.push(temp);
        temp = cameFrom[temp[0] * cols + temp[1]];
      }
      path.reverse();
      return { path, steps, stepCount };
    }

    openList.splice(openList.indexOf(current), 1);
    closedList.push(current);

    const neighbors = [
      [current[0] - 1, current[1]], // up
      [current[0] + 1, current[1]], // down
      [current[0], current[1] - 1], // left
      [current[0], current[1] + 1], // right
    ];

    for (const neighbor of neighbors) {
      const [nx, ny] = neighbor;
      if (nx < 0 || ny < 0 || nx >= rows || ny >= cols || grid[nx][ny] === 1 || closedList.some((n) => n[0] === nx && n[1] === ny)) {
        continue;
      }

      const tentativeGScore = gScore[current[0]][current[1]] + 1;
      if (!openList.some((n) => n[0] === nx && n[1] === ny)) {
        openList.push(neighbor);
      } else if (tentativeGScore >= gScore[nx][ny]) {
        continue;
      }

      cameFrom[nx * cols + ny] = current;
      gScore[nx][ny] = tentativeGScore;
      fScore[nx][ny] = gScore[nx][ny] + heuristic(neighbor, end);
      steps.push(neighbor);

      stepCount++; 
    }
  }

  return { path, steps, stepCount };
};

const Canvas = ({ width, height }) => {
  const canvasRef = useRef(null);
  const rows = 20;
  const cols = 20;
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  const [isDrawing, setIsDrawing] = useState(false);
  const [grid, setGrid] = useState(
    Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0))
  );

  const start = [0, 0];
  const end = [rows - 1, cols - 1];
  const [path, setPath] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isRunning, setIsRunning] = useState(false); // Oznaka za stanje izvršavanja
  const [heuristicType, setHeuristicType] = useState("manhattan");

  const [executionTime, setExecutionTime] = useState(null);  // Vreme izvršavanja
  const [complexity, setComplexity] = useState(0);           // Mera kompleksnosti (broj koraka)

  const getHeuristic = () => {
    if (heuristicType === "manhattan") return manhattanDistance;
    if (heuristicType === "euclidean") return euclideanDistance;
    if (heuristicType === "chebyshev") return chebyshevDistance;
    return diagonalDistance;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

 
    ctx.clearRect(0, 0, width, height);

    // Crtanje pozadine
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, width, height);


    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x] === 1) {
          ctx.fillStyle = "#333"; // Zid
        } else if (y === start[0] && x === start[1]) {
          ctx.fillStyle = "green"; // Start
        } else if (y === end[0] && x === end[1]) {
          ctx.fillStyle = "red"; // End
        } else {
          ctx.fillStyle = "#f0f0f0"; // Prazno
        }

        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        ctx.strokeStyle = "#ccc";
        ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }


    steps.forEach(([y, x]) => {
      ctx.fillStyle = "yellow";
      ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      ctx.strokeStyle = "#ccc";
      ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    });


    path.forEach(([y, x]) => {
      ctx.fillStyle = "blue";
      ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      ctx.strokeStyle = "#ccc";
      ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
    });
  }, [grid, path, steps, width, height]);

  const updateGrid = (x, y) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      if (newGrid[y][x] === 0) {
        newGrid[y][x] = 1; 
      } else if (newGrid[y][x] === 1) {
        newGrid[y][x] = 0; 
      }
      return newGrid;
    });
  };

  const handleMouseDown = (event) => {
    setIsDrawing(true);
    handleMouseMove(event); // Dodaj zid odmah pri prvom kliku
  };

  const handleMouseMove = (event) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellWidth);
    const y = Math.floor((event.clientY - rect.top) / cellHeight);
    updateGrid(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleStartAStar = () => {
    if (isRunning) return; 
    setPath([]);
    setSteps([]);
    setIsRunning(true);

    const startTime = performance.now();  // Merenje vremena početka
    const { path, steps, stepCount } = aStar(grid, start, end, getHeuristic());
    const endTime = performance.now();    // Merenje vremena završetka

    setSteps(steps);
    setPath(path);
    setComplexity(stepCount);  // Postavljanje broja koraka
    setExecutionTime((endTime - startTime).toFixed(2));  // Postavljanje vremena izvršenja
  };

  const handleReset = () => {
    setPath([]); 
    setSteps([]); 
    setIsRunning(false);
    setExecutionTime(null);  
    setComplexity(0);       
  };

  const handleHeuristicChange = (e) => {
    setHeuristicType(e.target.value);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>A* Algoritam i Heuristike</h1>
      <p>Ovaj sajt omogućava vizualizaciju A* algoritma koristeći različite heuristike za pronalaženje najkraćeg puta u lavirintu.</p>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          border: "2px solid #ccc",
          marginTop: "20px",
        }}
      />
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleStartAStar}
          disabled={isRunning} 
          style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
        >
          Pokreni A* Algoritam
        </button>
        <button onClick={handleReset} style={{ padding: "10px", fontSize: "16px" }}>
          Resetuj Lavirint
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="heuristic" style={{ fontSize: "16px" }}>Izaberi Heuristiku: </label>
        <select
          id="heuristic"
          value={heuristicType}
          onChange={handleHeuristicChange}
          style={{ fontSize: "16px", padding: "5px" }}
        >
          <option value="manhattan">Manhattan</option>
          <option value="euclidean">Euclidean</option>
          <option value="chebyshev">Chebyshev</option>
          <option value="diagonal">Diagonal</option>
        </select>
      </div>

      {/* Prikazivanje objašnjenja heuristike */}
      <div style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
        <strong>Objašnjenje:</strong>
        <p>{heuristicDescriptions[heuristicType]}</p>
      </div>

      {/* Prikazivanje vremena izvršavanja i kompleksnosti */}
      {executionTime && (
        <div style={{ marginTop: "10px" }}>
          <strong>Vreme izvršavanja: </strong>
          <span>{executionTime} ms</span>
        </div>
      )}
      {complexity > 0 && (
        <div>
          <strong>Kompleksnost algoritma: </strong>
          <span>{complexity} koraka</span>
        </div>
      )}
    </div>
  );
};

export default Canvas;
