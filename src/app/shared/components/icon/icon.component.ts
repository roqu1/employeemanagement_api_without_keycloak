import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
    <img
      [src]="iconPath"
      [class]="className"
      [alt]="name"
      [style.width.px]="width"
      [style.height.px]="height"
    />
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class IconComponent {
  @Input() name!: string;
  @Input() className?: string;
  @Input() width: number = 24;
  @Input() height: number = 24;

  get iconPath(): string {
    return `assets/icons/${this.name}.svg`;
  }
}
