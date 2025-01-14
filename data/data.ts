import { MessageCircle } from 'lucide-react';

export interface CodeSnippet {
  title: string;
  description: string;
  code: string;
}

export const installationData: Record<string, CodeSnippet> = {
  react: {
    title: "React",
    description: "Create a ChatWidget component and add it to your React application.",
    code: `import { MessageCircle } from 'lucide-react';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {isOpen && (
        <iframe
          src="YOUR_GENERATED_LINK"
          className="fixed bottom-20 right-4 w-[500px] h-[600px] rounded-lg shadow-lg z-50"
        />
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </>
  );
}`
  },
  next: {
    title: "Next.js",
    description: "Create a client-side ChatWidget component for your Next.js application.",
    code: `'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {isOpen && (
        <iframe
          src="YOUR_GENERATED_LINK"
          className="fixed bottom-20 right-4 w-[500px] h-[600px] rounded-lg shadow-lg z-50"
        />
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </>
  );
}`
  },
  vue: {
    title: "Vue.js",
    description: "Create a ChatWidget component for your Vue application.",
    code: `<template>
  <div>
    <Transition name="fade">
      <iframe
        v-if="isOpen"
        :src="'YOUR_GENERATED_LINK'"
        class="fixed bottom-20 right-4 w-[500px] h-[600px] rounded-lg shadow-lg z-50"
      />
    </Transition>
    <button
      @click="toggleChat"
      class="fixed bottom-4 right-4 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all z-50"
    >
      <MessageCircle class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MessageCircle } from 'lucide-vue-next';

const isOpen = ref(false);
const toggleChat = () => isOpen.value = !isOpen.value;
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>`
  },
  svelte: {
    title: "Svelte",
    description: "Create a ChatWidget component for your Svelte application.",
    code: `<script>
  import { MessageCircle } from 'lucide-svelte';
  let isOpen = false;
</script>

{#if isOpen}
  <iframe
    src="YOUR_GENERATED_LINK"
    class="fixed bottom-20 right-4 w-[500px] h-[600px] rounded-lg shadow-lg z-50"
  />
{/if}

<button
  on:click={() => isOpen = !isOpen}
  class="fixed bottom-4 right-4 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all z-50"
>
  <MessageCircle size={24} />
</button>

<style>
  iframe {
    transition: all 0.2s;
  }
</style>`
  },
  angular: {
    title: "Angular",
    description: "Create a ChatWidget component for your Angular application.",
    code: `// chat-widget.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-widget',
  template: \`
    <ng-container *ngIf="isOpen">
      <iframe
        [src]="'YOUR_GENERATED_LINK' | safe"
        class="fixed bottom-20 right-4 w-[500px] h-[600px] rounded-lg shadow-lg z-50"
      ></iframe>
    </ng-container>
    
    <button
      (click)="isOpen = !isOpen"
      class="fixed bottom-4 right-4 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all z-50"
    >
      <message-circle-icon></message-circle-icon>
    </button>
  \`
})
export class ChatWidgetComponent {
  isOpen = false;
}`
  }
};