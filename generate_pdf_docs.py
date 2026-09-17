import os
import sys
import subprocess
import datetime

def main():
    print("Generating GramSeva comprehensive project documentation HTML...")
    
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>GramSeva - Comprehensive Project Documentation</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 18mm 16mm 18mm 16mm;
    @bottom-right {{
      content: counter(page);
    }}
  }}

  *, *::before, *::after {{
    box-sizing: border-box;
  }}

  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.55;
    font-size: 10.5pt;
    margin: 0;
    padding: 0;
  }}

  /* Page Break Utilities */
  .page-break {{
    page-break-before: always;
    break-before: page;
  }}

  .avoid-break {{
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  /* Typography */
  h1, h2, h3, h4, h5 {{
    color: #0f172a;
    font-weight: 700;
    margin-top: 1.3em;
    margin-bottom: 0.5em;
    line-height: 1.25;
  }}

  h1 {{
    font-size: 20pt;
    border-bottom: 2px solid #047857;
    padding-bottom: 6px;
    color: #064e3b;
  }}

  h2 {{
    font-size: 15pt;
    color: #047857;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin-top: 1.6em;
  }}

  h3 {{
    font-size: 12pt;
    color: #1e293b;
    margin-top: 1.2em;
  }}

  h4 {{
    font-size: 10.5pt;
    color: #334155;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 1em;
  }}

  p {{
    margin: 0.5em 0 0.8em 0;
    text-align: justify;
  }}

  ul, ol {{
    margin: 0.4em 0 0.8em 1.4em;
    padding: 0;
  }}

  li {{
    margin-bottom: 0.35em;
  }}

  /* Cover Page */
  .cover-container {{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 92vh;
    padding: 30px 20px 20px 20px;
    border: 2px solid #047857;
    border-radius: 8px;
    background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 40%, #f8fafc 100%);
    box-sizing: border-box;
  }}

  .cover-header {{
    border-bottom: 3px double #047857;
    padding-bottom: 20px;
    text-align: center;
  }}

  .gov-badge {{
    display: inline-block;
    background: #064e3b;
    color: #ffffff;
    font-size: 9pt;
    font-weight: 700;
    padding: 6px 16px;
    border-radius: 20px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    margin-bottom: 15px;
  }}

  .cover-title {{
    font-size: 28pt;
    color: #064e3b;
    font-weight: 800;
    margin: 10px 0 6px 0;
    letter-spacing: -0.5px;
    border: none;
    padding: 0;
  }}

  .cover-kannada {{
    font-size: 18pt;
    color: #d97706;
    font-weight: 700;
    margin: 0 0 15px 0;
  }}

  .cover-subtitle {{
    font-size: 13pt;
    color: #334155;
    font-weight: 500;
    line-height: 1.4;
    max-width: 85%;
    margin: 0 auto;
  }}

  .cover-hero-box {{
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-left: 6px solid #047857;
    border-radius: 6px;
    padding: 18px 22px;
    margin: 25px 0;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }}

  .cover-hero-title {{
    font-weight: 700;
    font-size: 11.5pt;
    color: #064e3b;
    margin-bottom: 8px;
  }}

  .cover-meta-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 20px;
    font-size: 9.5pt;
  }}

  .meta-card {{
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px 16px;
  }}

  .meta-label {{
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 4px;
  }}

  .meta-value {{
    font-size: 10pt;
    color: #0f172a;
    font-weight: 700;
  }}

  .cover-footer {{
    text-align: center;
    border-top: 1px solid #e2e8f0;
    padding-top: 15px;
    font-size: 8.5pt;
    color: #64748b;
  }}

  /* Badges & Pills */
  .badge {{
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }}

  .badge-critical {{ background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }}
  .badge-high {{ background: #ffedd5; color: #c2410c; border: 1px solid #fdba74; }}
  .badge-medium {{ background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }}
  .badge-low {{ background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }}
  .badge-success {{ background: #dcfce7; color: #15803d; border: 1px solid #86efac; }}

  /* Tables */
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px 0;
    font-size: 9pt;
  }}

  th, td {{
    padding: 7px 10px;
    border: 1px solid #cbd5e1;
    text-align: left;
    vertical-align: top;
  }}

  th {{
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-bottom: 2px solid #94a3b8;
  }}

  tr:nth-child(even) td {{
    background-color: #f8fafc;
  }}

  /* Callout Boxes */
  .callout {{
    border-left: 4px solid #047857;
    background: #f0fdf4;
    padding: 12px 15px;
    border-radius: 0 6px 6px 0;
    margin: 14px 0;
    font-size: 9.5pt;
  }}

  .callout-warning {{
    border-left-color: #d97706;
    background: #fffbeb;
  }}

  .callout-critical {{
    border-left-color: #dc2626;
    background: #fef2f2;
  }}

  .callout-info {{
    border-left-color: #0284c7;
    background: #f0f9ff;
  }}

  .callout-title {{
    font-weight: 700;
    font-size: 10pt;
    margin-bottom: 4px;
    color: #0f172a;
  }}

  /* Architecture Box / Diagrams */
  .diagram-container {{
    background: #0f172a;
    color: #f8fafc;
    border-radius: 6px;
    padding: 14px 18px;
    font-family: "Courier New", Courier, monospace;
    font-size: 8pt;
    line-height: 1.35;
    margin: 14px 0;
    overflow-x: auto;
    white-space: pre;
    border: 1px solid #334155;
  }}

  /* Code Block */
  .code-snippet {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 5px;
    padding: 10px 12px;
    font-family: Consolas, Monaco, "Courier New", monospace;
    font-size: 8.5pt;
    color: #0f172a;
    margin: 10px 0;
    white-space: pre-wrap;
    line-height: 1.4;
  }}

  /* Key Metrics Grid */
  .metrics-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 12px 0 16px 0;
  }}

  .metric-box {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 12px;
    text-align: center;
  }}

  .metric-box .val {{
    font-size: 16pt;
    font-weight: 800;
    color: #047857;
    line-height: 1.1;
  }}

  .metric-box .lbl {{
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
    font-weight: 600;
    margin-top: 4px;
  }}

  /* Header & Footer on content pages */
  .content-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 6px;
    margin-bottom: 16px;
    font-size: 8pt;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 600;
  }}

  .content-footer {{
    border-top: 1px solid #e2e8f0;
    padding-top: 6px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: #94a3b8;
  }}
</style>
</head>
<body>

<!-- ================================================= PAGE 1: COVER PAGE ================================================= -->
<div class="cover-container">
  <div class="cover-header">
    <div class="gov-badge">Karnataka Rural Civic-Tech Initiative • Pilot Architecture</div>
    <h1 class="cover-title">GRAMSEVA</h1>
    <div class="cover-kannada">ಗ್ರಾಮ ಸೇವಾ: ಗ್ರಾಮ ಮೂಲಸೌಕರ್ಯ ನಿರ್ವಹಣಾ ವೇದಿಕೆ</div>
    <div class="cover-subtitle">
      Proactive Village Infrastructure Monitoring, Transparent Rule-Based Prioritization, and Citizen-Verified Resolution Platform
    </div>
  </div>

  <div class="cover-hero-box">
    <div class="cover-hero-title">OFFICIAL TECHNICAL PROJECT SPECIFICATION & ARCHITECTURE REPORT</div>
    <p style="margin: 0; font-size: 9.5pt; color: #334155;">
      This document provides comprehensive technical, architectural, and operational documentation for the <strong>GramSeva</strong> platform. Designed specifically for Gram Panchayats in Karnataka, GramSeva re-engineers rural governance from reactive complaint-handling into proactive preventative maintenance with deterministic algorithmic scoring, multi-tier escalation, and citizen verification loops.
    </p>
  </div>

  <div class="cover-meta-grid">
    <div class="meta-card">
      <div class="meta-label">Pilot Gram Panchayat</div>
      <div class="meta-value">Honnur Gram Panchayat (ಹೊನ್ನೂರು)</div>
      <div style="font-size: 8.5pt; color: #64748b; margin-top: 2px;">Nagamangala Taluk, Mandya District, Karnataka</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">System Version & Release</div>
      <div class="meta-value">v1.0.0 Production Build (Node 25 / React 18)</div>
      <div style="font-size: 8.5pt; color: #64748b; margin-top: 2px;">CommonJS Backend + Vite SPA Frontend</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Operating Paradigm</div>
      <div class="meta-value">Proactive Field Audits & Two-Stage Verification</div>
      <div style="font-size: 8.5pt; color: #64748b; margin-top: 2px;">Deterministic Priority Engine (Zero Black-Box ML)</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">Documentation Classification</div>
      <div class="meta-value">Full Architectural & Technical Manual</div>
      <div style="font-size: 8.5pt; color: #64748b; margin-top: 2px;">Date: September 2026 • Document ID: GS-2026-DOC-01</div>
    </div>
  </div>

  <div class="cover-footer">
    Developed for Rural Local Bodies (PRIs) • Honnur Gram Panchayat Pilot • Karnataka Panchayati Raj & Rural Development Ecosystem
  </div>
