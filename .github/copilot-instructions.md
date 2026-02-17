# GitHub Copilot Instructions

## Code Style Rules

### No shadow css design

**Rule:** Do not use shadow CSS design in any frontend components. Always use the bordered design pattern.

### Logging only for backend

**Rule:** Always use `console.safeLog()` for all logging in backend. Never use `console.log()`, `console.error()`, `console.warn()`, `console.info()`, or `console.debug()` directly.

**✅ Correct:**

```javascript
console.safeLog("Something went wrong", 0); // error
console.safeLog("This is a warning", 1); // warn
console.safeLog("Server started"); // info (default)
console.safeLog("Debug data:", data, 3); // debug
```

**❌ Incorrect:**

```javascript
console.log("Server started");
console.error("Something went wrong");
console.warn("This is a warning");
console.debug("Debug data:", data);
```

**Log Levels:**

- `0` = error
- `1` = warn
- `2` = info (default)
- `3` = debug

**Rationale:**

- Respects the configured `LOG_LEVEL` environment variable
- Prevents verbose logging in production environments
- Consistent logging across the entire codebase
- Easier to control log output based on environment

### Function Declarations

**Rule:** Always use function keyword declarations instead of arrow function expressions for named functions.

**✅ Correct:**

```javascript
function handleClick() {
  console.log("clicked");
}

function processData(data) {
  return data.map((item) => item.value);
}
```

**❌ Incorrect:**

```javascript
const handleClick = () => {
  console.log("clicked");
};

const processData = (data) => {
  return data.map((item) => item.value);
};
```

**Exceptions:**

- Arrow functions are allowed for:
  - Inline callbacks: `array.map(item => item.value)`
  - Event handlers passed as props: `@click="() => handleAction(id)"`
  - Array methods: `filter()`, `map()`, `reduce()`, etc.
  - Function expressions assigned to constants that need lexical `this` binding

**Rationale:**

- Function declarations are hoisted, improving code organization
- Clearer syntax for named functions
- Better stack traces in debugging
- Consistent with Vue 3 Composition API conventions

### Always use heroicons/vue for icons

**Rule:** Always use the `heroicons/vue` package for all icons in the frontend codebase. Do not use any other icon libraries or custom SVGs directly.

**✅ Correct:**

```vue
<template>
  <div>
    <SearchIcon class="w-6 h-6 text-gray-500" />
  </div>
</template>
<script setup>
import { SearchIcon } from '@heroicons/vue/solid'
```

**❌ Incorrect:**

```vue
<template>
  <div>
    <svg
      class="w-6 h-6 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
</template>
```

### Pivot Table Naming Pattern

**Rule:** All pivot tables (junction tables) must follow the `_on_` naming pattern: `table1_on_table2`.

**✅ Correct:**

```sql
users_on_teams
posts_on_tags
products_on_categories
```

**❌ Incorrect:**

```sql
user_teams
team_users
posts_tags
product_categories
```

**Pattern Format:**

- Use lowercase table names
- Use the `_on_` separator between table names
- Order tables alphabetically when appropriate for consistency
- If order matters, use the logical/semantic order (e.g., parent table first)

**Examples:**

- `users_on_teams` - Users associated with Teams
- `content_on_tags` - Content associated with Tags
- `platform_accounts_on_sync_events` - Platform Accounts associated with Sync Events

**Rationale:**

- Clear distinction between pivot/junction tables and regular tables
- Improves code readability and maintainability
- Makes database schema relationships immediately obvious
- Consistent naming convention across all database tables
