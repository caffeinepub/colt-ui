# Colt UI

## Current State
Version 19 is live with Media tab (YouTube search via Invidious), MoreTab with theme options, GamesTab with 13 games including Colt Clicker and Colt Maze.

## Requested Changes (Diff)

### Add
- Colt Maze: 4 additional maze layouts (5 total) with a selector UI
- Colt Clicker: shop name (editable), achievements system (8 achievements), 6 more shop items
- Games: per-game customization options (difficulty, speed, etc.) that actually apply

### Modify
- MediaTab: Fix search — use CORS proxy (corsproxy.io) to wrap Invidious API calls so they succeed in-browser
- MoreTab themes: ensure theme switching visually applies (fix CSS variable conflicts with accent color override; enhance theme backgrounds and text colors)
- ColtMaze: add maze selector (5 mazes), update layout

### Remove
Nothing removed.

## Implementation Plan
1. Fix MediaTab search via corsproxy.io wrapping
2. Fix MoreTab themes by applying additional CSS variables per theme that aren't overridden by accent system
3. Enhance ColtMaze with 5 maze layouts and selector
4. Enhance ColtClicker with shop name, achievements, more items
5. Add game customization options to GamesTab (difficulty selector shown before launching each game)