</div>

<!-- ================================================= PAGE 2: EXECUTIVE SUMMARY & PROBLEM STATEMENT ================================================= -->
<div class="page-break"></div>

<div class="content-header">
  <span>GramSeva Technical Documentation</span>
  <span>Section 1: Executive Summary & Context</span>
</div>

<h1>1. Executive Summary & Problem Formulation</h1>

<h2>1.1 The Rural Infrastructure Crisis in Panchayats</h2>
<p>
  In India's rural local governance ecosystem (Panchayati Raj Institutions - PRIs), public infrastructure assets such as <strong>drinking water purification plants (RO units), borewells, street lighting networks, open stormwater drainage canals, and village interior roads</strong> represent the physical backbone of community health and livelihood. However, traditional municipal grievance platforms suffer from fundamental systemic failures:
</p>

<ul>
  <li><strong>100% Reactive Dependence:</strong> Faults remain undetected until a resident experiences severe distress and navigates bureaucratic hurdles to register a complaint. If a street fixture or water pump breaks in an elderly or disadvantaged neighborhood, it often remains neglected for months.</li>
  <li><strong>The "Ghost Closure" Epidemic:</strong> Across legacy portals, work tickets are frequently closed administratively by department contractors without on-ground repairs having occurred, destroying citizen trust.</li>
  <li><strong>Chronic Asset Bleed:</strong> Certain assets fail repeatedly (e.g., defective capacitor panels or submerged wiring), yet maintenance staff repeatedly apply superficial temporary fixes, consuming village budgets while the root cause remains unaddressed.</li>
  <li><strong>Opaque Prioritization:</strong> Tickets are processed based on political favoritism or arbitrary queues rather than public safety urgency (e.g., a streetlamp failing outside a primary school vs. an isolated private lane).</li>
</ul>

<h2>1.2 The GramSeva Solution Paradigm</h2>
<p>
  <strong>GramSeva (ಗ್ರಾಮ ಸೇವಾ)</strong> re-architects rural civic governance from <em>reactive complaint logging</em> to <strong>proactive infrastructure reliability engineering</strong>. Tested and piloted in <strong>Honnur Gram Panchayat, Mandya District</strong>, the platform introduces six foundational pillars:
</p>

<div class="metrics-grid">
  <div class="metric-box">
    <div class="val">100%</div>
    <div class="lbl">Asset Tagged Registry</div>
  </div>
  <div class="metric-box">
    <div class="val">Weekly</div>
    <div class="lbl">Proactive Audits</div>
  </div>
  <div class="metric-box">
    <div class="val">3-Tier</div>
    <div class="lbl">SLA Escalation</div>
  </div>
  <div class="metric-box">
    <div class="val">2-Stage</div>
    <div class="lbl">Citizen Verification</div>
  </div>
</div>

<div class="callout">
  <div class="callout-title">Core Hypothesis of GramSeva</div>
  By combining scheduled preventative inspection checklists with an auditable rule-based priority engine and a mandatory citizen verification loop, a Gram Panchayat can eliminate 60%+ of citizen grievances before they arise while ensuring 100% audit integrity for village maintenance funds.
</div>

<h2>1.3 Key Architectural Differentiators</h2>

<table>
  <thead>
    <tr>
      <th style="width: 25%;">Dimension</th>
      <th style="width: 37%;">Legacy Grievance Redressal Portals</th>
      <th style="width: 38%;">GramSeva Proactive Governance Platform</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Discovery Mode</strong></td>
      <td>Purely reactive (waits for citizen complaint).</td>
      <td><strong>Proactive First:</strong> Scheduled digital inspection runs by linemen, auto-creating tickets prior to public escalation.</td>
    </tr>
    <tr>
      <td><strong>Prioritization</strong></td>
      <td>First-in, first-out (FIFO) or political influence.</td>
      <td><strong>Deterministic Scoring (0–100):</strong> Evaluates proximity to schools/PHCs, asset history, and safety hazards.</td>
    </tr>
    <tr>
      <td><strong>Closure Authority</strong></td>
      <td>Lineman/contractor marks "Resolved" unilaterally.</td>
      <td><strong>Dual Verification:</strong> "Resolved" is merely a verification request; issue is CLOSED only upon citizen confirmation.</td>
    </tr>
    <tr>
      <td><strong>Chronic Failures</strong></td>
      <td>Treated as disconnected random events.</td>
      <td><strong>Automated Recurrence Engine:</strong> Flags assets failing ≥3 times in 60 days, mandating overhaul over temporary repair.</td>
    </tr>
    <tr>
      <td><strong>Accountability</strong></td>
      <td>Single deadline with opaque extensions.</td>
      <td><strong>3-Tier Dynamic SLA Escalation:</strong> Auto-escalates from Lineman → Panchayat Development Officer (PDO) → Taluk Executive.</td>
    </tr>
  </tbody>
</table>

<!-- ================================================= PAGE 3: PILOT PROFILE & JURISDICTION ================================================= -->
<div class="page-break"></div>

<div class="content-header">
  <span>GramSeva Technical Documentation</span>
  <span>Section 2: Pilot Jurisdiction & Baseline Data</span>
</div>

<h1>2. Pilot Jurisdiction Profile: Honnur Gram Panchayat</h1>

<h2>2.1 Geographic & Administrative Overview</h2>
<p>
  The initial operational pilot of GramSeva is configured for <strong>Honnur Gram Panchayat</strong>, situated in Nagamangala Taluk of Mandya District, Karnataka (PIN: 571432). Honnur features a representative cross-section of rural infrastructure, spanning historical temple settlement zones, rural health hubs, active agricultural trade junctions, and newer peripheral community residential colonies.
</p>

<div class="meta-card avoid-break" style="margin-bottom: 15px;">
  <div class="meta-label">Pilot Entity Structure</div>
  <div style="font-size: 10pt; font-weight: 700; color: #064e3b;">Honnur Gram Panchayat (ಹೊನ್ನೂರು ಗ್ರಾಮ ಪಂಚಾಯತಿ)</div>
  <div style="font-size: 9pt; color: #475569; margin-top: 4px;">
    Taluk: Nagamangala | District: Mandya | State: Karnataka | Local Body Code: PRI-KAR-MAN-042
  </div>
</div>

<h2>2.2 Ward Demographics & Infrastructure Focus</h2>
<p>
  Honnur Gram Panchayat is partitioned into four primary administrative wards, each characterized by distinct civic infrastructure configurations:
</p>

