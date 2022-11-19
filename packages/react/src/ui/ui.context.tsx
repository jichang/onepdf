import React from 'react';
import { createContext, useContext } from 'react';
import { Button, Input, Select, Toolbar, ToolbarItemGroup } from './ui';

export interface UIComponents {
  ToolbarComponent: typeof Toolbar;
  ToolbarItemGroupComponent: typeof ToolbarItemGroup;
  ButtonComponent: typeof Button;
  SelectComponent: typeof Select;
  InputComponent: typeof Input;
}

export const DEFAULT_UI_COMPONENTS: UIComponents = {
  ToolbarComponent: Toolbar,
  ToolbarItemGroupComponent: ToolbarItemGroup,
  ButtonComponent: Button,
  SelectComponent: Select,
  InputComponent: Input,
};

export const UIComponentsContext = createContext<UIComponents>(
  DEFAULT_UI_COMPONENTS
);

export interface UIComponentsContextProviderProps {
  components: Partial<UIComponents>;
  children: JSX.Element;
}

export function UIComponentsContextProvider(
  props: UIComponentsContextProviderProps
) {
  const { children, components } = props;

  return (
    <UIComponentsContext.Provider
      value={{ ...DEFAULT_UI_COMPONENTS, ...components }}
    >
      {children}
    </UIComponentsContext.Provider>
  );
}

export function useUIComponents() {
  return useContext(UIComponentsContext);
}

export function useUIComponent<T extends keyof UIComponents>(is: T) {
  const binding = useUIComponents();
  return binding[is];
}

export function useButtonComponent() {
  return useUIComponent('ButtonComponent');
}

export function useToolbarComponent() {
  return useUIComponent('ToolbarComponent');
}

export function useSelectComponent() {
  return useUIComponent('SelectComponent');
}

export function useInputComponent() {
  return useUIComponent('InputComponent');
}

export interface UIStrings {
  unknownError: string;
  rotate0Deg: string;
  rotate90Deg: string;
  rotate180Deg: string;
  rotate270Deg: string;
  thumbnails: string;
  outlines: string;
  save: string;
  print: string;
  metadata: string;
  title: string;
  author: string;
  subject: string;
  keywords: string;
  producer: string;
  creator: string;
  creationDate: string;
  modificationDate: string;
}

export const DEFAULT_UI_STRINGS: UIStrings = {
  unknownError: 'Unknown Error',
  rotate0Deg: '0 degree',
  rotate90Deg: '90 degree',
  rotate180Deg: '180 degree',
  rotate270Deg: '270 degree',
  thumbnails: 'Thumbnails',
  outlines: 'Outlines',
  save: 'Save',
  print: 'Print',
  metadata: 'Metadata',
  title: 'Title',
  author: 'Author',
  subject: 'Subject',
  keywords: 'Keywords',
  producer: 'Producer',
  creator: 'Creator',
  creationDate: 'Creation Date',
  modificationDate: 'Modification Date',
};

export const UIStringsContext = createContext<UIStrings>(DEFAULT_UI_STRINGS);

export interface UIStringsContextProviderProps {
  strings: Partial<UIStrings>;
  children: JSX.Element;
}

export function UIStringsContextProvider(props: UIStringsContextProviderProps) {
  const { children, strings } = props;

  return (
    <UIStringsContext.Provider value={{ ...DEFAULT_UI_STRINGS, ...strings }}>
      {children}
    </UIStringsContext.Provider>
  );
}

export function useUIStrings() {
  return useContext(UIStringsContext);
}

export function useUIString<T extends keyof UIStrings>(key: T) {
  const strings = useContext(UIStringsContext);

  return strings[key] || key;
}
