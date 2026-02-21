# Focus Games - Project Documentation

## Project Overview

**Focus Games** is a collection of browser-based brain training games designed to improve cognitive abilities including working memory, typing speed, and mental arithmetic. The project emphasizes clean design, educational content, and scientifically-backed training exercises.

**Live Site:** https://focus.satm.io
**Repository:** https://github.com/satmachine/focus
**Platform:** GitHub Pages (static site)

## Project Philosophy

- **Science-backed exercises**: Games based on proven cognitive training methods
- **Educational content**: Incorporates classic literature, cultural literacy
- **Clean, minimal design**: Dark theme, gradient accents, smooth animations
- **Mobile-responsive**: Works seamlessly across devices
- **No dependencies**: Pure HTML/CSS/JavaScript - fast loading, no build steps
- **Privacy-focused**: No tracking, no external requests (except for own JSON data)

## File Structure

```
/focus/
├── index.html              # Main landing page with game cards
├── typing-game.html        # Typing speed test with classic literature
├── dual-n-back.html        # Dual N-Back working memory trainer
├── math-game.html          # Mental arithmetic challenge game
├── paragraphs.json         # Classic literature excerpts (71 entries)
├── CNAME                   # Custom domain configuration
└── CLAUDE.md              # This file - project documentation
```

### File Descriptions

#### `index.html`
- **Purpose**: Landing page showcasing all available brain training games
- **Design**: Hero section + responsive grid of game cards
- **Navigation**: Cards link to individual game pages
- **Games Featured**:
  - Dual N-Back (🧠) - Working memory training
  - Typing Speed Test (⌨️) - WPM tracking with literature
  - Math Challenge (🔢) - Mental arithmetic

#### `typing-game.html`
- **Purpose**: Typing speed test with real-time WPM and accuracy tracking
- **Features**:
  - Loads 71 classic literature paragraphs from `paragraphs.json`
  - Real-time character-by-character feedback (correct/incorrect highlighting)
  - Displays WPM (words per minute) and accuracy percentage
  - Shows source attribution after each test (author + work title)
  - Graceful fallback to built-in paragraphs if JSON fails
- **Educational Value**: Users practice typing while reading excerpts from renowned authors
- **Data Source**: `paragraphs.json`

#### `dual-n-back.html`
- **Purpose**: Cognitive training game to improve working memory
- **Method**: Dual N-Back task - proven to enhance fluid intelligence
- **Mechanics**: Users match visual positions and audio letters from N steps back
- **Status**: File exists but implementation details not yet documented

#### `math-game.html`
- **Purpose**: Mental arithmetic practice with adaptive difficulty
- **Operations**: Addition, subtraction, multiplication, division
- **Features**: Timed challenges, score tracking
- **Status**: File exists but implementation details not yet documented

#### `paragraphs.json`
- **Purpose**: Data source for typing game paragraphs
- **Structure**:
  ```json
  {
    "paragraphs": [
      {
        "text": "The paragraph text...",
        "source": "Book/Poem/Essay Title",
        "author": "Author Name",
        "category": "fiction|poetry|philosophy|drama|religious"
      }
    ]
  }
  ```
- **Content**: 71 classic literature excerpts including:
  - **19th Century Fiction**: Melville, Dickens, Austen, Tolstoy, Twain, Brontë, Hawthorne, Dostoevsky
  - **20th Century Fiction**: Fitzgerald, Hemingway, Orwell, Joyce, Kafka, Woolf, Harper Lee, Huxley, Salinger, Bradbury, Tolkien
  - **Poetry**: Shakespeare, Frost, Wordsworth, Dickinson, Dylan Thomas, Whitman, Keats, Byron, Shelley, Blake, Poe, Eliot, Cummings, Kipling
  - **Philosophy & Essays**: Descartes, Jefferson, Lincoln, Emerson, Thoreau, Mark Twain, Camus
  - **Drama**: Shakespeare (Hamlet, As You Like It)