<table>
  <thead>
    <tr>
      <th style="width: 12%;">Ward ID</th>
      <th style="width: 25%;">Ward Name</th>
      <th style="width: 23%;">Elected Representative</th>
      <th style="width: 40%;">Key Public Infrastructure & Sensitivities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>w-1</strong></td>
      <td>Ward 1 - Kote & Temple Area</td>
      <td>Somanna Gowda</td>
      <td>Historical high-density settlement; ancient temple plaza, community hall (Kalyana Mantapa), stone drainage networks, heritage illumination poles.</td>
    </tr>
    <tr>
      <td><strong>w-2</strong></td>
      <td>Ward 2 - School & PHC Ward</td>
      <td>Shivalingaiah</td>
      <td><strong>High-Sensitivity Zone:</strong> Government Higher Primary School, Primary Health Centre (PHC), Anganwadi Centre, main overhead water reservoir.</td>
    </tr>
    <tr>
      <td><strong>w-3</strong></td>
      <td>Ward 3 - Market & Bus Stop</td>
      <td>Anitha Venkatesh</td>
      <td>Commercial transport hub; KSRTC rural bus stop, weekly shandy/market stalls, public sanitations, multi-tap drinking water kiosk (RO plant).</td>
    </tr>
    <tr>
      <td><strong>w-4</strong></td>
      <td>Ward 4 - Colony & Lake Extension</td>
      <td>Manjunatha K</td>
      <td>Residential agricultural extension; lake bund roadway, irrigation outflow channels, decentralized borewells, peripheral streetlights.</td>
    </tr>
  </tbody>
</table>

<h2>2.3 Departmental Maintenance Cells</h2>
<p>
  Maintenance operations are delegated across four dedicated operational departments within the Gram Panchayat administration, each governed by specific Service Level Agreements (SLAs):
</p>

<table>
  <thead>
    <tr>
      <th>Department Code</th>
      <th>Department Name</th>
      <th>Officer-in-Charge</th>
      <th>Critical SLA</th>
      <th>High SLA</th>
      <th>Med SLA</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>STREETLIGHT</code></td>
      <td>Streetlight Maintenance Team</td>
      <td>S. Nanjappa (Assistant Engineer, Electrical)</td>
      <td>24 Hours</td>
      <td>48 Hours</td>
      <td>120 Hours</td>
    </tr>
    <tr>
      <td><code>WATER_SUPPLY</code></td>
      <td>Rural Water Supply & Sanitation (RWSS)</td>
      <td>K. R. Vasanth (Junior Engineer, Water Works)</td>
      <td>12 Hours</td>
      <td>36 Hours</td>
      <td>96 Hours</td>
    </tr>
    <tr>
      <td><code>DRAINAGE_SANITATION</code></td>
      <td>Gram Sanitation & Solid Waste Team</td>
      <td>B. Puttegowda (Sanitation Officer)</td>
      <td>18 Hours</td>
      <td>48 Hours</td>
      <td>72 Hours</td>
    </tr>
    <tr>
      <td><code>ROADS_INFRA</code></td>
      <td>Rural Infrastructure & PWD Cell</td>
      <td>H. Manjunath (Section Officer, PWD)</td>
      <td>48 Hours</td>
      <td>96 Hours</td>
      <td>168 Hours</td>
    </tr>
  </tbody>
</table>

<!-- ================================================= PAGE 4: SYSTEM ARCHITECTURE ================================================= -->
<div class="page-break"></div>

<div class="content-header">
  <span>GramSeva Technical Documentation</span>
  <span>Section 3: System Architecture</span>
</div>

<h1>3. System Architecture & Technical Stack</h1>

<h2>3.1 High-Level Architecture Overview</h2>
<p>
  GramSeva is engineered as a decoupled, responsive client-server web application architected for extreme reliability, rapid local edge responsiveness, low bandwidth tolerance in rural broadband environments, and seamless multi-device compatibility (field smartphone, desktop admin console, and community kiosk).
</p>

<div class="diagram-container">
+---------------------------------------------------------------------------------------------------------+
|                                    GRAMSEVA CLIENT LAYER (REACT 18 + VITE)                              |
|  +-----------------------+ +-----------------------+ +-----------------------+ +---------------------+  |
|  |   Citizen Portal      | |  Field Staff Runner   | |   PDO Admin Console   | | Community Observer  |  |
|  | (Report, Track, Rate) | | (Checklist, Camera)   | | (Analytics, Rules)    | | (Open Transparency) |  |
|  +-----------------------+ +-----------------------+ +-----------------------+ +---------------------+  |
|               |                        |                        |                        |              |
|               +------------------------+-----------+------------+------------------------+              |
|                                                    | (RESTful JSON / JWT Auth)                          |
+----------------------------------------------------|----------------------------------------------------+
                                                     v
+---------------------------------------------------------------------------------------------------------+
|                                   BACKEND SERVICE LAYER (EXPRESS 5.x / NODE.JS)                         |
|  +--------------------+ +--------------------+ +--------------------+ +--------------------+            |
|  | Priority Engine    | | Proactive Detector | | Routing Service    | | Escalation Engine  |            |
|  | (Deterministic 0-100)| (Audits & Recurrence) | (Dept / Staff / SLA)| (Tier 1-3 Overdue)  |            |
|  +--------------------+ +--------------------+ +--------------------+ +--------------------+            |
|  +--------------------+ +--------------------+ +--------------------+ +--------------------+            |
|  | Auth & Persona     | | Analytics Service  | | Notification Svc   | | Multer Media Pipe  |            |
|  | (JWT, RBAC)        | | (12 Chart Models)  | | (Email/In-App/SMS) | | (Before/After Img) |            |
|  +--------------------+ +--------------------+ +--------------------+ +--------------------+            |
+----------------------------------------------------|----------------------------------------------------+
                                                     v
+---------------------------------------------------------------------------------------------------------+
|                                    DATA PERSISTENCE LAYER (SQLITE RELATIONAL)                           |
|  - Relational Schema with Foreign Key Constraints & PRAGMA foreign_keys = ON                            |
|  - Indexed Tables: assets, issues, inspections, issue_status_history, feedback, notifications, users     |
|  - File System Storage: /uploads/ (High-resolution inspection & repair photo evidence)                  |
+---------------------------------------------------------------------------------------------------------+
</div>

<h2>3.2 Full Technology Stack Specifications</h2>

<table>
  <thead>
    <tr>
      <th style="width: 22%;">Layer</th>
      <th style="width: 28%;">Technology / Library</th>
      <th style="width: 50%;">Architectural Rationale & Implementation Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend Framework</strong></td>
      <td>React 18.3 + Vite 6.4</td>
      <td>Single Page Application (SPA) architecture offering instantaneous persona switching, dynamic client-side caching, and sub-second bundle compilation.</td>
    </tr>
    <tr>
      <td><strong>Styling & Design System</strong></td>
      <td>Custom Modern Vanilla CSS Tokens</td>
      <td>Lightweight CSS tokens (Emerald/Slate theme), zero runtime overhead, responsive flexbox/grid layouts, native mobile touch optimizations.</td>
    </tr>
    <tr>
      <td><strong>State & Localization</strong></td>
      <td>React Context API</td>
      <td>Decoupled <code>AuthContext</code>, <code>ThemeContext</code>, and <code>LanguageContext</code> providing instant English/Kannada bilingual toggles.</td>
    </tr>
    <tr>
      <td><strong>Backend Engine</strong></td>
      <td>Node.js (v25+) + Express 5.2</td>
      <td>High-concurrency asynchronous I/O, native JSON body parsing, structured modular controllers, robust error middleware.</td>
    </tr>
    <tr>
      <td><strong>Database Engine</strong></td>
      <td>SQLite Relational Database</td>
      <td>Zero-configuration serverless database embedded in the filesystem (<code>data/gramseva.db</code>), supporting full ACID transactions and relational joins.</td>
    </tr>
    <tr>
      <td><strong>Security & Auth</strong></td>
      <td>JWT + Bcrypt.js</td>
      <td>Stateless JSON Web Tokens with 7-day validity, role-based access control (<code>CITIZEN</code>, <code>FIELD_STAFF</code>, <code>ADMIN</code>), Bcrypt password hashing.</td>
    </tr>
    <tr>
      <td><strong>Media Pipeline</strong></td>
      <td>Multer 2.3 + Static Express</td>
      <td>Multipart image file upload pipeline with MIME type verification and timestamped disk storage in <code>/uploads</code>.</td>
    </tr>
    <tr>
      <td><strong>Notifications</strong></td>
      <td>Nodemailer 10.0 + In-App Dispatcher</td>
      <td>Dual-channel notification engine dispatching styled HTML transactional emails alongside persistent in-app notifications.</td>
    </tr>
  </tbody>
