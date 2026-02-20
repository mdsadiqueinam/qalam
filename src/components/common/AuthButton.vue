<script setup>
import { UserCircleIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/vue/24/outline";
import { isFirebaseConfigured } from "@root/firebase/index";

// --- Use
const { currentUser, isAuthenticated, isSyncing, syncStatus, signIn, signOut } = useAuth();
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Sync status indicator -->
    <span v-if="isSyncing" class="text-xs text-main-text-muted font-medium animate-pulse">
      {{ syncStatus }}
    </span>

    <!-- Firebase not configured: hide auth button entirely -->
    <template v-if="isFirebaseConfigured">
      <!-- Signed in: show avatar + sign-out button -->
      <template v-if="isAuthenticated">
        <div class="flex items-center gap-2 border border-border-subtle rounded-lg px-3 py-1.5">
          <img
            v-if="currentUser.photoURL"
            :src="currentUser.photoURL"
            :alt="currentUser.displayName || 'User'"
            class="w-6 h-6 rounded-full object-cover"
          />
          <UserCircleIcon v-else class="w-6 h-6 text-main-text-muted" />
          <span class="text-sm font-medium text-main-text hidden sm:block truncate max-w-[120px]">
            {{ currentUser.displayName || currentUser.email }}
          </span>
        </div>
        <BaseButton
          variant="secondary"
          size="sm"
          iconOnly
          :title="'Sign out'"
          @click="signOut"
        >
          <template #icon>
            <ArrowRightStartOnRectangleIcon class="w-4 h-4" />
          </template>
        </BaseButton>
      </template>

      <!-- Signed out: show sign-in button -->
      <BaseButton
        v-else
        variant="secondary"
        size="sm"
        :disabled="isSyncing"
        @click="signIn"
      >
        <template #icon>
          <UserCircleIcon class="w-4 h-4" />
        </template>
        Sign in
      </BaseButton>
    </template>
  </div>
</template>
