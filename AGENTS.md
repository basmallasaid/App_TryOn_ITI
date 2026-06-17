# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Recommendation Feature — Build Summary

### Goal
Implement the Recommendation feature with two screens (History + Detail) using auto-fetch logic.

### Status
- **Complete:** Context with auto-fetch at 6AM, navigation wiring, all reusable components, screens, translations.
- **In progress:** Debugging empty outfit items (images/names not rendering).

### Critical Bug Fixes
1. **Field name mismatch:** API returns items with `image_url` (snake_case) but code only checked `item.image`. All image references now use a defensive chain: `item.image_url || item.image || item.imageUrl || item.url || null`.
2. **`getItemImage` / `getItemsList` utility** (`src/utils/getItemImage.js`) centralizes image resolution and item-list extraction (handles `items`, `pieces`, `garments` array keys).
3. **Route name conflict:** `RECOMMENDATION` renamed to `RECOMMENDATION_DETAIL` for the inner detail screen so navigation params are not lost.
4. **Invalid icon:** Ionicons `"wind"` → MaterialCommunityIcons `"weather-windy"` in WeatherCard.
5. **History session wrapper:** Each history entry has `outfits: [...]` wrapping the real outfit. `getItemsList` now checks `outfit.outfits?.[0]` first, then falls back to the object directly.
6. **Base64 images:** Items may contain raw base64 strings (no `data:` prefix). `getItemImage` auto-detects base64 via regex and prepends `data:image/jpeg;base64,` prefix.
7. **Weather at API top-level:** POST returns `{ outfits, weather }` where `weather` is at the response level, not inside each outfit. Context now stores `todaysWeather` as a separate state variable, set from `result.weather` or `result.outfits[0]?.weather`.

### Field Name Convention (app-wide)
The codebase uses `image_url || image || imageUrl || url` as the fallback chain — see `TryOnScreen.js:55`, `TryOnResultsScreen.js:30`, `SelectModelScreen.js:105`. Always use `getItemImage()` for image fields.

### API Response Structure
- **GET /recommendations** — returns `{ history: [ { _id, user_id, outfits: [ { items: [...], score, breakdown, compositeImage? } ], weather: {...} } ], currentWeather: {...} }`
- **POST /recommendations** — returns `{ outfits: [ { items: [...], score, breakdown, compositeImage? } ], currentWeather: {...} }`
- Each `item` inside `items` has fields: `image` (base64 string or URL), `name`, etc.
- `compositeImage` at outfit level is a URL to a pre-merged image of all items in the outfit. Use `getCompositeImage(outfit)` from `getItemImage.js` — it auto-unwraps `outfits[0]` nesting.
- Images can be raw base64 (no `data:` prefix), full data URIs, or HTTP URLs.

### OutfitOverviewCard Image Priority
- `OutfitOverviewCard` renders `compositeImage` if available; falls back to the first item's image (`validImages[0]._image`).
- Always uses `resizeMode="contain"`.

### Architecture
- **Context:** `RecommendationContext` — auto-calls POST daily at/after 6AM; before 6AM shows cached. Re-checks on app foreground. Stores `todaysWeather` separately from `todaysOutfit` since weather comes at API response level.
- **Three entry points** (hero card, generate button, view style) navigate only; POST is never called from screens.
- **Reusable components:** `WeatherCard`, `OutfitOverviewCard` (configurable size/shape/gradient), `OutfitItemCard`.
- **Shared constants:** `weatherIcons.js` (Ionicons + MaterialCommunityIcons names per condition), `greeting.js`.
- **Image utility:** `getItemImage(item)` → tries `image_url → image → imageUrl → url`, auto-prepends `data:image/jpeg;base64,` for raw base64. `getItemsList(outfit)` → unwraps `outfits[0]` if present, then extracts items.

### Files Changed
- Created: `RecommendationContext.js`, `WeatherCard.js`, `OutfitOverviewCard.js`, `OutfitItemCard.js`, `weatherIcons.js`, `greeting.js`, `getItemImage.js`
- Edited: `routes.js`, `RootNavigator.js`, `RecommendationsStack.js`, `HomeScreen.js`, `OutfitCard.js`, `RecommendationScreen.js`, `RecommendationDetailsScreen.js`, `en.json`, `ar.json`, `RecommendationContext.js`