</table>

<!-- ================================================= PAGE 5: PROACTIVE DETECTOR & INSPECTION RUNNER ================================================= -->
<div class="page-break"></div>

<div class="content-header">
  <span>GramSeva Technical Documentation</span>
  <span>Section 4: Preventative Maintenance Engine</span>
</div>

<h1>4. Proactive Inspection Engine & Asset Registry</h1>

<h2>4.1 The Public Asset Registry Model</h2>
<p>
  Every public infrastructure asset across the village is cataloged within the <code>assets</code> relational table. Each entry encapsulates not only geographic and departmental ownership, but also operational risk levels and maintenance cadences:
</p>

<ul>
  <li><strong>Unique Asset Identifier:</strong> E.g., <code>SL-047</code> (Streetlight 47), <code>WP-012</code> (Water RO Plant 12), <code>DR-005</code> (Drainage Channel 5).</li>
  <li><strong>Risk Level Classification:</strong> <code>HIGH</code>, <code>MEDIUM</code>, or <code>LOW</code>. Assets situated near schools or medical clinics are permanently designated as <code>HIGH</code> risk.</li>
  <li><strong>Inspection Frequency Cadence:</strong> Standard default of 14 days (bi-weekly). Dynamically compressed to <strong>7 days</strong> if an asset is flagged for chronic recurrence.</li>
  <li><strong>Failure Counter:</strong> Maintains a rolling tally of operational failures recorded across the asset's lifecycle.</li>
</ul>

<h2>4.2 Scheduled Field Inspection Runner</h2>
<p>
  Rather than waiting for citizen complaints, GramSeva empowers field staff (linemen, water pump operators, sanitation workers) to conduct scheduled ward audits using the <strong>Inspection Task Runner</strong>.
</p>

<div class="diagram-container">
+-----------------------------------------------------------------------------------------------+
|                             SCHEDULED FIELD INSPECTION LIFECYCLE                              |
|                                                                                               |
|  [Admin Schedules Audit] ---> [Lineman Opens Ward Checklist] ---> [Inspects Each Asset]       |
|                                                                          |                    |
|                                             +----------------------------+-----------------+  |
|                                             |                                              |  |
|                                             v                                              v  |
|                                    [Asset is WORKING]                       [Fault Detected]  |
|                                             |                                      |          |
|                                     (Records timestamp,             (Inspector marks NOT_WORKING|
|                                      maintains status)              or NEEDS_ATTENTION, snaps |
|                                                                     photo, adds field note)   |
|                                                                                    |          |
|                                                                                    v          |
|                                                                         [Proactive Detector]  |
|                                                                                    |          |
|                                                        +---------------------------+          |
|                                                        |                                      |
|                                                        v                                      v
|                                              [Duplicate Exists?]                   [New Ticket Auto-Gen]
|                                                        |                                      |
|                                            (Reaffirms existing issue,             (Scores via Priority Engine,
|                                             updates audit history)                 assigns SLA & lineman,
|                                                                                    alerts PDO immediately)
+-----------------------------------------------------------------------------------------------+
</div>

<h2>4.3 The Proactive Detection Algorithm (Code Analysis)</h2>
<p>
  When an inspector records a defect during a field audit, <code>handleInspectionItemResult()</code> in <code>server/services/proactiveDetector.js</code> executes the following deterministic sequence:
</p>

<div class="code-snippet">
// Excerpt from server/services/proactiveDetector.js
1. Asset Status Update:
   - If result === 'NOT_WORKING' -> Update asset to 'NOT_WORKING' (or 'RECURRING_FAILURE' if flag is active).
   - Update asset.last_inspection_date to CURRENT_TIMESTAMP.

2. Duplicate Prevention Gate:
   - Queries existing unclosed issues for this specific asset_id.
   - If found: Links inspection as reaffirming evidence; prevents duplicate ticket clutter.

3. Automated Issue Synthesis:
   - Generates unique ID: GS-YYYY-XXXX.
   - Sets detection_source = 'SCHEDULED_INSPECTION'.
   - Calculates priority score & rationale via calculatePriority().
   - Calculates SLA deadline and assigns staff via routeAndAssign().
   - Inserts ticket in 'ASSIGNED' state directly (bypassing redundant verification).
   - Dispatches instant notifications to Admin and assigned Lineman.
</div>

<!-- ================================================= PAGE 6: DETERMINISTIC PRIORITY ENGINE ================================================= -->
<div class="page-break"></div>

<div class="content-header">
  <span>GramSeva Technical Documentation</span>
  <span>Section 5: Priority Engine & Scoring Algorithm</span>
</div>

<h1>5. Transparent Rule-Based Priority Engine</h1>

<h2>5.1 The Case Against "Black-Box" Machine Learning in Rural PRIs</h2>
<p>
  Many modern civic platforms attempt to apply complex deep learning or opaque NLP models to prioritize complaints. In Indian rural local governance, this approach fails catastrophically:
</p>
<ul>
  <li>Panchayat Development Officers (PDOs) cannot explain to elected ward members why one complaint was prioritized over another.</li>
  <li>Training datasets in rural Kannada/English code-mixed dialects are noisy, introducing severe bias against illiterate or non-technical citizens.</li>
  <li>Black-box models cannot guarantee statutory SLA adherence for sensitive public installations (e.g., primary health centres or schools).</li>
</ul>
<p>
  GramSeva implements an <strong>Auditable, Deterministic Rule-Based Scoring Engine</strong> (<code>server/services/priorityEngine.js</code>). The algorithm computes an exact integer score (0–100+) and generates an explicit human-readable rationale detailing every point added.
</p>

<h2>5.2 Priority Scoring Mathematical Breakdown</h2>

<table>
  <thead>
    <tr>
      <th style="width: 25%;">Evaluation Vector</th>
      <th style="width: 15%;">Points</th>
      <th style="width: 60%;">Condition & Trigger Criteria</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Baseline Weight</strong></td>
      <td><strong>+20</strong></td>
      <td>Universal base score applied to every registered issue to ensure baseline visibility.</td>
    </tr>
    <tr>
      <td><strong>Sensitive Facility: Education</strong></td>
      <td><strong>+30</strong></td>
      <td>Location text/landmarks matching: <code>school</code>, <code>vidyalaya</code>, <code>shale</code>. Prevents child hazards.</td>
    </tr>
    <tr>
      <td><strong>Sensitive Facility: Healthcare</strong></td>
      <td><strong>+30</strong></td>
      <td>Location text/landmarks matching: <code>phc</code>, <code>hospital</code>, <code>clinic</code>, <code>arogya</code>. Protects medical clinics.</td>
    </tr>
    <tr>
      <td><strong>Sensitive Facility: Child Welfare</strong></td>
      <td><strong>+25</strong></td>
      <td>Location text/landmarks matching: <code>anganwadi</code>. Prioritizes mother and child nutrition centers.</td>
    </tr>
    <tr>
      <td><strong>Transit & Commercial Density</strong></td>
      <td><strong>+20</strong></td>
      <td>Location text/landmarks matching: <code>bus stand</code>, <code>market</code>, <code>shandy</code>. High pedestrian footfall.</td>
    </tr>
    <tr>
      <td><strong>Community Gathering Plaza</strong></td>
      <td><strong>+15</strong></td>
      <td>Location text/landmarks matching: <code>temple</code>, <code>kalyana mantapa</code>. Public cultural hubs.</td>
    </tr>
    <tr>
      <td><strong>Essential Amenity: Water</strong></td>
      <td><strong>+25</strong></td>
      <td>Category is <code>WATER_POINT</code> (drinking water RO plants, public taps, main borewells).</td>
    </tr>
    <tr>
      <td><strong>Sanitation & Flood Risk</strong></td>
      <td><strong>+20</strong></td>
      <td>Category is <code>DRAINAGE</code> (open drain blockages, sewage overflow, public health risk).</td>
    </tr>
    <tr>
      <td><strong>Public Safety Hazard Keyword</strong></td>
      <td><strong>+25</strong></td>
      <td>Descriptions matching: <code>sparking</code>, <code>live wire</code>, <code>shock</code>, <code>contamination</code>, <code>burst</code>, <code>deep pothole</code>.</td>
    </tr>
    <tr>
      <td><strong>Chronic Asset History</strong></td>
      <td><strong>+25</strong></td>
      <td>Asset failure count ≥ 3 or flagged as <code>is_recurring_flag = 1</code>.</td>
    </tr>
    <tr>
      <td><strong>High-Risk Asset Designation</strong></td>
      <td><strong>+15</strong></td>
      <td>Pre-designated high-risk public asset in master registry.</td>
    </tr>
    <tr>
      <td><strong>Aging / Duration Unresolved</strong></td>
      <td><strong>+15 / +25</strong></td>
      <td>+15 if unresolved for ≥ 3 days; +25 if unresolved for ≥ 7 days. Prevents stale tickets.</td>
    </tr>
  </tbody>
