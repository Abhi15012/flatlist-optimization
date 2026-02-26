# FlatList Optimization Project

So I was working on this React Native app and my FlatList was laggy AF when scrolling through products. Spent a bunch of time figuring out how to make it smooth, and thought I'd document what actually worked.

## How to Run This Thing

You'll need Node.js installed. Then just:

```bash
# Clone it
git clone <https://github.com/Abhi15012/flatlist-optimization.git>
cd flatlist_optimization/fl-optimise

# Install stuff
npm install

# Start it up
npm start
```

Then press `i` for iOS simulator, `a` for Android, or `w` for web.

Or you can directly run:
```bash
npm run ios      # if you're on Mac
npm run android  # if you have Android emulator
npx expo start 
```

## The Problem

When I first started, scrolling through the list was super janky. Images were loading slowly, scroll was dropping frames, and the app just felt bad to use. Here's what I did to fix it.

## What I Changed to Make it Fast

### 1. Fixed Heights with getItemLayout

This was a game changer. Instead of letting React Native measure each item (which is slow), I just told it the exact height:

```javascript
getItemLayout={(data, index) => ({ 
  length: ITEM_HEIGHT, 
  offset: ITEM_HEIGHT * index, 
  index 
})}
```

Basically, since all my items are the same height (350px), I can calculate where everything is without measuring. Makes scrolling way smoother.

### 2. Don't Render Everything at Once

```javascript
initialNumToRender={10}
```

Only render 10 items when the app starts. Otherwise it tries to render everything and freezes for a second. Nobody wants that.

### 3. Batch Rendering Settings

```javascript
maxToRenderPerBatch={12}
windowSize={5}
updateCellsBatchingPeriod={50}
```

These control how many items get rendered as you scroll:
- `maxToRenderPerBatch={12}` - render 12 items at a time while scrolling
- `windowSize={5}` - keep about 5 screen's worth of items rendered (some above, some below)
- `updateCellsBatchingPeriod={50}` - wait 50ms before rendering more items (makes scroll feel more responsive)

Honestly I tweaked these numbers a few times until it felt right.

### 4. Remove Off-Screen Views

```javascript
removeClippedSubviews={true}
```

This unmounts components that aren't visible. Saves a ton of memory, especially with lots of items.

### 5. Proper Keys

```javascript
keyExtractor={(item, index) => item.id.toString() || index.toString()}
```

Give each item a unique key so React knows which items changed. Using the product ID here.

### 6. Memoize the Card Component

```javascript
const ProductCards = React.memo(({ item }: { item: Product }) => {
  return (
    // card JSX...
  )
})
```

Without `React.memo`, every card re-renders when anything changes. With it, only cards with new data re-render. Huge difference.

### 7. Memoize the renderItem Function

```javascript
renderItem={useCallback(({ item }) => <ProductCards item={item} />, [])}
```

This keeps the render function stable across re-renders. Without it, FlatList thinks it got a new function and re-renders everything.

## Why I Use expo-image Instead of Regular Image

The default `Image` component sucks for lists. I switched to `expo-image` and it's way better:

```javascript
<Image
  source={{ uri: item.thumbnail }}
  cachePolicy="memory-disk"
  placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
  transition={200}
  contentFit="contain"
/>
```

**What's better about it:**

- **Caching** - Images are cached automatically (both in memory and disk). Scroll back up and images are already there. No re-downloading.
  
- **BlurHash Placeholder** - Shows a blurred version while loading instead of blank space. Looks much more polished.
  
- **Smooth fade-in** - 200ms transition when image loads. Subtle but nice.
  
- **Better memory handling** - Doesn't leak memory like the default Image sometimes does.

The difference is noticeable. With regular Image, scrolling would stutter when loading images. With expo-image, it's smooth.

## Results

Before optimizations:
- Laggy scrolling, maybe 30-40 FPS
- Images reloading when scrolling back up
- App sometimes crashed with large lists

After optimizations:
- Buttery smooth 60 FPS scrolling
- Images cached, no reloading
- Way less memory usage
- Battery doesn't drain as fast

## Tech Stack

- React Native + Expo
- TypeScript
- expo-image for images
- Fetching data from dummyjson.com