### Dark Mode Theming Fix

#### Goal
Move `const styles = StyleSheet.create({...})` from module scope into component functions so `Colors` values re-evaluate on theme change.

#### Approach
- Use `React.useMemo(() => StyleSheet.create({...}), [])` inside the component, placed right before the `return` statement
- If file already imports `useMemo`, use `useMemo()` directly
- Files missing `React` import get it added
- `CreateAvatarScreen` required extracting sub-component styles (`tabContent`, `genderLabel`, `genderRow`) into a module-level `subStyles` since `GeneralInfoTab` etc. are defined outside the main component

#### Files Modified (29 total)
- **Home:** `HomeScreen.js`, `RecentTryOnsScreen.js`, `RecentRecyclesScreen.js`
- **Recommendations:** `RecommendationScreen.js`, `RecommendationDetailsScreen.js`, `AllRecommendationsScreen.js`
- **Wardrobe:** `WardrobeScreen.js`, `EditWardrobeScreen.js`, `VerifyItemScreen.js`, `ItemDetailsScreen.js`
- **Profile:** `ProfileScreen.js`, `SubscriptionScreen.js`, `EditProfileScreen.js`, `AvatarDetailScreen.js`
- **Store:** `StoreScreen.js`, `ProductDetailScreen.js`, `FilterModal.js`
- **TryOn:** `TryOnScreen.js`, `TryOnResultsScreen.js`, `UploadPhotoScreen.js`
- **Recycle:** `RecycleScreen.js`, `RecycleResultScreen.js`
- **Matching:** `MatchingScreen.js`, `MatchingResultDetailsScreen.js`
- **Onboarding:** `OnboardingScreen.js`
- **Favorites:** `FavoritesScreen.js`
- **Notifications:** `NotificationsScreen.js`
- **SelectModel:** `SelectModelScreen.js`
- **Avatar:** `CreateAvatarScreen.js` (created `subStyles` for sub-components)

#### Excluded
- `src/screens/authentication/` — not processed
- `src/screens/language/SelectLanguageScreen.js` — not processed
- `src/screens/splash/SplashScreen.js` — uses hardcoded `#f6f6f6`, no `Colors` dependency
- `src/screens/settings/SettingsScreen.js` — empty styles object, no `Colors` dependency

#### Notes
- SplashScreen remains excluded because its styles use a hardcoded background color (`#f6f6f6`) rather than importing `Colors`.
- `StyleSheet.create` at module scope resolves `Colors` at import time; wrapping it in `React.useMemo` inside the component ensures it picks up the current theme values on each mount.

## Home Screen RTL Text Alignment Fix

### Root Cause
`I18nManager.isRTL` returns `false` in Expo SDK 54 even after `forceRTL(true)` + `reloadAsync()` (known Expo 54 bug). This breaks any JS-level `textAlign: isRTL ? 'right' : 'left'` checks and also affects RN's internal `textAlign` left/right auto-swap for `swapLeftAndRightInRTL`.

However, `I18nManager.forceRTL(true)` DOES work at the native level for flexbox (`flexDirection: 'row'` auto-flips to RTL).

### Solution
- **Wrap each Text in `<View style={{ flexDirection: 'row' }}>`** — Native RTL auto-flip correctly positions the Text at the right edge in RTL mode, at the left edge in LTR.
- **Use plain `textAlign: 'left'`** in StyleSheet definitions (no `isRTL` ternary) — RN's internal auto-swap handles text alignment within the Text component.
- **Do NOT depend on `useLanguage().isRTL` or `i18n.dir()`** for text alignment — these may report incorrect values in Expo 54.
- **Applied to:** `ActionCard`, `HeroBanner`, `OutfitCard`, `HomeScreen` section titles.
- **Padding on native ScrollView:** Move `paddingHorizontal: 20` from `ScrollView`'s `style` to a wrapper `<View>` to fix RTL centering (native ScrollView handles RTL padding inconsistently).