</table>

<h2>5.3 Score-to-Priority Band Mapping</h2>
<p>
  Once calculated, the cumulative score maps deterministically into four actionable operational bands:
</p>

<div class="metrics-grid">
  <div class="metric-box" style="border-top: 4px solid #dc2626;">
    <div class="val" style="color: #dc2626;">CRITICAL</div>
    <div class="lbl">Score &ge; 75 Points</div>
  </div>
  <div class="metric-box" style="border-top: 4px solid #ea580c;">
    <div class="val" style="color: #ea580c;">HIGH</div>
    <div class="lbl">Score 50 &ndash; 74 Points</div>
  </div>
  <div class="metric-box" style="border-top: 4px solid #d97706;">
    <div class="val" style="color: #d97706;">MEDIUM</div>
    <div class="lbl">Score 30 &ndash; 49 Points</div>
  </div>
  <div class="metric-box" style="border-top: 4px solid #2563eb;">
    <div class="val" style="color: #2563eb;">LOW</div>
    <div class="lbl">Score &lt; 30 Points</div>
  </div>
</div>

<div class="callout callout-info">
  <div class="callout-title">Audit Rationale String Example</div>
  <em>"+20 Baseline issue registration, +30 Near School / Child pedestrian zone, +20 Nighttime pedestrian visibility & safety, +25 Immediate public safety hazard [Score: 95 &rarr; CRITICAL]"</em>
</div>

<!-- ================================================= PAGE 7: 3-TIER ESCALATION & LIFECYCLE ================================================= -->
<div class="page-break"></div>

<div class="content-header">
  <span>GramSeva Technical Documentation</span>
  <span>Section 6: Dynamic Escalation & Resolution Lifecycle</span>
</div>

<h1>6. Dynamic Escalation Matrix & Dual Verification</h1>

<h2>6.1 3-Tier Automated Escalation Hierarchy</h2>
<p>
  In traditional governance systems, when a field worker misses a deadline, tickets simply languish indefinitely. GramSeva implements an <strong>Automated 3-Tier SLA Escalation Engine</strong> (<code>server/services/escalationService.js</code>). The service continuously calculates overdue hours against target completion dates:
</p>

<table>
  <thead>
    <tr>
      <th style="width: 15%;">Escalation Tier</th>
      <th style="width: 20%;">Breach Threshold</th>
      <th style="width: 30%;">Responsible Administrative Officer</th>
      <th style="width: 35%;">Action & System Behavior</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="badge badge-medium">Level 1</span></td>
      <td><strong>&gt; 0 Hours Overdue</strong></td>
      <td>Duty Lineman & Department Section Head</td>
      <td>Ticket marked <code>ESCALATED</code>; reminder dispatched to field staff; highlighted in orange on Admin dashboard.</td>
    </tr>
    <tr>
      <td><span class="badge badge-high">Level 2</span></td>
      <td><strong>&gt; 24 Hours Overdue</strong></td>
      <td><strong>K. Shivakumar</strong> (Panchayat Development Officer - PDO)</td>
      <td>Formal administrative escalation to PDO; emergency work order re-assignment authorized; flagged on Gram Panchayat review list.</td>
    </tr>
    <tr>
      <td><span class="badge badge-critical">Level 3</span></td>
      <td><strong>&gt; 72 Hours Overdue</strong></td>
      <td><strong>Executive Officer (EO)</strong> (Taluk Panchayat, Nagamangala)</td>
      <td>Taluk-level executive intervention; recorded in quarterly PRI performance audit; contractor penalty triggers logged.</td>
    </tr>
  </tbody>
</table>

<h2>6.2 The Complete 11-State Lifecycle Machine</h2>
<p>
  Every issue navigates a strictly enforced state machine that prohibits administrative shortcuts:
</p>

<div class="diagram-container">
[REPORTED] (Citizen or Community Observer files complaint)
    |
    v
[VERIFICATION_PENDING] ---> [VERIFIED] (Admin / Field staff confirms on ground)
    |
    v
[ASSIGNED] (Auto-routed to Dept & Staff with computed SLA)
    |
    +---> [ESCALATED] (Triggered if SLA target breached at any point)
    |
    v
[IN_PROGRESS] (Field staff clocks in on-site, logs initial repair notes)
    |
    v
[RESOLVED] (Field staff submits Mandatory AFTER-PHOTO & Completion Notes)
    |
    v
[CITIZEN_VERIFICATION] (Automated Notification sent to Citizen with Feedback link)
    |
    +--------------------------------+--------------------------------+
    |                                                                 |
    v (Citizen confirms YES)                                          v (Citizen clicks NO / Unresolved)
[CLOSED]                                                          [REOPENED]
(Rating recorded, SLA marked complete)                            (Bounces back to Lineman queue)
</div>

<h2>6.3 The Two-Stage Verification Loop & "Ghost Closure" Prevention</h2>
<div class="callout callout-critical">
  <div class="callout-title">GramSeva Core Integrity Rule</div>
  <strong>Field staff and department contractors are physically prohibited from marking an issue as CLOSED.</strong>
  When work is finished, staff can only transition the status to <code>RESOLVED</code>, which requires uploading an <em>After-Repair Photo</em> and resolution notes. The system immediately shifts the issue to <code>CITIZEN_VERIFICATION</code>. The ticket is officially closed ONLY when the reporting resident confirms resolution or rates the work.
</div>

<!-- ================================================= PAGE 8: CHRONIC RECURRING ASSET OVERHAUL ================================================= -->
<div class="page-break"></div>

<div class="content-header">
  <span>GramSeva Technical Documentation</span>
  <span>Section 7: Chronic Asset Overhaul & Analytics</span>
</div>

<h1>7. Chronic Asset Recurrence & Root-Cause Overhaul</h1>

<h2>7.1 Identifying the "Repair Money Pit"</h2>
<p>
  A major leak in Gram Panchayat finances is repeated minor expenditure on dying infrastructure assets. For example, a village streetlight fixture with degraded underground insulation may short-circuit every 10 days. Linemen repeatedly replace fuses, billing the Panchayat for small repairs, while the underlying fixture remains dangerous and defective.
</p>
<p>
  GramSeva's <code>checkAndFlagRecurringAsset()</code> algorithm monitors rolling 60-day failure histories across all public assets.
</p>

