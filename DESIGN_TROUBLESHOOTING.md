# Design Troubleshooting Guide

## ✅ Quick Checklist

### What Should Look Like
The app should have:
- **Dark theme** with gray/black background (#0d0d0d, #212123, #40414f)
- **Teal/Green accents** for buttons and highlights (#10a37f)
- **Clean white text** on dark backgrounds
- **Smooth animations** on hover/click
- **Professional cards** with subtle borders
- **Beautiful gradients** for logo and accents

## 🔍 How to Verify Design Is Working

### 1. Check Navigation Bar
```
✓ Should be dark gray/black
✓ Logo "A" has green-teal gradient
✓ Navigation items have gray background
✓ Active nav item is slightly lighter
✓ Smooth hover effects
```

### 2. Check Chat Page (Homepage)
```
✓ Dark background (#0d0d0d)
✓ Large "Afrisca GPT" title in white
✓ Green circular icon (✨) with gradient
✓ 4 suggested question cards
✓ Cards have dark background with subtle border
✓ Cards highlight on hover
✓ Input field at bottom (dark gray)
✓ Button with teal color (#10a37f)
```

### 3. Chat Messages
When you send a message:
```
✓ User messages appear on right (white text)
✓ Assistant messages appear on left (gray text)
✓ Both have avatars (U for user, A for assistant)
✓ Divider line appears between messages
✓ Loading dots animate smoothly
✓ Smooth scrolling
```

### 4. Image Generation Page
```
✓ Dark background
✓ Form with dark input fields
✓ Size selection buttons (square, portrait, landscape)
✓ Teal button for "Generate Image"
✓ Image gallery with hover zoom effect
✓ Download button with teal color
```

## 🐛 Common Design Issues & Fixes

### Issue 1: Colors Look Wrong (Too Bright/Wrong Shade)
**Cause**: Tailwind colors vs custom CSS colors mismatch
**Fix**: 
- All custom colors are defined in `app/globals.css`
- Make sure you're not using Tailwind color classes directly
- Verify CSS is loaded: Check browser DevTools > Styles

### Issue 2: Custom Classes Not Applying
**Classes that should work**:
- `.card-gpt` - Dark card with border
- `.btn-gpt` - Teal button
- `.input-gpt` - Dark input field
- `.glass-dark` - Navigation background
- `.loading-dot` - Animated loading dots
- `.divider-gpt` - Gradient divider

**If not working**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh page (Ctrl+Shift+R)
3. Check DevTools Console for CSS errors
4. Verify `app/globals.css` exists and has content

### Issue 3: Layout Looks Broken
**Check navigation height**:
- Navigation should be ~68px tall
- Main content uses `h-[calc(100vh-68px)]`
- If height is wrong, adjust the calc value

**Check responsive design**:
- Use DevTools to test different screen sizes
- Navigation should collapse on mobile
- Suggested questions should be 1 column on mobile, 2 on desktop

### Issue 4: Text Colors Wrong
**Should be**:
- Primary text: `#ececf1` (off-white)
- Secondary text: `#8e8ea0` (gray)
- Heading text: `#ffffff` (pure white)
- Error text: `#ef4444` (red)

**If wrong**:
- Check the `color` property in global body rule
- Verify no Tailwind text-* classes override it

### Issue 5: Buttons Not Styled
**Teal button** (`.btn-gpt`):
- Background: `#10a37f`
- Hover: Darker teal with shadow
- Click: Scale down 0.98

**If not working**:
1. Check file `app/globals.css` line ~75
2. Verify CSS is in `@layer components`
3. Clear cache and refresh

## 📋 Browser DevTools Verification

### Step 1: Open DevTools (F12)
1. Right-click → Inspect
2. Or press F12

### Step 2: Check CSS
1. Click "Elements" tab
2. Inspect the main chat area
3. In the "Styles" panel, you should see:
   - `bg-gray-900` applied
   - Custom `.input-gpt` styles
   - `.btn-gpt` styles

### Step 3: Check Console
1. Click "Console" tab
2. Should see no errors
3. Look for any CSS parsing warnings

### Step 4: Check Computed Styles
1. Select an element
2. Click "Computed" tab
3. Verify colors are correct:
   - Background colors should be dark
   - Text colors should be light

## 🎨 Key Color Codes (Reference)

| Element | Color | Code |
|---------|-------|------|
| Background | Deep Black | #0d0d0d |
| Cards | Dark Gray | #212123 |
| Input Fields | Medium Gray | #40414f |
| Borders | Subtle Gray | #565869 |
| Primary Text | Off-White | #ececf1 |
| Secondary Text | Gray | #8e8ea0 |
| Accent Color | Teal | #10a37f |
| Hover State | Lighter Gray | #2a2b2f |

## 🚀 Performance Checklist

### CSS Files
```
✓ app/globals.css exists
✓ @tailwind directives present
✓ Custom @layer components defined
✓ @import url for Google Fonts
```

### Components
```
✓ Navigation.tsx loads correctly
✓ page.tsx (chat) renders
✓ image-generation/page.tsx renders
✓ All custom classes applied
```

### Build Output
```
✓ No CSS errors in build
✓ All routes built successfully
✓ No missing module errors
```

## 📱 Mobile Design Verification

### Mobile Viewport (375px width)
```
✓ Navigation text hidden, only emojis show
✓ Chat layout stacks properly
✓ Input field takes full width
✓ Suggested questions are 1 column
✓ No horizontal scroll
```

### Tablet Viewport (768px width)
```
✓ Navigation shows full text
✓ Suggested questions are 2 columns
✓ All spacing looks balanced
```

### Desktop Viewport (1024px+ width)
```
✓ Max-width containers work
✓ Full layout displays correctly
✓ All features visible
```

## 💡 Pro Tips

1. **Clear Cache**: If colors look wrong after an update
   ```
   Windows: Ctrl+Shift+Delete (then Clear)
   Mac: Cmd+Shift+Delete
   ```

2. **Hard Refresh**: Force reload CSS
   ```
   Windows: Ctrl+Shift+R
   Mac: Cmd+Shift+R
   ```

3. **Check CSS in DevTools**: 
   - Inspect element
   - Look for all applied styles
   - Verify no conflicting styles

4. **Zoom Test**: Test at different zoom levels (90%, 100%, 110%)

5. **Dark Mode**: Verify your OS/browser dark mode isn't interfering

## 🆘 Still Having Issues?

### Step 1: Check Dev Server Output
```bash
# Look for any errors in terminal where dev server is running
# Should show "Ready in Xms"
```

### Step 2: Clear Everything
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
npm run dev
```

### Step 3: Verify Files
- ✅ `app/globals.css` - exists and has content
- ✅ `app/components/Navigation.tsx` - exists
- ✅ `app/page.tsx` - exists with chat code
- ✅ `app/layout.tsx` - exists with proper structure

### Step 4: Compare Colors
- Use color picker tool in DevTools
- Verify actual vs expected colors
- Check if browser cache is the issue

## 📊 Design Specifications

### Typography
- **Font**: Plus Jakarta Sans (from Google Fonts)
- **Body**: 400 weight
- **Medium**: 500 weight
- **Bold**: 600-700 weight
- **Size**: 0.9375rem (15px) base
- **Line Height**: 1.75 (relaxed)

### Spacing
- **Gap/Padding**: 16px base unit
- **Border Radius**: 8px (buttons), 12px (cards), 18px (message bubbles)
- **Transitions**: 200ms ease-out

### Shadows
- **None on cards** (only border)
- **Button Hover**: `0 10px 15px rgba(16, 163, 127, 0.3)`
- **Navigation**: Subtle shadow

### Borders
- **Color**: #565869
- **Width**: 1px
- **Radius**: Varies by element

---

**Last Updated**: 2026-10-05
**Status**: All Design Issues Fixed ✅