- **Character Count**: Each paragraph is 120-250 characters (optimal for typing practice)

## Design System

### Color Palette

```css
--bg-dark: #0d0d1a;           /* Deep navy background */
--bg-light: #1a1a2e;          /* Lighter navy for gradients */
--text-primary: #e2e8f0;      /* Light gray text */
--text-secondary: #94a3b8;    /* Muted gray for subtitles */
--accent-purple: #a78bfa;     /* Primary accent */
--accent-pink: #e94560;       /* Secondary accent, buttons */
--success: #4ade80;           /* Correct answers, high accuracy */
--error: #f87171;             /* Incorrect answers */
--cursor: #a78bfa;            /* Typing cursor */
```

### Design Conventions

1. **Typography**:
   - System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
   - Monospace for typing: `'Courier New', monospace`
   - Gradient text for headings: `linear-gradient(135deg, var(--accent-purple), var(--accent-pink))`

2. **Layout**:
   - Max width containers: `800px` (game pages), `1200px` (index)
   - Border radius: `12px` (small cards), `20px` (large cards/sections)
   - Card backgrounds: `rgba(255, 255, 255, 0.05)` with `rgba(255, 255, 255, 0.1)` borders

3. **Interactions**:
   - Smooth transitions: `transition: all 0.3s ease`
   - Hover lifts: `transform: translateY(-8px)`
   - Button hovers: `transform: scale(1.05)`
   - Active states: `transform: scale(0.98)`

4. **Animations**:
   - Cursor blink: 1s infinite opacity animation
   - Gradient hover overlays: `opacity: 0 → 0.05`

### Mobile Responsiveness

- Breakpoint: `768px`
- Single column layouts on mobile
- Reduced font sizes and padding
- Touch-friendly button sizes (min 44px tap targets)

## Development Workflow

### Local Development

1. **Start Local Server**:
   ```bash
   python3 -m http.server 8000
   # or
   python -m http.server 8000
   ```

2. **Access Locally**:
   ```
   http://localhost:8000/
   http://localhost:8000/typing-game.html
   http://localhost:8000/dual-n-back.html
   http://localhost:8000/math-game.html
   ```

3. **Why Local Server?**:
   - Required for `fetch()` API to load `paragraphs.json`
   - `file://` protocol blocks CORS requests
   - Simulates GitHub Pages environment

### Testing Checklist

Before committing changes:

- [ ] Test in Chrome, Firefox, Safari
- [ ] Test on mobile devices (responsive design)
- [ ] Verify JSON loading (check browser console)
- [ ] Test fallback behavior (rename JSON to test error handling)
- [ ] Check for console errors
- [ ] Verify all links work
- [ ] Test keyboard navigation and accessibility
- [ ] Validate HTML/CSS (no syntax errors)

### Git Workflow (Pull Request Review Process)

**IMPORTANT**: All commits must go through the Pull Request (PR) review process with **BOTH automated reviewers** before merging to main. More eyes = better code quality.

**Note on Tools**:
- **Claude Code** (Claude Sonnet 4.5) - AI coding assistant that writes code (commit co-author)
- **CodeRabbit** - First automated PR reviewer (checks code quality, best practices, security)
- **ChatGPT Codex** - Second automated PR reviewer (additional perspective and validation)

**Both reviewers must approve before merge!**

#### Step-by-Step PR Workflow

1. **Check Status & Review Changes**:
   ```bash
   git status
   git diff
   ```

2. **Create Feature Branch**:
   ```bash
   git checkout -b feature/descriptive-name
   # Examples: feature/add-math-game, feature/fix-typing-bug, feature/update-styles
   ```

3. **Stage Changes**:
   ```bash
   git add <filename>
   # Add specific files only - avoid git add . or git add -A to prevent accidental commits
   ```

