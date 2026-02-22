# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.0] - 2026-02-22

### Added

- ✨ **color**: Color converter tool with RGB/HSL conversion, CSS named colors, smart input parsing
- ✨ **timestamp**: Timestamp converter tool with Unix timestamp ↔ date conversion
- ✨ **json-yaml**: JSON ↔ YAML converter with bidirectional conversion and indent control
- ✨ JSON formatter/validator tool
- ✨ UUID/ULID generator tool
- ✨ URL encode/decode tool
- ✨ Base64 encode/decode tool
- ✨ Playful developer aesthetic UI with macOS-style gradient tile cards and split-panel tool pages
- ✨ Theme system with 5 themes: Soft Modern, Ink Wash (水墨), Twilight (薄暮), Nord, GitHub Dark
- ✨ ThemeSwitcher popover component with smooth CSS transitions
- ✨ Per-tool gradient CSS variables for visual identity
- ✨ CopyButton reusable component
- ✨ Tool registry with auto-route generation
- ✨ CLI entry point for `npx` one-command launch

### Fixed

- 🐛 Theme transitions now apply to all elements during switch
- 🐛 ThemeSwitcher accessibility attributes and button types

### Changed

- ♻️ Centralize accentHover in ThemeMeta for single source of truth