<div class="diagram-container">
+-----------------------------------------------------------------------------------------------+
|                       CHRONIC ASSET DETECTION & ELEVATION WORKFLOW                            |
|                                                                                               |
|  [Issue Resolved] ---> [Count Failures in Past 60 Days] ---> [Failures >= 3?]                 |
|                                                                     |                         |
|                                     +-------------------------------+-----------------------+ |
|                                     |                                                       | |
|                                     v (YES)                                                 v |
|                     [Set is_recurring_flag = 1]                                 (Continue     |
|                     [Set status = 'RECURRING_FAILURE']                           standard     |
|                     [Double Inspection Frequency: 14d -> 7d]                     cadence)     |
|                     [Auto-Generate Permanent Overhaul Alert to PDO]                           |
+-----------------------------------------------------------------------------------------------+
</div>

<h2>7.2 The 12-Dimensional Analytics Intelligence Suite</h2>
<p>
  The GramSeva Analytics Engine (<code>server/services/analyticsService.js</code>) computes 12 distinct metric dimensions to provide the Panchayat Development Officer and Elected Ward Committee with complete operational visibility:
</p>

<table>
  <thead>
    <tr>
      <th style="width: 8%;">#</th>
      <th style="width: 27%;">Analytical Dimension</th>
      <th style="width: 65%;">Governance Purpose & Decision-Making Impact</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td><strong>Resolution Time by Category</strong></td>
      <td>Identifies which engineering cells (water vs electrical vs roads) face material or staffing bottlenecks.</td>
    </tr>
    <tr>
      <td>2</td>
      <td><strong>6-Month Resolution Trend</strong></td>
      <td>Tracks month-over-month platform efficacy and resolution velocity over time.</td>
    </tr>
    <tr>
      <td>3</td>
      <td><strong>Pending vs Resolved by Ward</strong></td>
      <td>Ensures equitable public spending and maintenance attention across all four village wards.</td>
    </tr>
    <tr>
      <td>4</td>
      <td><strong>Category Distribution</strong></td>
      <td>Visualizes infrastructure breakdown volume (e.g., streetlights vs drinking water points).</td>
    </tr>
    <tr>
      <td>5</td>
      <td><strong>Department SLA Compliance</strong></td>
      <td>Monitors average turnaround hours per department against statutory citizen charter benchmarks.</td>
    </tr>
    <tr>
      <td>6</td>
      <td><strong>Priority Distribution</strong></td>
      <td>Displays the ratio of Critical and High safety issues relative to routine Medium/Low tasks.</td>
    </tr>
    <tr>
      <td>7</td>
      <td><strong>Chronic Recurring Assets Table</strong></td>
      <td>Lists top failing infrastructure assets requiring capital replacement in the next Gram Sabha budget.</td>
    </tr>
    <tr>
      <td>8</td>
      <td><strong>Ward Vulnerability Hotspots</strong></td>
      <td>Highlights wards accumulating high concentrations of critical and high-priority infrastructure issues.</td>
    </tr>
    <tr>
      <td>9</td>
      <td><strong>Citizen Feedback Ratings</strong></td>
      <td>Aggregates verified resident satisfaction distribution (1-Star to 5-Star ratings).</td>
    </tr>
    <tr>
      <td>10</td>
      <td><strong>SLA Breach & Escalation Level</strong></td>
      <td>Analyzes ticket volume resolved within SLA vs those escalated to Level 1, Level 2, or Level 3.</td>
    </tr>
    <tr>
      <td>11</td>
      <td><strong>Resolution Velocity Buckets</strong></td>
      <td>Groups resolved tickets into speed tiers: &lt;24 hours, 1–3 days, 3–7 days, and &gt;7 days.</td>
    </tr>
    <tr>
      <td>12</td>
      <td><strong>Period Comparison</strong></td>
      <td>Compares current 30-day performance against previous 30-day performance for issues detected, resolved, and escalated.</td>
    </tr>
  </tbody>
</table>

<!-- ================================================= PAGE 9: DATABASE RELATIONAL SCHEMA ================================================= -->
<div class="page-break"></div>

<div class="content-header">
  <span>GramSeva Technical Documentation</span>
  <span>Section 8: Database Architecture & Schema</span>
</div>

<h1>8. Database Architecture & Relational Schema</h1>

<h2>8.1 Entity-Relationship Overview</h2>
<p>
  GramSeva utilizes an ACID-compliant relational SQLite database with strict foreign key integrity enforced (<code>PRAGMA foreign_keys = ON;</code>). Below is the comprehensive schema definition of the 12 core tables:
</p>

<table>
  <thead>
    <tr>
      <th style="width: 22%;">Table Name</th>
      <th style="width: 28%;">Primary Key & Foreign Keys</th>
      <th style="width: 50%;">Core Attributes & Check Constraints</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>villages</code></td>
      <td><code>id</code> (PK)</td>
      <td><code>name</code>, <code>taluk</code>, <code>district</code>, <code>pin_code</code>, <code>gp_name</code>, <code>created_at</code></td>
    </tr>
    <tr>
      <td><code>wards</code></td>
      <td><code>id</code> (PK), <code>village_id</code> (FK)</td>
      <td><code>ward_number</code> (INT), <code>name</code>, <code>representative_name</code>, <code>created_at</code></td>
    </tr>
    <tr>
      <td><code>users</code></td>
      <td><code>id</code> (PK), <code>ward_id</code> (FK)</td>
      <td><code>name</code>, <code>email</code> (UNIQUE), <code>phone</code>, <code>password_hash</code>, <code>role</code> (CITIZEN, FIELD_STAFF, ADMIN), <code>designation</code>, <code>is_active</code></td>
    </tr>
    <tr>
      <td><code>departments</code></td>
      <td><code>id</code> (PK), <code>code</code> (UNIQUE)</td>
      <td><code>name</code>, <code>head_name</code>, <code>sla_hours_critical</code>, <code>sla_hours_high</code>, <code>sla_hours_medium</code>, <code>sla_hours_low</code></td>
    </tr>
    <tr>
      <td><code>assets</code></td>
      <td><code>id</code> (PK), <code>village_id</code> (FK), <code>ward_id</code> (FK), <code>department_id</code> (FK)</td>
      <td><code>asset_type</code> (STREETLIGHT, WATER_POINT, PUBLIC_TOILET, ROAD, DRAINAGE, etc.), <code>name</code>, <code>location_description</code>, <code>latitude</code>, <code>longitude</code>, <code>status</code> (WORKING, NEEDS_ATTENTION, NOT_WORKING, RECURRING_FAILURE), <code>risk_level</code>, <code>failure_count</code>, <code>is_recurring_flag</code></td>
    </tr>
    <tr>
      <td><code>issues</code></td>
      <td><code>id</code> (PK), <code>asset_id</code> (FK), <code>ward_id</code> (FK), <code>department_id</code> (FK), <code>assigned_to_user_id</code> (FK)</td>
      <td><code>detection_source</code> (CITIZEN_REPORT, SCHEDULED_INSPECTION, COMMUNITY_OBSERVATION), <code>title</code>, <code>description</code>, <code>priority</code> (CRITICAL, HIGH, MEDIUM, LOW), <code>priority_score</code>, <code>priority_rationale</code>, <code>status</code> (11 States), <code>target_completion_date</code>, <code>before_photo_url</code>, <code>after_photo_url</code>, <code>escalation_level</code></td>
    </tr>
    <tr>
      <td><code>issue_status_history</code></td>
      <td><code>id</code> (PK), <code>issue_id</code> (FK), <code>changed_by_user_id</code> (FK)</td>
      <td><code>old_status</code>, <code>new_status</code>, <code>notes</code>, <code>created_at</code> (Timestamped immutable audit log of every workflow state change)</td>
    </tr>
    <tr>
      <td><code>inspections</code></td>
      <td><code>id</code> (PK), <code>ward_id</code> (FK), <code>assigned_to_user_id</code> (FK)</td>
      <td><code>schedule_date</code>, <code>status</code> (SCHEDULED, IN_PROGRESS, COMPLETED), <code>total_assets_checked</code>, <code>issues_detected_count</code></td>
    </tr>
    <tr>
      <td><code>inspection_items</code></td>
      <td><code>id</code> (PK), <code>inspection_id</code> (FK), <code>asset_id</code> (FK), <code>created_issue_id</code> (FK)</td>
      <td><code>result</code> (PENDING, WORKING, NEEDS_ATTENTION, NOT_WORKING), <code>notes</code>, <code>photo_url</code>, <code>inspected_at</code></td>
    </tr>
    <tr>
      <td><code>feedback</code></td>
      <td><code>id</code> (PK), <code>issue_id</code> (FK, UNIQUE), <code>citizen_id</code> (FK)</td>
      <td><code>is_resolved_confirmed</code> (0 or 1), <code>rating</code> (1 to 5), <code>comments</code>, <code>feedback_source</code>, <code>submitted_at</code></td>
    </tr>
    <tr>
      <td><code>notifications</code></td>
      <td><code>id</code> (PK), <code>user_id</code> (FK), <code>issue_id</code> (FK)</td>
      <td><code>title</code>, <code>message</code>, <code>type</code> (STATUS_CHANGE, ASSIGNMENT, ESCALATION, RECURRING_ALERT), <code>is_read</code>, <code>email_sent</code></td>
    </tr>
    <tr>
      <td><code>system_config</code></td>
      <td><code>key</code> (PK)</td>
      <td><code>value</code>, <code>description</code>, <code>updated_at</code> (Key-value store for global runtime parameters)</td>
    </tr>
  </tbody>