4. **Commit with Attribution**:
   ```bash
   git commit -m "$(cat <<'EOF'
   Brief summary of changes

   - Detailed point 1
   - Detailed point 2
   - Detailed point 3

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   EOF
   )"
   ```

5. **Push Feature Branch**:
   ```bash
   git push -u origin feature/descriptive-name
   ```

6. **Create Pull Request**:
   ```bash
   gh pr create --title "Descriptive PR Title" --body "$(cat <<'EOF'
   ## Summary
   Brief description of what this PR does

   ## Changes
   - Change 1
   - Change 2
   - Change 3

   ## Testing
   - [ ] Tested locally
   - [ ] Verified in multiple browsers
   - [ ] Checked mobile responsiveness
   - [ ] No console errors

   🤖 Ready for automated review (CodeRabbit + ChatGPT Codex)
   EOF
   )"
   ```

7. **Wait for Automated Reviews**:
   - **Both CodeRabbit AND ChatGPT Codex will review the PR**
   - **Approved**: Reviewer submits a formal GitHub "Approved" review (green ✅ checkmark in PR's Reviewers section)
   - **Issues Found**: Reviewer submits "Changes requested" review and leaves inline comments explaining fixes needed
   - **IMPORTANT**: Read through ALL comments from both reviewers
   - **If you have questions**: Respond to comments asking for clarification
   - **Note**: Review comments may contain emojis, but only formal approval (green ✅ in Reviewers) counts

8. **If Changes Requested (by either reviewer)**:
   - Read all comments carefully from both CodeRabbit and ChatGPT Codex
   - If anything is unclear, **reply to the comment asking questions**
   - Make the requested changes locally
   - Commit and push to the same branch:
     ```bash
     git add <files>
     git commit -m "Address review feedback: <description>"
     git push
     ```
   - PR updates automatically
   - Both reviewers will re-review
   - Repeat until **BOTH reviewers approve** (emoji responses)

9. **Merge PR (Only After BOTH Approvals)**:
   ```bash
   # Once BOTH CodeRabbit AND ChatGPT Codex submit formal "Approved" reviews (green ✅ in Reviewers section):
   gh pr merge --squash --delete-branch
   ```
   - ❌ **DO NOT merge with only one approval** - need both ✅
   - ❌ **DO NOT merge based on emoji comments** - need formal GitHub review approvals

10. **Verify Deployment**:
    - Changes go live automatically at https://focus.satm.io
    - Wait 1-2 minutes for GitHub Pages to rebuild
    - Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

#### PR Review Guidelines

**What CodeRabbit & ChatGPT Codex Review**:
- Code quality and best practices
- Potential bugs or security issues
- Performance considerations
- Accessibility compliance
- Consistency with project patterns
- Documentation completeness
- Architecture and design decisions
- Edge cases and error handling

**Response Patterns** (from both reviewers):
- ✅ **Formal "Approved" review** (green checkmark in Reviewers section) = Reviewer satisfied (need both!)
- 💬 **Comments with suggestions** = Changes requested → Update PR
- 🚨 **"Changes requested" review** = Do not merge → Fix issues immediately
- ❓ **Questions from reviewer** = Respond → Answer or clarify in comment replies
- 📝 **Note**: Comments may contain emojis (✅, 👍, 🎉), but only **formal GitHub approval reviews** count for merging

**Important Rules**:
- ❌ **NEVER** merge without approval from **BOTH** CodeRabbit AND ChatGPT Codex (emoji responses)
- ❌ **NEVER** use `git push --force` on branches under review
- ✅ **ALLOWED**: `git push --force-with-lease` after rebasing (safer force-push)
- ❌ **NEVER** merge main into feature branches (rebase instead if needed)
- ✅ **ALWAYS** read through all comments from both reviewers
- ✅ **ALWAYS** respond to comments if you have questions or need clarification
- ✅ **ALWAYS** address all comments before requesting re-review
- ✅ **ALWAYS** test changes locally before pushing
- ✅ **ALWAYS** delete feature branch after successful merge

**Rebasing Workflow** (when feature branch is behind main):
```bash
git fetch origin main
git rebase origin/main
# Resolve any conflicts
git push --force-with-lease  # Safe force-push after rebase
```

## Typing Game Implementation Details

### Architecture

The typing game uses a **async loading pattern** with graceful fallback:

1. **On page load**: Fetch `paragraphs.json` asynchronously
2. **If successful**: Load 71 classic literature excerpts
3. **If failed**: Fall back to 5 built-in paragraphs
4. **Initialize game**: Display random paragraph, start tracking

### Key JavaScript Variables

```javascript
let PARAGRAPHS_DATA = [];           // Full paragraph objects from JSON
let currentParagraph = '';          // Current text being typed
let currentParagraphData = null;    // Full data (for source attribution)
let startTime = null;               // Timestamp when typing starts
let timerInterval = null;           // Interval for WPM updates
let isGameActive = false;           // Game state flag
```

### Game Flow

1. **Page Load** → `loadParagraphs()` → `initGame()`
2. **Init Game** → Select random paragraph → Render → Focus input
3. **User Types** → First keystroke starts timer → Real-time feedback
4. **Character Matching**:
   - Correct: Green highlight
   - Incorrect: Red highlight with background
   - Cursor: Purple animated highlight
5. **Completion** → Calculate stats → Display results + source attribution
6. **Try Again** → Reset and select new paragraph

### WPM Calculation

```javascript
// Real-time WPM (during typing)
wpm = (typedWords / elapsedMinutes)

// Final WPM (on completion)
wpm = (totalWordsInParagraph / elapsedMinutes)
```

### Accuracy Calculation

```javascript
accuracy = (correctCharacters / totalTypedCharacters) * 100
```

### Source Attribution Format

Displayed after completing each test:
```
— Author Name, "Work Title"
```

Example:
```
— F. Scott Fitzgerald, "The Great Gatsby"
```

## Future Enhancement Ideas

### Typing Game
- [ ] **Difficulty Modes**: Short (100-150 chars), Medium (150-200), Long (200-250)
- [ ] **Category Filter**: Poetry only, Fiction only, Philosophy only
- [ ] **Custom Paragraphs**: Allow users to paste their own text
- [ ] **Progress Tracking**: Local storage for personal bests
- [ ] **Leaderboard**: Anonymous global WPM rankings
- [ ] **Keyboard Heatmap**: Show which keys cause most errors
- [ ] **Practice Mode**: Allow backspace, no time pressure
- [ ] **Sound Effects**: Subtle typing sounds, completion chime
- [ ] **Dark/Light Theme Toggle**: User preference

### General Improvements
- [ ] **Score Persistence**: LocalStorage for tracking progress across games
- [ ] **Daily Challenges**: One featured paragraph/challenge per day
- [ ] **Achievements System**: Badges for milestones (100 WPM, 99% accuracy, etc.)
- [ ] **Statistics Dashboard**: Aggregate stats across all games
- [ ] **Share Results**: Generate shareable images of scores
- [ ] **Progressive Web App**: Offline support, install to home screen
- [ ] **Accessibility**: ARIA labels, screen reader support, keyboard-only navigation

### Content Expansion
- [ ] **More Paragraphs**: Expand to 200+ classic literature excerpts
- [ ] **Modern Literature**: Add 20th/21st century works (copyright permitting)
- [ ] **Code Typing**: Practice typing code snippets (JavaScript, Python, etc.)
- [ ] **Multi-language**: Support for Spanish, French, German literature

## Code Style Guidelines

### HTML
- Semantic HTML5 elements
- Descriptive IDs and classes (kebab-case)
- Comments for major sections
- Accessibility attributes (aria-labels, roles)

### CSS
- CSS custom properties (variables) for all colors and common values
- Mobile-first responsive design
- Avoid `!important` (use specificity correctly)
- Group related properties (layout → typography → colors → transforms)

### JavaScript
- `const` by default, `let` when reassignment needed, never `var`
- Descriptive variable names (camelCase)
- Pure functions where possible (avoid side effects)
- Comments for complex logic
- Error handling with try/catch for async operations
- Console logs for debugging (remove before production)

### File Organization
- Inline CSS/JS in HTML files (single-file simplicity)
- External JSON for data (easy to update, cacheable)
- No build process required
- Keep files under 1000 lines when possible

## Performance Considerations

### Optimization Strategies
- **No External Dependencies**: Zero npm packages, no jQuery, no frameworks
- **Inline Assets**: All CSS/JS inline = fewer HTTP requests
- **Minimal JavaScript**: Only load what's needed per page
- **JSON Caching**: Browser caches `paragraphs.json` automatically
- **Lazy Loading**: Games only load when navigated to (separate HTML files)

### Bundle Size
- `index.html`: ~7 KB
- `typing-game.html`: ~16 KB
- `paragraphs.json`: ~65 KB
- **Total**: <100 KB for typing game (extremely fast load)

## Deployment

### GitHub Pages Configuration
- **Branch**: `main`
- **Directory**: `/` (root)
- **Custom Domain**: `focus.satm.io`
- **CNAME File**: Contains `focus.satm.io`
- **HTTPS**: Enforced by GitHub Pages

### DNS Configuration
- CNAME record: `focus.satm.io` → `satmachine.github.io`
- Managed at domain registrar

### Deployment Process
1. Push to `main` branch
2. GitHub Pages automatically rebuilds
3. Changes live in 1-2 minutes
4. No build step, no CI/CD required

## Known Issues & Limitations

### Current Limitations
- **No Backend**: All data is static, no user accounts
- **No Persistence**: Scores reset on page reload (use localStorage for future)
- **Single Language**: English only
- **Copyright**: Only public domain works (pre-1928 or explicitly free)

### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Not Supported**: Internet Explorer (uses modern JS features)

### Mobile Considerations
- Touch typing not ideal (on-screen keyboard)
- Best experience on desktop/laptop with physical keyboard
- Mobile works but typing game is harder

## Support & Maintenance

### Updating Paragraphs

To add new paragraphs to `paragraphs.json`:

1. Ensure text is public domain or properly licensed
2. Keep character count between 120-250 characters
3. Follow JSON structure:
   ```json
   {
     "text": "The paragraph...",
     "source": "Title",
     "author": "Author Name",
     "category": "fiction|poetry|philosophy|drama|religious"
   }
   ```
4. Validate JSON: https://jsonlint.com
5. Test locally before pushing
6. Commit and push to deploy

### Bug Reporting
- GitHub Issues: https://github.com/satmachine/focus/issues
- Include browser, OS, steps to reproduce
- Screenshots/videos helpful

### Contributing
- Fork repository
- Create feature branch
- Follow code style guidelines
- Test thoroughly
- Submit pull request with clear description

## Resources & References

### Cognitive Science
- **Dual N-Back**: Jaeggi et al. (2008) - Working memory training
- **Typing Speed**: Touch typing improves motor memory and focus
- **Mental Math**: Strengthens numerical cognition and problem-solving

### Design Inspiration
- Minimalist brain training apps
- Dark mode gaming interfaces
- Educational platforms (Khan Academy, Duolingo)

### Classic Literature Sources
- Project Gutenberg (public domain texts)
- Poetry Foundation (public domain poetry)
- Bartleby.com (reference works)

## License

This project uses public domain content and original code. All classic literature excerpts are from works in the public domain (published before 1928 or explicitly released).

---

**Last Updated**: 2026-02-21
**Maintained By**: @satmachine
**Built With**: ❤️ and Claude Code
