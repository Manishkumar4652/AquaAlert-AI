document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initScrollAnimations();
  initActiveLinks();
  
  // Dashboard Telemetry Loops
  if (document.querySelector('.telemetry-board')) {
    initTelemetryDashboard();
  }
  
  // Interactive Hydro-Model Tool
  if (document.getElementById('analyze-btn')) {
    initModelDashboard();
  }
});

/* ==========================================================================
   Navbar & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
      }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   Active Navigation Links
   ========================================================================== */
function initActiveLinks() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  const navLinks = document.querySelectorAll('.nav-item a, .mobile-nav a, .footer-links a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === 'index.html' && href === './') || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   Canvas Particles System
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 20;
      this.size = Math.random() * 3 + 2;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.speedY = -(Math.random() * 0.3 + 0.08);
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212,' : 'rgba(124, 58, 237,';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = this.color.includes('182') ? '#06B6D4' : '#7C3AED';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  const particleCount = 60;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   Scroll-triggered Reveal & Count-ups
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        if (entry.target.classList.contains('timeline-container')) {
          animateTimeline();
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(element => {
    revealObserver.observe(element);
  });
}

function animateTimeline() {
  const lineFill = document.querySelector('.timeline-line-fill');
  const steps = document.querySelectorAll('.timeline-step');
  
  if (lineFill) {
    setTimeout(() => {
      const isMobile = window.innerWidth <= 992;
      if (isMobile) {
        lineFill.style.height = '100%';
      } else {
        lineFill.style.width = '100%';
      }
    }, 200);
  }

  steps.forEach((step, idx) => {
    setTimeout(() => {
      step.classList.add('active');
    }, 400 + (idx * 300));
  });
}

/* ==========================================================================
   SaaS Dashboard Telemetry Simulations (Home Page)
   ========================================================================== */
function initTelemetryDashboard() {
  // Update numbers dynamically
  const soilMoistureVal = document.getElementById('telemetry-moisture-val');
  const rainDeficitVal = document.getElementById('telemetry-deficit-val');
  
  setInterval(() => {
    if (soilMoistureVal) {
      let currentVal = parseFloat(soilMoistureVal.textContent);
      let drift = (Math.random() - 0.5) * 0.4;
      soilMoistureVal.textContent = Math.max(10, Math.min(60, currentVal + drift)).toFixed(1) + '%';
    }
    if (rainDeficitVal) {
      let currentVal = parseFloat(rainDeficitVal.textContent);
      let drift = (Math.random() - 0.5) * 0.6;
      rainDeficitVal.textContent = Math.max(20, Math.min(95, currentVal + drift)).toFixed(1) + '%';
    }
  }, 3000);

  // SVG Sparkline drawing
  const sparkContainers = document.querySelectorAll('.sparkline-container');
  sparkContainers.forEach(container => {
    const width = 240;
    const height = 40;
    const pointsCount = 10;
    const dataPoints = Array.from({ length: pointsCount }, () => Math.random() * height);
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const strokeColor = container.parentElement.classList.contains('border-cyan') ? '#06B6D4' : '#7C3AED';
    path.setAttribute("stroke", strokeColor);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");
    
    function generatePathD(points) {
      const step = width / (points.length - 1);
      return points.map((p, index) => `${index === 0 ? 'M' : 'L'} ${index * step} ${height - p}`).join(' ');
    }
    
    path.setAttribute("d", generatePathD(dataPoints));
    svg.appendChild(path);
    container.appendChild(svg);
    
    // Sparkline drift loop
    setInterval(() => {
      dataPoints.shift();
      dataPoints.push(Math.random() * height);
      path.setAttribute("d", generatePathD(dataPoints));
    }, 2000);
  });

  // Simulated AI Logs console scrolling
  const loggerBox = document.getElementById('logger-box');
  const logMessages = [
    { type: 'log-sys', text: "[Ingest] Climate registers updated: Monsoonal grid data synced." },
    { type: 'log-model', text: "[Compute] Modeling localized evapotranspiration coefficients..." },
    { type: 'log-model', text: "[Compute] Deep aquifer neural network recalculation initiated." },
    { type: 'log-warn', text: "[Risk-Alert] Jaisalmer grid cell #14 shows declining groundwater depth." },
    { type: 'log-sys', text: "[Ingest] Ground telemetry received from Pali tubewell node 09." },
    { type: 'log-model', text: "[Compute] Processing 30-day precipitation forecasts against soil humidity indicators." },
    { type: 'log-warn', text: "[Risk-Alert] Bikaner water table depletion exceeds safety limits by 2.4%." },
    { type: 'log-alert', text: "[System-Alert] Monsoonal deficit predicted for Thar margins; activating local models." },
    { type: 'log-sys', text: "[Ingest] NDVI vegetative dryland registers retrieved from satellite database." }
  ];

  if (loggerBox) {
    let messageIndex = 0;
    setInterval(() => {
      const line = document.createElement('div');
      line.className = 'logger-line';
      const log = logMessages[messageIndex];
      const time = new Date().toLocaleTimeString();
      line.innerHTML = `<span class="log-sys">[${time}]</span> <span class="${log.type}">${log.text}</span>`;
      loggerBox.appendChild(line);
      loggerBox.scrollTop = loggerBox.scrollHeight;
      
      messageIndex = (messageIndex + 1) % logMessages.length;
    }, 3500);
  }
}

/* ==========================================================================
   Upgraded AI Hydro-Model Diagnostic Dashboard (Check District)
   ========================================================================== */
function initModelDashboard() {
  const analyzeBtn = document.getElementById('analyze-btn');
  const districtSelect = document.getElementById('district-select');
  const seasonSelect = document.getElementById('season-select');
  const resultCard = document.getElementById('result-card');
  const mapPolygons = document.querySelectorAll('svg.rajasthan-vector-map polygon');
  const sliderInputs = document.querySelectorAll('.slider-input');

  // Interactive Slider value displays
  sliderInputs.forEach(slider => {
    const display = document.getElementById(`${slider.id}-val`);
    slider.addEventListener('input', () => {
      if (display) {
        display.textContent = slider.value + (slider.id.includes('depth') ? 'm' : '%');
      }
    });
  });

  // Geographical Climate Zone database of Rajasthan
  const districtClimateZones = {
    // Arid Western Desert Zone
    jaisalmer: 'arid', barmer: 'arid', bikaner: 'arid', churu: 'arid', jodhpur: 'arid', jalore: 'arid',
    // Semi-Arid Aravali Zone
    sikar: 'semi-arid', jhunjhunu: 'semi-arid', nagaur: 'semi-arid', pali: 'semi-arid', sirohi: 'semi-arid', ajmer: 'semi-arid', tonk: 'semi-arid', jaipur: 'semi-arid', alwar: 'semi-arid',
    // Eastern Plains Zone
    bharatpur: 'plains', dausa: 'plains', dholpur: 'plains', karauli: 'plains', 'sawai-madhopur': 'plains', bhilwara: 'plains', bundi: 'plains',
    // Humid/Sub-Humid Southern Hilly Zone
    kota: 'humid-south', baran: 'humid-south', jhalawar: 'humid-south', udaipur: 'humid-south', pratapgarh: 'humid-south', rajsamand: 'humid-south', chittorgarh: 'humid-south', dungarpur: 'humid-south', banswara: 'humid-south', ganganagar: 'semi-arid', hanumangarh: 'semi-arid'
  };

  // Pre-load default map colors (LOW, MODERATE, HIGH risk markers)
  const defaultHighRisk = ['jaisalmer', 'barmer', 'bikaner', 'churu', 'jodhpur', 'nagaur', 'pali', 'jalore', 'sirohi'];
  const defaultModRisk = ['ajmer', 'alwar', 'sikar', 'jhunjhunu', 'tonk', 'bundi'];

  mapPolygons.forEach(polygon => {
    const id = polygon.getAttribute('data-district');
    if (defaultHighRisk.includes(id)) {
      polygon.setAttribute('data-risk', 'high');
    } else if (defaultModRisk.includes(id)) {
      polygon.setAttribute('data-risk', 'moderate');
    } else {
      polygon.setAttribute('data-risk', 'low');
    }
  });

  // Map Polygon Clicks: selects the district dropdown and analyzes
  mapPolygons.forEach(polygon => {
    polygon.addEventListener('click', () => {
      const district = polygon.getAttribute('data-district');
      districtSelect.value = district;
      
      // Select default season if none is selected
      if (!seasonSelect.value) {
        seasonSelect.value = 'summer';
      }
      
      // Auto-trigger calculation
      runModelAnalysis();
    });
  });

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', runModelAnalysis);
  }

  function runModelAnalysis() {
    const districtVal = districtSelect.value;
    const seasonVal = seasonSelect.value;

    if (!districtVal || !seasonVal) {
      alert("Please select both a District and a Season from the model panels.");
      return;
    }

    // Toggle Loading State
    analyzeBtn.disabled = true;
    const originalText = analyzeBtn.innerHTML;
    analyzeBtn.innerHTML = `<span class="spinner"></span>Analyzing Aquifers...`;
    resultCard.classList.remove('active');

    setTimeout(() => {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = originalText;

      // Extract Slider values
      const moistureDeficit = parseFloat(document.getElementById('slider-moisture').value);
      const rainDeficit = parseFloat(document.getElementById('slider-rain').value);
      const waterDepth = parseFloat(document.getElementById('slider-depth').value);

      // Model Risk Calculation Algorithm
      let baselineWeight = 1.0;
      if (defaultHighRisk.includes(districtVal)) baselineWeight = 3.0;
      else if (defaultModRisk.includes(districtVal)) baselineWeight = 2.0;

      let seasonFactor = 0.0;
      if (seasonVal === 'summer') seasonFactor = 1.0;
      else if (seasonVal === 'monsoon') seasonFactor = -0.8;
      else if (seasonVal === 'post-monsoon') seasonFactor = 0.2;

      // Deficit and depth factors influence
      let moistureImpact = moistureDeficit > 50 ? 0.6 : 0.0;
      let rainImpact = rainDeficit > 40 ? 0.9 : 0.0;
      let depthImpact = waterDepth > 80 ? 0.7 : 0.0;

      const totalScore = baselineWeight + seasonFactor + moistureImpact + rainImpact + depthImpact;

      let riskLevel = 'LOW';
      if (totalScore >= 3.8) {
        riskLevel = 'HIGH';
      } else if (totalScore >= 2.5) {
        riskLevel = 'MODERATE';
      }

      // Populate results tabs
      renderModelResults(districtVal, seasonVal, riskLevel, districtClimateZones[districtVal]);

      // Highlight map
      highlightVectorMap(districtVal, riskLevel);

    }, 1500);
  }

  function renderModelResults(district, season, risk, zone) {
    const resDistrict = document.getElementById('res-district');
    const resSeason = document.getElementById('res-season');
    const riskBadge = document.getElementById('res-risk-badge');
    const statusIcon = document.getElementById('res-status-icon');
    
    // Result panels
    const advisoryPara = document.getElementById('res-advisory');
    const actionList = document.getElementById('res-actions-list');
    const futurePlanContent = document.getElementById('future-plan-content');

    const formattedDistrict = district.charAt(0).toUpperCase() + district.slice(1).replace('-', ' ');
    const formattedSeason = season.charAt(0).toUpperCase() + season.slice(1).replace('-', ' ');

    resDistrict.textContent = formattedDistrict;
    resSeason.textContent = formattedSeason;

    riskBadge.className = 'risk-badge';
    actionList.innerHTML = '';

    // Immediate Alert & Recommendations Loading
    if (risk === 'HIGH') {
      riskBadge.textContent = 'HIGH RISK';
      riskBadge.classList.add('risk-badge-high');
      statusIcon.textContent = '🚨';
      advisoryPara.textContent = `CRITICAL WARNING: Severe aquifer depletion and localized water deficits modeled for ${formattedDistrict} in the ${formattedSeason}. Water consumption must be restricted immediately.`;
      resultCard.style.borderColor = 'var(--danger)';
      resultCard.style.boxShadow = '0 15px 35px rgba(239, 68, 68, 0.2)';

      const immediateActions = [
        "Restrict deep aquifer tube-well pumping and prioritize surface storage containers.",
        "Deploy municipal emergency water scheduling and secure key public drinking wells.",
        "Implement sub-surface root wetting / micro-irrigation for standing field crops."
      ];
      immediateActions.forEach(act => {
        const li = document.createElement('li');
        li.textContent = act;
        actionList.appendChild(li);
      });
    } else if (risk === 'MODERATE') {
      riskBadge.textContent = 'MODERATE RISK';
      riskBadge.classList.add('risk-badge-moderate');
      statusIcon.textContent = '⚠️';
      advisoryPara.textContent = `WARNING: Elevated stress levels detected in local reservoir catchments for ${formattedDistrict} during the ${formattedSeason}. Smart rationing practices should be initialized.`;
      resultCard.style.borderColor = 'var(--warning)';
      resultCard.style.boxShadow = '0 15px 35px rgba(245, 158, 11, 0.2)';

      const immediateActions = [
        "Perform audits on community storage check-dams to identify and seal distribution leaks.",
        "Promote graywater recycling loops for livestock irrigation and local soil watering.",
        "Enforce regional caps on private tubewell drill depths to check seasonal drops."
      ];
      immediateActions.forEach(act => {
        const li = document.createElement('li');
        li.textContent = act;
        actionList.appendChild(li);
      });
    } else {
      riskBadge.textContent = 'LOW RISK';
      riskBadge.classList.add('risk-badge-low');
      statusIcon.textContent = '✅';
      advisoryPara.textContent = `STABLE CONDITIONS: Normal groundwater levels and adequate moisture profiles expected in ${formattedDistrict} during the ${formattedSeason}. Standard operations should be maintained.`;
      resultCard.style.borderColor = 'var(--success)';
      resultCard.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.2)';

      const immediateActions = [
        "Desilt catchments and clean catchment inlets in preparation for standard precipitation seasons.",
        "Conduct scheduled inspection of community rooftop collection lines.",
        "Log baseline pumping volumes to calibrate regional water-security models."
      ];
      immediateActions.forEach(act => {
        const li = document.createElement('li');
        li.textContent = act;
        actionList.appendChild(li);
      });
    }

    // Future-Ready Resilience Zonal Recommendations (Advanced Suggestions)
    let futureHTML = '';
    if (zone === 'arid') {
      futureHTML = `
        <h4 style="color:var(--primary); margin-bottom:0.75rem;">Arid Western Zone Future-Ready Plan</h4>
        <p style="font-size:0.95rem; margin-bottom:1rem; color:var(--text-secondary);">
          Due to extreme desert volatility, long-term aquifer preservation requires transitioning to low-consumption smart systems:
        </p>
        <ul style="list-style:none; padding-left:0;">
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">🚜 Sub-Surface Drip Irrigation:</strong> Install pressurized pipes beneath soil to deliver moisture directly to roots, reducing evaporation losses by up to 60%.
          </li>
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">🏺 Community Rainwater 'Taankas':</strong> Fund regional concrete storage cells to store water over multiple drought years.
          </li>
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">🌳 Halophyte Agroforestry:</strong> Cultivate local desert trees (like Khejri and Rohida) to secure topsoil structures, stabilize sand drifts, and naturally retain moisture layers.
          </li>
        </ul>
      `;
    } else if (zone === 'semi-arid') {
      futureHTML = `
        <h4 style="color:var(--primary); margin-bottom:0.75rem;">Semi-Arid Aravali Zone Future-Ready Plan</h4>
        <p style="font-size:0.95rem; margin-bottom:1rem; color:var(--text-secondary);">
          High population density and intensive irrigation demand rapid replenishment systems:
        </p>
        <ul style="list-style:none; padding-left:0;">
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">🌀 Active Tubewell Recharging:</strong> Convert dry, abandoned tubewells into injection points to funnel monsoonal rainwater directly back into aquifers.
          </li>
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">🌾 Crop Shifting Models:</strong> Transition from water-heavy wheat/mustard crops to highly resilient millets (Bajra), sorghum, and pulses.
          </li>
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">🧱 Contour Check-Dams (Anicuts):</strong> Place low-cost rock and cement barriers across seasonal streams to slow run-off, allowing it to absorb into the soil.
          </li>
        </ul>
      `;
    } else if (zone === 'plains') {
      futureHTML = `
        <h4 style="color:var(--primary); margin-bottom:0.75rem;">Eastern Plains Zone Future-Ready Plan</h4>
        <p style="font-size:0.95rem; margin-bottom:1rem; color:var(--text-secondary);">
          Centering around intensive agricultural zones, optimization of surface structures and reuse is critical:
        </p>
        <ul style="list-style:none; padding-left:0;">
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">🏞️ Community Wetland Recovery:</strong> Clear debris and desilt historic water channels (Johads) to capture and store seasonal runoff.
          </li>
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">⛲ Neighborhood Graywater Networks:</strong> Build small filtration setups to reuse household wastewater for gardens and community green belts.
          </li>
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">📈 Smart Pumping Logs:</strong> Equip community wells with IoT flow meters and run pump schedules during off-peak evaporative hours.
          </li>
        </ul>
      `;
    } else {
      futureHTML = `
        <h4 style="color:var(--primary); margin-bottom:0.75rem;">Humid Southern Zone Future-Ready Plan</h4>
        <p style="font-size:0.95rem; margin-bottom:1rem; color:var(--text-secondary);">
          High monsoonal precipitation should be captured locally to avoid rapid runoff downstream:
        </p>
        <ul style="list-style:none; padding-left:0;">
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">🏠 Rooftop Catchment Mandates:</strong> Install roof gutters and pipes on all public structures to collect and store rainwater.
          </li>
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">⛰️ Slope Trenching:</strong> Excavate horizontal soil trenches along hillsides to capture swift downhill runoff, recharging groundwater.
          </li>
          <li style="margin-bottom:0.8rem; font-size:0.95rem; position:relative; padding-left:24px; color:var(--text-secondary);">
            <strong style="color:#fff;">🐟 Integrated Farm Ponds:</strong> Combine farm rainwater storage ponds with micro-fisheries, creating a dual-use water source that supports local income.
          </li>
        </ul>
      `;
    }

    // Add bullet indicators
    futurePlanContent.innerHTML = futureHTML;
    
    // Add checklist bullet styling to new lists
    const futureListItems = futurePlanContent.querySelectorAll('li');
    futureListItems.forEach(li => {
      li.style.position = 'relative';
      li.style.paddingLeft = '24px';
      
      const dot = document.createElement('span');
      dot.textContent = '✦';
      dot.style.position = 'absolute';
      dot.style.left = '0';
      dot.style.color = 'var(--primary)';
      li.insertBefore(dot, li.firstChild);
    });

    // Make tabs clickable
    initResultTabs();

    // Trigger visual reveal of Result Card
    resultCard.classList.add('active');
    
    setTimeout(() => {
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  }

  function initResultTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
      // Remove any existing event listeners to avoid duplicates
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });

    const refreshedButtons = document.querySelectorAll('.tab-btn');
    refreshedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-tab');

        refreshedButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`${tabTarget}-tab`).classList.add('active');
      });
    });
  }

  function highlightVectorMap(selectedDistrict, risk) {
    if (mapPolygons.length === 0) return;

    mapPolygons.forEach(polygon => {
      polygon.classList.remove('highlighted');
    });

    const targetPolygon = Array.from(mapPolygons).find(
      poly => poly.getAttribute('data-district').toLowerCase() === selectedDistrict.toLowerCase()
    );

    if (targetPolygon) {
      targetPolygon.classList.add('highlighted');
      targetPolygon.setAttribute('data-risk', risk.toLowerCase());
    }
  }
}
