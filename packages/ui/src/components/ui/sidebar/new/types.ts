import type { Component } from 'vue';

export interface AppInfo {
  name: string;
  description: string;
  icon: Component;
  color: string;
  url?: string;
  id?: string;
}

export interface UserInfo {
  name: string;
  role: string;
}
