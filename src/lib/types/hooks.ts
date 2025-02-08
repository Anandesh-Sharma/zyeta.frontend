import { SetterOrUpdater } from "recoil";

export type IHookAction = "get" | "set";

export type HookStateReturnType<T, K extends IHookAction> = 
  K extends "get" ? T : SetterOrUpdater<T>;

export type HookSelectorReturnType<T, K extends IHookAction> = 
  K extends "get" ? T : T;