# 🎬 Netflix Title Journey

**An Animated Exploration of U.S. vs Canada Content Strategy**

## Overview

**Netflix Title Journey** is an interactive, animated data visualization that explores how Netflix’s content production strategy differs between the **United States** and **Canada**.

Instead of static charts, this project uses **animated dot-based storytelling** to reveal patterns in:

* content maturity (ratings),
* genre investment,
* and format (Movie vs TV Show),

allowing users to *see* how titles reorganize as the analytical lens changes.

This project was designed as a **decision-support visualization**, inspired by how internal product and analytics teams explore data rather than how dashboards traditionally present it.


## ✨ Key Features

* **Animated “Title Journey”**
  Each dot represents a single anonymized title and smoothly transitions between narrative states.

* **Guided Story Chapters**
  Users progress through multiple analytical lenses:

  1. Overall catalog
  2. Content maturity (ratings)
  3. Genre distribution
  4. Format comparison (Movie vs TV)

* **Focus Toggle**
  Instantly compare:

  * United States + Canada
  * United States only
  * Canada only

* **Interactive Tooltips**
  Hover to inspect metadata (country, rating, genre, year, format).

* **Netflix-inspired Design**
  Dark UI, brand-aligned color palette, cinematic motion, and minimal chrome.


## 🧠 Design Rationale

### Why animation instead of charts?

Traditional bar charts can obscure distributional nuance and feel static.
This project emphasizes **motion as explanation** — titles physically regroup to show how strategy shifts under different lenses.

### Why only the U.S. and Canada?

The underlying dataset contains limited country coverage. Rather than presenting a misleading global map, the visualization intentionally focuses on two closely linked markets to maximize **interpretability, accuracy, and narrative clarity**.

### Why anonymized titles?

The dataset uses generic identifiers (e.g., “Title 1”). This project treats each title as a **unit of strategy**, not a recognizable show, allowing the analysis to focus on structural patterns rather than individual properties.


## 🧩 Data

* **Source:** Public Netflix Movies and TV Shows dataset
* **Fields used:**

  * Country
  * Type (Movie / TV Show)
  * Rating
  * Genre
  * Release Year
  * Duration

**Important:**
Country reflects *production attribution* in the dataset — not audience reach, availability, or popularity.


## 🛠 Tech Stack

* **Frontend:** React + TypeScript (Vite)
* **Visualization:** D3.js (`d3-force` for animated layouts)
* **State Management:** Zustand
* **Styling:** Custom CSS + centralized theme system
* **Data Parsing:** PapaParse


## 🧱 Project Structure

```
src/
├─ app/                # app shell, constants, high-level wiring
├─ data/
│  ├─ load/            # CSV loading & parsing
│  ├─ model/           # typed data models
│  └─ derive/          # (future) computed insights
├─ state/              # story & focus state
├─ components/
│  ├─ layout/          # shell, header, side panel
│  ├─ ui/              # buttons, segmented controls
│  └─ viz/
│     └─ TitleJourney/ # animated dot system + layouts
├─ styles/             # Netflix-inspired theme + globals
```


## 🔍 What This Project Demonstrates

* Interactive data storytelling beyond static charts
* Animation as an analytical tool
* Engineering judgment around data limitations
* Separation of data, state, and rendering layers
* Production-minded visualization design

## 📄 Disclaimer

This project is an independent portfolio piece and is **not affiliated with or endorsed by Netflix**.
All data is derived from public sources and used for educational and exploratory purposes only.
