---
sessionId: session-260602-162223-qdvu
---

# Requirements

### Overview & Goals
Dodanie nowej zakładki **Zasady** zawierającej instrukcję obsługi aplikacji Libero MŚ2026.

### Scope
**In Scope:**
- Nowa zakładka `rules` w nawigacji
- Nowy komponent `RulesView` z treścią instrukcji
- Opis każdej zakładki: Gracze, Typy, Wyniki, Drabinka, Tabela
- Zasady punktacji
- Przewodnik krok po kroku

**Out of Scope:**
- Zmiany w logice aplikacji

# Technical Design

### Current Implementation
- Zakładki w `src/App.tsx` jako tablica `tabs: { id: Tab; label: string }[]`
- Typ `Tab`: `'players' | 'picks' | 'results' | 'bracket' | 'standings'`
- Widoki w `src/features/<name>/<Name>View.tsx`
- Styl: Tailwind CSS + `useThemeContext()` dla dark/light mode

### Proposed Changes

**Nowy plik `src/features/rules/RulesView.tsx`** — statyczny komponent z sekcjami:
- Jak zacząć (krok po kroku)
- Opis każdej zakładki
- Zasady punktacji (tabela)

Używa `useThemeContext()` analogicznie do `PlayersView`.

**Modyfikacja `src/App.tsx`:**
- Rozszerzenie typu `Tab` o `'rules'`
- Dodanie `{ id: 'rules', label: 'Zasady' }` do tablicy `tabs`
- Import i renderowanie `RulesView`

### File Structure
```
src/
  App.tsx                    <- modyfikacja
  features/
    rules/
      RulesView.tsx          <- nowy plik
```

# Delivery Steps

### ✓ Step 1: Utwórz komponent RulesView
Nowy plik src/features/rules/RulesView.tsx z pełną instrukcją obsługi.

- Stwórz komponent RulesView używający useThemeContext() do dark/light mode
- Dodaj sekcję Jak zacząć z krokami: dodaj graczy, złóż typy, śledź wyniki
- Dodaj opisy każdej zakładki: Gracze, Typy, Wyniki, Drabinka, Tabela
- Dodaj sekcję Zasady punktacji z tabelą punktów
- Styl zgodny z resztą aplikacji (Tailwind, karty)

### ✓ Step 2: Dodaj zakładkę Zasady do nawigacji
Zakładka Zasady pojawia się w pasku nawigacji i renderuje RulesView.

- Rozszerz typ Tab o 'rules' w src/App.tsx
- Dodaj { id: 'rules', label: 'Zasady' } do tablicy tabs
- Zaimportuj RulesView i dodaj warunkowe renderowanie w sekcji main