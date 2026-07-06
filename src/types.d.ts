 export {};

declare global {
  interface Window {
    gearshift?: {
      switchModel: (command: string) => Promise<boolean>;
    };
  }
}