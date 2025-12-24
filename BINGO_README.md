# Bingo Application - Technical Documentation

## Overview

A comprehensive mobile Bingo application built with React Native and Expo, featuring custom card generation, user-defined winning patterns, and real-time "waiting number" analysis.

## Features

### 1. **Bingo Card Generation & Local Persistence**

- **5×5 Grid Generation**: Following standard Bingo rules
  - B: 1-15
  - I: 16-30
  - N: 31-45 (Middle square is FREE)
  - G: 46-60
  - O: 61-75
- **Validation**: No duplicate numbers within a single card
- **Storage**: AsyncStorage for local-first data persistence
- **Architecture**: Abstracted storage layer for easy cloud migration (Firebase/Supabase)

### 2. **Custom Winning Pattern Engine**

- **Pattern Creator**: Interactive UI to define winning patterns
- **Multiple Patterns**: Store and manage unlimited custom patterns
- **Pattern Validation**: Real-time checking against active cards
- **Predefined Patterns**: Four Corners, X-Shape, Plus Sign, Full House, etc.

### 3. **Real-Time "Waiting Number" Analysis**

- **Predictive Logic**: Compares called numbers against cards and patterns
- **Missing Number Display**: Shows specific numbers needed to complete patterns
- **"On Pot" Detection**: Visual alerts when one number away from winning
- **Priority Sorting**: Cards sorted by proximity to winning

## Project Structure

```
bingoapp/
├── src/
│   ├── logic/
│   │   └── bingoGenerator.ts      # Card generation algorithms (1-75 distribution)
│   ├── services/
│   │   ├── storageService.ts      # Abstracted storage layer (AsyncStorage)
│   │   ├── patternService.ts      # Pattern management and validation
│   │   └── waitingNumberService.ts # Real-time analysis engine
│   ├── components/
│   │   ├── BingoCard.tsx          # Bingo card UI component
│   │   └── PatternCreator.tsx     # Pattern creation interface
│   └── screens/
│       ├── GameScreen.tsx         # Main game with number calling
│       ├── CardsScreen.tsx        # Card management
│       └── PatternsScreen.tsx     # Pattern management
├── app/
│   └── (tabs)/                    # Navigation structure
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Steps

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npx expo start
   ```

3. **Run on Device**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

## Usage Guide

### Getting Started

#### 1. Create Bingo Cards

- Navigate to **Cards** tab
- Tap **"+ New Card"** to generate a random card
- Cards follow standard Bingo rules with validated number distribution
- Delete cards by tapping the **Delete** button

#### 2. Define Winning Patterns

- Navigate to **Patterns** tab
- Tap **"+ Create Pattern"** to open the pattern creator
- **Option A - Quick Presets**: Select from predefined patterns (Four Corners, X-Shape, etc.)
- **Option B - Custom Pattern**:
  - Enter a pattern name
  - Tap squares on the 5×5 grid to toggle them
  - Selected squares (blue) represent required positions
  - Tap **Save Pattern** when done

#### 3. Play the Game

- Navigate to **Game** tab
- **Call Numbers**:
  - Tap **"Call Number"** for random number generation
  - Tap **"Manual"** to enter a specific number
- **Watch for Wins**:
  - Cards automatically mark called numbers (green cells)
  - Analysis shows missing numbers for each pattern
  - 🔥 **"ON POT"** alerts appear when one number away
  - 🎉 **"WINNER"** alerts show when pattern is completed
- **Reset Game**: Tap **Reset** to clear all called numbers

### Understanding the Analysis

#### Status Indicators

- ✅ **Winner**: Pattern completed
- 🔥 **On Pot**: One number away from winning
- 📊 **Missing Numbers**: Shows which numbers are needed

#### Example Analysis Display

```
🔥 ON POT! Need 42 to win Four Corners

Missing (3): 12, 35, 58
Pattern: Horizontal Line (Top)
```

## API Architecture

### Storage Service Layer

All data operations are abstracted in `storageService.ts`:

```typescript
// Current: AsyncStorage
await saveCard(card);
await getAllCards();
await deleteCard(cardId);

// Future: Simply swap implementation
// Example: Firebase
await firestore.collection("cards").add(card);
```

**Benefits**:

- UI components don't know about storage implementation
- Easy migration to cloud services
- Consistent API across the app

### Card Generation Algorithm

```typescript
// Generate card
const card = generateBingoCard();

// Validate (no duplicates)
const isValid = validateBingoCard(card);

// Mark number
const updatedCard = markNumber(card, 42);
```

### Pattern Validation

```typescript
// Check if card matches pattern
const isWinner = checkPattern(card, pattern);

// Get missing numbers
const missing = getMissingNumbers(card, pattern);

// Check if "on pot" (one away)
const onPot = isOnPot(card, pattern);
```

### Real-Time Analysis

```typescript
// Analyze all cards against all patterns
const analysis = analyzeGame(cards, patterns);

// Get cards on pot
const potCards = analysis.potCards;

// Get winners
const winners = analysis.winningCards;

// Get numbers to watch
const watchNumbers = analysis.nextNumbersToWatch;
```

## Technical Details

### Number Distribution

- **Column B**: Numbers 1-15 (15 possible)
- **Column I**: Numbers 16-30 (15 possible)
- **Column N**: Numbers 31-45 (14 possible + FREE space)
- **Column G**: Numbers 46-60 (15 possible)
- **Column O**: Numbers 61-75 (15 possible)

### Validation Rules

1. No duplicate numbers within a card
2. Each column must contain exactly 5 cells (including FREE)
3. FREE space always at position [2,2] (center)
4. Numbers must be within valid range for each column

### Pattern Requirements

1. At least one square must be selected
2. Grid must be 5×5
3. Pattern can include or exclude FREE space
4. Multiple patterns can be active simultaneously

## Future Enhancements

### Planned Features

- [ ] Cloud sync (Firebase/Supabase integration)
- [ ] Multiplayer support
- [ ] Voice number calling
- [ ] Pattern sharing between users
- [ ] Game history and statistics
- [ ] Customizable card themes
- [ ] Auto-daub mode
- [ ] Multiple card support (play many cards at once)

### Migration Path to Cloud

Replace `storageService.ts` implementation:

```typescript
// Current: AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Future: Firebase
import { getFirestore, collection, addDoc } from "firebase/firestore";

export async function saveCard(card: BingoCard): Promise<void> {
  const db = getFirestore();
  await addDoc(collection(db, "cards"), card);
}
```

**No changes needed in UI components!**

## Development

### Run Tests (Future)

```bash
npm test
```

### Type Checking

```bash
npx tsc --noEmit
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### Common Issues

**Issue**: "Cards not showing up"

- **Solution**: Create at least one card from the Cards tab

**Issue**: "No patterns available"

- **Solution**: Create or load a pattern from the Patterns tab

**Issue**: "Numbers not marking on card"

- **Solution**: Ensure you're calling numbers from the Game tab, not Cards tab

**Issue**: "App crashes on startup"

- **Solution**: Clear AsyncStorage data or reinstall app

### Debug Mode

Enable console logs in service files to see data operations:

```typescript
console.log("Saving card:", card);
console.log("Loaded patterns:", patterns);
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using React Native & Expo**
