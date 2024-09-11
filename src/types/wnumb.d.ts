declare module 'wnumb' {
    interface WNumb {
      to(val: number): string;
      from(val: string): number;
    }
  
    function wNumb(options?: {
      decimals?: number;
      mark?: string;
      thousand?: string;
      prefix?: string;
      postfix?: string;
      encoder?: (a: number) => number;
      decoder?: (a: number) => number;
      negativeBefore?: string;
      negative?: string;
      edit?: (a: string) => string;
      undo?: (a: string) => string;
    }): WNumb;
  
    export default wNumb;
  }
  