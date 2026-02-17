---
trigger: always_on
---

# Frontend Copilot Instructions

## Project Structure

The frontend is a **Vue 3 (Composition API)** application using **Vite** as the build tool with the following structure:

```
src/
├── components/          # Vue components organized by feature
│   ├── base/           # Base/shared components
│   ├── common/         # Common components used across features
│   ├── layout/         # Layout components
│   ├── [feature]/      # Feature-specific components (adminhub, analytics, etc.)
│   └── ...
├── pages/              # File-based routing pages (auto-routes)
├── composables/        # Vue 3 composables (reusable logic)
├── utils/              # Utility functions and helpers
├── locales/            # i18n translations
├── router/             # Router configuration
├── svgs/               # SVG assets
├── assets/             # Static assets
├── App.vue             # Root component
└── main.js             # Application entry point
```

## Path Aliases

Always use path aliases instead of relative paths:

```javascript
// ✅ Correct
import { useContentStudio } from "@composables/useContentStudio";
import BaseInput from "@components/base/BaseInput.vue";
import { dateFormat } from "@utils/dateTime";
import SearchIcon from "@svgs/search.svg";

// ❌ Incorrect
import { useContentStudio } from "../../composables/useContentStudio";
import BaseInput from "../../../../components/base/BaseInput.vue";
```

Available aliases:

- `@root` - src folder
- `@components` - src/components
- `@composables` - src/composables
- `@pages` - src/pages
- `@utils` - src/utils
- `@svgs` - src/svgs
- `@shared` - resources/js/shared

## Component Guidelines

### Naming Convention

- **Files:** PascalCase (e.g., `BaseButton.vue`, `ContentCard.vue`)
- **Component folders:** Organized by feature with lowercase names
- **Props/Data:** camelCase

### Component Structure

Always use `<script setup>` with this order:

```vue
<script setup>
import { ref, computed, watch } from "vue";
// All imports at the top, organized: Vue → Components → Utils → Composables

// --- Use (composables/utils)
const { data } = useComposable();

// --- Props & models
const props = defineProps({
  title: String,
  disabled: Boolean,
});
const emit = defineEmits(["change", "submit"]);

// --- Vars (ref, reactive)
const isLoading = ref(false);

// --- Handlers
function handleClick() {
  // Implementation
}

// --- Watchers & computed
const isDisabled = computed(() => props.disabled || isLoading.value);
watch(
  () => props.title,
  () => {
    // Implementation
  },
);

// --- Lifecycle hooks & related
onMounted(() => {
  // Implementation
});
</script>

<template>
  <!-- Template -->
</template>

<style scoped>
/* Optional scoped styles */
</style>
```

## Composables Guidelines

### Naming Convention

All composables must start with the `use` prefix (e.g., `useContentStudio.js`, `useNotifications.js`).

### Structure

```javascript
export function useMyComposable() {
  // --- Imports at the top
  const route = useRoute();
  const { data } = useSomeOtherComposable();

  // --- Reactive state
  const state = ref(null);
  const items = ref([]);

  // --- Computed properties
  const isEmpty = computed(() => items.value.length === 0);

  // --- Methods
  function loadData() {
    // Implementation
  }

  async function fetchItems() {
    // Implementation
  }

  // --- Watchers
  watch(
    () => route.params.id,
    () => {
      loadData();
    },
  );

  // --- Lifecycle
  onMounted(() => {
    loadData();
  });

  // Return only what's needed
  return {
    state,
    items,
    isEmpty,
    loadData,
    fetchItems,
  };
}
```

## Icons

**Rule:** Always use `@heroicons/vue` for all icons.

```vue
<script setup>
import { SearchIcon, UserIcon } from "@heroicons/vue/solid";
// or outline version
import { SearchIcon } from "@heroicons/vue/outline";
</script>

<template>
  <div>
    <SearchIcon class="w-6 h-6 text-gray-500" />
    <UserIcon class="w-5 h-5 text-blue-600" />
  </div>
</template>
```

## Function Declarations

**Rule:** Use function keyword declarations instead of arrow function expressions for named functions.

```javascript
// ✅ Correct
function handleClick() {
  console.log("clicked");
}

function processData(data) {
  return data.map((item) => item.value);
}

// ❌ Incorrect
const handleClick = () => {
  console.log("clicked");
};

const processData = (data) => {
  return data.map((item) => item.value);
};
```

**Exceptions:** Arrow functions are allowed for:

- Inline callbacks: `array.map(item => item.value)`
- Event handlers: `@click="() => handleAction(id)"`
- Array methods: `filter()`, `map()`, `reduce()`, etc.

## Logging

- **Never use console.log/error/warn/info/debug directly** in frontend
- Frontend logging should typically be avoided unless necessary for debugging
- Use the browser console methods during development only
- Any production logging should go through a proper logging service/composable

## Styling

- **Use Tailwind CSS** for all styling
- **Scoped styles only** when necessary with `<style scoped>`
- **Avoid inline styles** - use Tailwind classes instead
- **Follow Tailwind conventions** for responsive design and dark mode

## File-based Routing

The project uses **auto-routes** with `unplugin-vue-router`:

- Files in `src/pages/` automatically become routes
- Use `[id]` or `[...slug]` for dynamic segments
- Pages must be `.vue` files
- No need to manually define routes in router configuration

Example:

```
pages/
├── index.vue           → /
├── about.vue           → /about
├── [companyCode]/
│   └── index.vue       → /:companyCode
│   └── settings.vue    → /:companyCode/settings
├── admin/
│   └── [...404].vue    → /admin/... (catch-all)
```

## Internationalization (i18n)

- Store translations in `src/locales/`
- Use the `$t()` function in templates and composables
- Always provide translation keys for all user-facing strings

## Code Style

- **Linting:** Run `pnpm lint` before committing
- **Formatting:** Run `pnpm format` to format code with Prettier
- **Vue version:** Vue 3 with Composition API

## Common Patterns

### Using Router

```javascript
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// Access route params
console.log(route.params.id);

// Navigate
router.push({ name: "routeName", params: { id: 123 } });
```

### Using Composables in Components

```vue
<script setup>
import { useMyData } from "@composables/useMyData";

const { data, loading, error, fetchData } = useMyData();

onMounted(() => {
  fetchData();
});
</script>
```

### Conditional Rendering

```vue
<template>
  <div v-if="isLoading" class="text-center">Loading...</div>
  <div v-else-if="error" class="text-red-600">{{ error }}</div>
  <div v-else>{{ data }}</div>
</template>
```

## Component Organization by Feature

Group related components in feature folders:

- `components/adminhub/` - Admin hub related components
- `components/analytics/` - Analytics feature components
- `components/contents/` - Content management components
- `components/teams/` - Team management components
- etc.

Each feature folder should contain:

- Specific components for that feature
- Index files for exports if needed
- Sub-folders for complex feature variations

## Performance

- Use `v-show` vs `v-if` appropriately
- Lazy-load heavy components or pages when necessary
- Use computed properties instead of duplicate data
- Memoize expensive computations

## Accessibility

- Use semantic HTML elements
- Provide proper ARIA labels and attributes
- Ensure keyboard navigation support
- Use proper heading hierarchy
- Test with screen readers when possible