</table>

<h2>8.2 Database Optimization Indexes</h2>
<p>
  To guarantee lightning-fast query execution on low-power village server hardware, the following B-Tree indexes are initialized on startup:
</p>
<div class="code-snippet">
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_ward ON issues(ward_id);
CREATE INDEX IF NOT EXISTS idx_issues_department ON issues(department_id);
CREATE INDEX IF NOT EXISTS idx_issues_assigned ON issues(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_issues_asset ON issues(asset_id);
CREATE INDEX IF NOT EXISTS idx_assets_ward ON assets(ward_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
</div>

<!-- ================================================= PAGE 10: RESTFUL API REFERENCE ================================================= -->
<div class="page-break"></div>

<div class="content-header">
  <span>GramSeva Technical Documentation</span>
  <span>Section 9: API Specification</span>
</div>

<h1>9. RESTful API Specification</h1>

<h2>9.1 Complete Endpoint Directory</h2>

<table>
  <thead>
    <tr>
      <th style="width: 10%;">Method</th>
      <th style="width: 32%;">Endpoint Route</th>
      <th style="width: 18%;">Auth & RBAC</th>
      <th style="width: 40%;">Description & Payload Summary</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="badge badge-low">GET</span></td>
      <td><code>/api/health</code></td>
      <td>Public</td>
      <td>Returns system health, pilot village status, and server timestamp.</td>
    </tr>
    <tr>
      <td><span class="badge badge-success">POST</span></td>
      <td><code>/api/auth/login</code></td>
      <td>Public</td>
      <td>Authenticates user via email/password; returns JWT token and user profile.</td>
    </tr>
    <tr>
      <td><span class="badge badge-success">POST</span></td>
      <td><code>/api/auth/register</code></td>
      <td>Public</td>
      <td>Self-registration for village residents.</td>
    </tr>
    <tr>
      <td><span class="badge badge-success">POST</span></td>
      <td><code>/api/auth/switch-role</code></td>
      <td>Public (Demo)</td>
      <td>Instantly switches active user persona between Citizen, Field Staff, and Admin for live demonstration audits.</td>
    </tr>
    <tr>
      <td><span class="badge badge-low">GET</span></td>
      <td><code>/api/metadata/wards-departments</code></td>
      <td>Public</td>
      <td>Returns all wards, department SLA rules, and available field staff.</td>
    </tr>
    <tr>
      <td><span class="badge badge-low">GET</span></td>
      <td><code>/api/assets</code></td>
      <td>Public</td>
      <td>Lists all registered public infrastructure assets with filter parameters.</td>
    </tr>
    <tr>
      <td><span class="badge badge-success">POST</span></td>
      <td><code>/api/assets</code></td>
      <td>Admin</td>
      <td>Creates a new public infrastructure asset in master registry.</td>
    </tr>
    <tr>
      <td><span class="badge badge-medium">PATCH</span></td>
      <td><code>/api/assets/:id</code></td>
      <td>Admin</td>
      <td>Updates asset details, risk level, or maintenance frequency.</td>
    </tr>
    <tr>
      <td><span class="badge badge-low">GET</span></td>
      <td><code>/api/issues</code></td>
      <td>Public</td>
      <td>Retrieves issues filtered by ward, category, priority, or status.</td>
    </tr>
    <tr>
      <td><span class="badge badge-success">POST</span></td>
      <td><code>/api/issues</code></td>
      <td>Authenticated</td>
      <td>Registers a new issue; triggers Priority Engine & auto-routing.</td>
    </tr>
    <tr>
      <td><span class="badge badge-medium">PATCH</span></td>
      <td><code>/api/issues/:id/start-work</code></td>
      <td>Staff / Admin</td>
      <td>Lineman transitions issue status to <code>IN_PROGRESS</code> upon site arrival.</td>
    </tr>
    <tr>
      <td><span class="badge badge-medium">PATCH</span></td>
      <td><code>/api/issues/:id/resolve</code></td>
      <td>Staff / Admin</td>
      <td>Lineman submits resolution notes & after-repair photo; status &rarr; <code>RESOLVED</code>.</td>
    </tr>
    <tr>
      <td><span class="badge badge-success">POST</span></td>
      <td><code>/api/issues/:id/verify</code></td>
      <td>Citizen / Admin</td>
      <td>Citizen confirms resolution (status &rarr; <code>CLOSED</code>) or rejects (status &rarr; <code>REOPENED</code>).</td>
    </tr>
    <tr>
      <td><span class="badge badge-success">POST</span></td>
      <td><code>/api/upload</code></td>
      <td>Authenticated</td>
      <td>Multipart image file upload; returns accessible public upload URL.</td>
    </tr>
    <tr>
      <td><span class="badge badge-low">GET</span></td>
      <td><code>/api/inspections</code></td>
      <td>Authenticated</td>
      <td>Fetches scheduled field audit checklists and item defect statuses.</td>
    </tr>
    <tr>
      <td><span class="badge badge-success">POST</span></td>
      <td><code>/api/inspections/:id/items/:itemId</code></td>
      <td>Staff / Admin</td>
      <td>Logs asset inspection result (WORKING, NEEDS_ATTENTION, NOT_WORKING); triggers Proactive Detector if defect found.</td>
    </tr>
    <tr>
      <td><span class="badge badge-low">GET</span></td>
      <td><code>/api/admin/analytics</code></td>
      <td>Authenticated</td>
      <td>Returns comprehensive KPI suite, 12 chart series, and rule-based insights.</td>
    </tr>
    <tr>
      <td><span class="badge badge-success">POST</span></td>
      <td><code>/api/admin/escalations/trigger-check</code></td>
      <td>Admin</td>
      <td>Executes batch evaluation of overdue issues; applies Level 1–3 escalations.</td>
    </tr>
    <tr>
      <td><span class="badge badge-low">GET</span></td>
      <td><code>/api/notifications</code></td>
      <td>Authenticated</td>
      <td>Fetches user notification feed with read/unread flags.</td>
    </tr>
  </tbody>
</table>

<!-- ================================================= PAGE 11: USER PERSONAS & OPERATIONAL MODULES ================================================= -->
<div class="page-break"></div>

<div class="content-header">
  <span>GramSeva Technical Documentation</span>
  <span>Section 10: User Personas & Modules</span>
</div>

<h1>10. User Personas & Frontend Interaction Modules</h1>

<h2>10.1 Multi-Persona Operating Model</h2>
<p>
  GramSeva is structured around four distinct operational personas, each provided with an interface optimized for their specific workflow and technical literacy level:
</p>

<h3>Persona 1: Gram Panchayat Administrator (PDO - K. Shivakumar)</h3>
<ul>
  <li><strong>Full Operational Command:</strong> Real-time overview of village infrastructure health, open work orders, and field crew deployment.</li>
  <li><strong>Escalation Center:</strong> Instant visibility into overdue SLA tickets, with 1-click trigger to execute automated escalation checks.</li>
  <li><strong>Chronic Asset Analysis:</strong> Dedicated view of assets failing &ge; 3 times, with administrative recommendations for permanent replacement.</li>
  <li><strong>Interactive Village Map:</strong> SVG visual map of Honnur displaying ward boundaries, landmarks, and color-coded asset markers.</li>
</ul>

<h3>Persona 2: Village Citizen (E.g., Prajwal Patel, Lakshmi Devi)</h3>
<ul>
  <li><strong>Simplified Bilingual Filing:</strong> Multilingual interface toggleable between <strong>Kannada (ಕನ್ನಡ)</strong> and English.</li>
  <li><strong>Landmark-Driven Location:</strong> Pre-populated dropdowns of familiar village landmarks (PHC, High School, Marigudi Temple, Bus Stop).</li>
  <li><strong>Transparent Lifecycle Tracker:</strong> 5-step visual stepper tracking issue progress from Reported to Closed.</li>
  <li><strong>Citizen Verification Modal:</strong> Direct empowerment to confirm whether repairs were actually executed, rate quality (1–5 stars), or reopen defective fixes.</li>
</ul>

<h3>Persona 3: Field Staff / Lineman (E.g., Ramesh Kumar, Suresh Gowda)</h3>
<ul>
  <li><strong>Mobile Task Runner:</strong> Clean, high-contrast mobile checklist for scheduled ward inspection rounds.</li>
  <li><strong>One-Tap Defect Capture:</strong> Immediate defect marking with camera integration for photo proof.</li>
  <li><strong>Active Work Order Deck:</strong> Clear list of assigned repairs sorted by SLA priority urgency.</li>
  <li><strong>Before/After Evidence Chain:</strong> Mandatory requirement to upload photo proof of completed work before a ticket can be moved to Resolved.</li>
</ul>

<h3>Persona 4: Community Observer / Ward Committee</h3>
<ul>
  <li><strong>Public Transparency Board:</strong> Open dashboard accessible to Ward Committee members, SHG federations, and Asha workers.</li>
  <li><strong>Reliability Scorecards:</strong> Transparent disclosure of ward-wise resolution rates and department SLA compliance.</li>
</ul>

<!-- ================================================= PAGE 12: DEPLOYMENT & VERIFICATION ================================================= -->
<div class="page-break"></div>

<div class="content-header">
  <span>GramSeva Technical Documentation</span>
  <span>Section 11: Deployment, Testing & Roadmap</span>
</div>

<h1>11. Deployment, Verification & Future Roadmap</h1>

<h2>11.1 Local Installation & Execution Guide</h2>
<p>
  GramSeva is pre-configured for frictionless local execution across Windows, macOS, and Linux environments without requiring external database servers or complex cloud dependencies:
</p>

<div class="code-snippet">
# 1. Clone repository & install dependencies
git clone &lt;repository-url&gt;
cd leap
npm install
npm install --prefix client

# 2. Database Auto-Initialization
# The backend automatically initializes schema.sql and seeds Honnur GP baseline data on first run.
# To manually re-seed the test environment at any time:
npm run seed

# 3. Start Full-Stack Development Environment
# Concurrently launches Express Backend (Port 5000) and Vite Frontend (Port 3000)
npm run dev

# 4. Access Platform
# Web Portal: http://localhost:3000
# API Health: http://localhost:5000/api/health
</div>

<h2>11.2 Automated Verification & Integration Test Suite</h2>
<p>
  GramSeva includes an end-to-end integration test harness (<code>server/test_workflow.js</code>) that exercises the primary user journey programmatically:
</p>

<div class="code-snippet">
# Execute the primary end-to-end user journey test
npm test

Integration Test Sequence Executed:
[STEP 1] Asset Registry: Verifies asset SL-047 (Streetlight near Primary School).
[STEP 2] Scheduled Audit: Lineman Ramesh marks SL-047 as NOT_WORKING with defect note.
[STEP 3] Proactive Detection: Auto-generates Issue GS-2026-1001 with CRITICAL priority (Score: 85).
[STEP 4] Work In Progress: Lineman arrives on site and updates status to IN_PROGRESS.
[STEP 5] Work Completed: Lineman uploads After-Repair photo and marks RESOLVED.
[STEP 6] Citizen Verification: Resident Mahadevappa confirms repair with 5-star rating -> CLOSED.
[STEP 7] Chronic Asset Engine: Simulates repeat failures; verifies escalation to RECURRING_FAILURE.
[STEP 8] Escalation Engine: Simulates overdue SLA breach; verifies auto-escalation to PDO & Taluk EO.
</div>

<h2>11.3 Future Technical Roadmap for Karnataka-wide Scaling</h2>
<ul>
  <li><strong>IoT Telemetry Integration:</strong> Integrating ultrasonic water level sensors on overhead reservoirs and smart energy sub-meters on borewell pump starters to trigger auto-tickets before manual inspections.</li>
  <li><strong>Conversational WhatsApp/IVRS Bot:</strong> Introducing low-bandwidth WhatsApp chatbot reporting in spoken Kannada with voice note transcription for non-literate residents.</li>
  <li><strong>GIS & Bhoomi Integration:</strong> Linking asset coordinates with Karnataka Revenue Department (Bhoomi) parcel boundaries and RDPR e-Swathu assets registry.</li>
  <li><strong>Taluk-Level Multi-Tenant Aggregation:</strong> Expanding database tenancy to support all 300+ Gram Panchayats across Mandya District with a unified Taluk Panchayat administrative roll-up.</li>
</ul>

<div class="callout callout-info" style="margin-top: 25px;">
  <div class="callout-title">Document Verification Sign-off</div>
  <strong>Project:</strong> GramSeva (ಗ್ರಾಮ ಸೇವಾ) • <strong>Pilot:</strong> Honnur Gram Panchayat, Karnataka<br>
  <strong>Technical Lead:</strong> Prajwal P. (Civic-Tech Systems Architect) • <strong>Reviewed:</strong> September 2026<br>
  <em>Certified for production pilot deployment and institutional presentation to Karnataka Department of Rural Development and Panchayati Raj (RDPR).</em>
</div>

<div class="content-footer">
  <span>GramSeva Technical Architecture Document • Confidential & Open Civic-Tech</span>
  <span>Honnur Gram Panchayat Pilot • Page 12 of 12</span>
</div>

</body>
</html>
"""

    html_path = os.path.abspath("GramSeva_Project_Documentation.html")
    pdf_path = os.path.abspath("GramSeva_Comprehensive_Project_Documentation.pdf")
    
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    print(f"HTML documentation generated at: {html_path}")
    print(f"Compiling to PDF via Headless Chrome: {pdf_path} ...")
    
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    
    browser_exe = chrome_path if os.path.exists(chrome_path) else edge_path
    
    cmd = [
        browser_exe,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={pdf_path}",
        html_path
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 1000:
        print(f"SUCCESS: PDF successfully generated! File size: {os.path.getsize(pdf_path):,} bytes")
        print(f"PDF Location: {pdf_path}")
    else:
        print(f"Error or warning generating PDF. Exit code: {result.returncode}")
        print("Stderr:", result.stderr)
        print("Stdout:", result.stdout)

if __name__ == "__main__":
    main()
